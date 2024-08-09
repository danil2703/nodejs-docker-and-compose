import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, In, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async createWish(user: User, createWishDto: CreateWishDto) {
    const wish = await this.wishesRepository.create(createWishDto);
    wish.owner = user;
    return this.wishesRepository.save(wish);
  }

  findOne(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(query);
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wish;
  }

  async getUserWishes(id: number) {
    const wishes = await this.wishesRepository.find({
      where: {
        owner: { id },
      },
      relations: [],
    });

    if (!wishes) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wishes;
  }

  async getWishInfoById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wish;
  }

  async updateWishInfo(
    userId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.getWishById(id);

    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.EditForbidden);
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ServerException(ErrorCode.RaisedNotNull);
    }

    await this.wishesRepository.update(wish.id, updateWishDto);
  }

  async copyWish(user: User, wishId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, createdAt, updatedAt, owner, ...wish } =
        await this.getWishById(wishId);

      this.createWish(user, wish);

      this.wishesRepository.update(wishId, {
        copied: wish.copied + 1,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getLastWishes(take: number) {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
      take,
    });

    if (!wishes) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wishes;
  }

  async getPopularWishes(take: number) {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: {
        copied: 'DESC',
      },
      take,
    });

    if (!wishes) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wishes;
  }

  async updateRaised(wishId: number, raised: number) {
    return await this.wishesRepository.update(wishId, { raised });
  }

  async getWishesByIds(ids: number[]) {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      where: {
        id: In(ids),
      },
    });

    if (!wishes || wishes.length === 0) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wishes;
  }

  async removeOne(userId: number, wishId: number) {
    const wish = await this.getWishById(wishId);

    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.DeleteForbidden);
    }

    await this.wishesRepository.delete(wishId);
  }
}
