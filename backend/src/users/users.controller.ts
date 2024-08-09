import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestExceptionFilter } from 'src/filters/bad-request-exception.filter';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@AuthUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @UseFilters(BadRequestExceptionFilter)
  @Patch('me')
  updateOwnData(@AuthUser() user: User, @Body() data: UpdateUserDto) {
    return this.usersService.update(user.id, data);
  }

  @Get('me/wishes')
  findOwnWhishes(@AuthUser() user: User) {
    return this.usersService.getUserWishesById(user.id);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(':username/wishes')
  async findWishesByUsername(@Param('username') username: string) {
    return await this.usersService.getUserWishesByUsername(username);
  }

  @Post('/find')
  findUsersByNameOrEmail(@Body('query') query: string) {
    return this.usersService.findUsersByNameOrEmail(query);
  }
}
