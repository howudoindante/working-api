import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ITokenPayloadType } from '../../types/token.type';
import { Logger } from '../../utils/Logging';
import { ApiError } from '../../utils/ApiErrors';

@Injectable()
export class JwtService {
  generate(payload: ITokenPayloadType) {
    try {
      const token = sign(payload, '123');
      if (!token) {
        throw new ApiError(401, '123');
      } else {
        return token;
      }
    } catch (e) {
      return new Logger(e.message);
    }
  }

  decode(token: string) {
    return verify(token, '123');
  }
}
