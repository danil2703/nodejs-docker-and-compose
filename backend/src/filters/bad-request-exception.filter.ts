import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  code2message,
  code2status,
  ErrorCode,
} from 'src/exceptions/error-codes';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = code2status.get(ErrorCode.BadRequest);

    response.status(status).json({
      message: code2message.get(ErrorCode.BadRequest),
      status: status,
    });
  }
}
