import { HttpException } from '@nestjs/common';

export class ApiError extends Error {
  constructor(public code: number, public message: string) {
    super(message);
    this.name = 'Api Error';
    this.code = code;
  }
}

export class HttpError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
    this.name = 'Http Error';
    this.code = code;
  }

  static send(message: string, code: number) {
    return new HttpException(message, code);
  }
}
