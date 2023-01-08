import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ITokenDecoded, ITokenPayloadType } from '../../types/token.type';
import { Logger } from '../../utils/Logging';
import { ApiError } from '../../utils/ApiErrors';
import * as process from 'process';

@Injectable()
export class JwtService {
  generate(payload: ITokenPayloadType, error: string) {
    try {
      const token = sign(payload, process.env.SECRET);
      if (!token) {
        throw new ApiError(401, error);
      } else {
        return token;
      }
    } catch (e) {
      return new Logger(e.message);
    }
  }

  decode(token: string): ITokenDecoded {
    return verify(token, process.env.SECRET) as ITokenDecoded;
  }
}
