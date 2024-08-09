import { HttpException } from '@nestjs/common';
import { ErrorCode, code2message, code2status } from './error-codes';

export class ServerException extends HttpException {
  constructor(code: ErrorCode) {
    const message = code2message.get(code);
    const status = code2status.get(code);

    if (message && status) {
      super({ message }, status);
    }
  }
}
