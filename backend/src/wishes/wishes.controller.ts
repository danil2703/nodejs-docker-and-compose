import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  getPopularWishes() {
    return this.wishesService.getPopularWishes(20);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes(40);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createWish(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.createWish(user, createWishDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getWishById(@Param('id') id: number) {
    return this.wishesService.getWishInfoById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeById(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.removeOne(user.id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateWish(
    @AuthUser() user: User,
    @Param('id') wishId: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWishInfo(user.id, wishId, updateWishDto);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copyWish(@AuthUser() user: User, @Param('id') wishId: number) {
    return this.wishesService.copyWish(user, wishId);
  }
}
