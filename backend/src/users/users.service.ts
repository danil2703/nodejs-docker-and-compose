import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/common/helpers/hash';
import { ServerException } from 'src/exceptions/server.exception';
import { entityAlredyExistCode, ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });
    return this.usersRepository.save(user).catch((err) => {
      if (err.code === entityAlredyExistCode) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userPassword = updateUserDto.password;
    const user = await this.findById(id);
    if (userPassword) {
      updateUserDto.password = await hashValue(userPassword);
    }

    const { password, ...result } = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });

    return result;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async getUserWishesById(userId: number) {
    const resultUser = await this.findOne({
      where: { id: userId },
      relations: ['wishes', 'wishes.offers', 'wishes.owner'],
    });

    if (!resultUser) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return resultUser.wishes;
  }

  async getUserWishesByUsername(username: string) {
    const resultUser = await this.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers', 'wishes.owner'],
    });

    if (!resultUser) {
      throw new ServerException(ErrorCode.NotFound);
    }

    return resultUser.wishes;
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOne(query);
  }

  findUsersByNameOrEmail(query: string) {
    return this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
}
