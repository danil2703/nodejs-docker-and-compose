import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.createWishlist(user, createWishlistDto);
  }

  @Get()
  getAllWishlists() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  getAllWishlistsById(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateWishlistInfo(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateWishlistInfo: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(user.id, id, updateWishlistInfo);
  }

  @Delete(':id')
  removeWishlistByid(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishlistsService.remove(user.id, id);
  }
}
