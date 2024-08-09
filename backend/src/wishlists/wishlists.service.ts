import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async createWishlist(user: User, createWishlistDto: CreateWishlistDto) {
    const items = await this.wishesService.getWishesByIds(
      createWishlistDto.itemsId,
    );

    const wishlist = await this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
    });

    wishlist.owner = user;

    return this.wishlistsRepository.save(wishlist);
  }

  findAll() {
    return this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  findOne(id: number) {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async getWishlistById(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return wishlist;
  }

  async update(
    userId: number,
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishList = await this.getWishlistById(id);

    if (userId !== wishList.owner.id) {
      throw new ServerException(ErrorCode.EditForbidden);
    }

    if (updateWishlistDto.itemsId) {
      const items = await this.wishesService.getWishesByIds(
        updateWishlistDto.itemsId,
      );
      wishList.items = items;
    }

    return await this.wishlistsRepository.save({
      id,
      items: wishList.items,
      ...updateWishlistDto,
    });
  }

  async remove(userId: number, wishId: number) {
    const wish = await this.getWishlistById(wishId);

    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.DeleteForbidden);
    }

    await this.wishlistsRepository.delete(wishId);
  }
}
