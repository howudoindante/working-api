import { HttpException, Injectable } from '@nestjs/common';
import { Credentials } from './interfaces/users.interface';
import { PrismaService } from '../services/prisma.service';
import { ResponseDTO } from '../../dto/response.dto';
import { JwtService } from '../services/jwt.service';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private translation: TranslationService,
  ) {}

  async login(credentials: Credentials): Promise<ResponseDTO> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username: credentials.username },
      });
      if (user) {
        const isPasswordRight = user.password === credentials.password;
        if (isPasswordRight) {
          const token = this.jwt.generate({
            id: user.id,
            username: user.username,
          });
          return {
            data: {
              token,
            },
          };
        }
      }

      // If credentials wrong

      const error = await this.translation.translate('errors.authentication');
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}