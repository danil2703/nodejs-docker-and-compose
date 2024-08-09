import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
