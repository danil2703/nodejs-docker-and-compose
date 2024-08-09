import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private dataSource: DataSource,
  ) {}

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId);

    if (wish.owner.id === user.id) {
      throw new ServerException(ErrorCode.DonateSelfWish);
    }

    const sum = Number(wish.raised + createOfferDto.amount);

    if (sum > wish.price) {
      throw new ServerException(ErrorCode.SumExcess);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.wishesService.updateRaised(wish.id, sum);
      this.offersRepository.save({
        ...createOfferDto,
        item: wish,
        hidden: !!createOfferDto.hidden,
        user,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {};
  }

  async getAllOffers() {
    return await this.offersRepository.find({
      relations: ['user'],
    });
  }

  async getOfferById(id: number) {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['user', 'user.wishes', 'user.wishlists'],
    });

    if (!offer) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return offer;
  }
}
