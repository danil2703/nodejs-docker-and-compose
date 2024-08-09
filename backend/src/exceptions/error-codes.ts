import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExists = 101,
  BadRequest = 102,
  NotFound = 103,
  DeleteForbidden = 104,
  EditForbidden = 105,
  DonateSelfWish = 106,
  SumExcess = 107,
  RaisedNotNull = 108,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Некорректная пара логин и пароль'],
  [
    ErrorCode.UserAlreadyExists,
    'Пользователь с таким email или username уже зарегистрирован',
  ],
  [ErrorCode.BadRequest, 'Ошибка валидации, некорректные данные'],
  [ErrorCode.NotFound, 'Ресурс не найден'],
  [ErrorCode.DeleteForbidden, 'Чтобы удалить ресурс нужно быть его владельцем'],
  [ErrorCode.EditForbidden, 'Чтобы обновить ресурс нужно быть его владельцем'],
  [ErrorCode.DonateSelfWish, 'Нельзя скинуться на собственный подарок'],
  [ErrorCode.SumExcess, 'Нельзя скинуться больше, чем стоит подарок'],
  [
    ErrorCode.RaisedNotNull,
    'Нельзя редактировать сумму когда пользователи уже скинулись',
  ],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.UNAUTHORIZED],
  [ErrorCode.UserAlreadyExists, HttpStatus.CONFLICT],
  [ErrorCode.BadRequest, HttpStatus.BAD_REQUEST],
  [ErrorCode.NotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.DeleteForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.EditForbidden, HttpStatus.FORBIDDEN],
  [ErrorCode.DonateSelfWish, HttpStatus.FORBIDDEN],
  [ErrorCode.SumExcess, HttpStatus.FORBIDDEN],
  [ErrorCode.RaisedNotNull, HttpStatus.FORBIDDEN],
]);

/* Type Orm entity exist code */
export const entityAlredyExistCode = '23505';
