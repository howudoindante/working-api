import { HttpException, Injectable } from '@nestjs/common';
import { Credentials } from './interfaces/users.interface';
import { PrismaService } from '../services/prisma.service';
import { JwtService } from '../services/jwt.service';
import { TranslationService } from '../services/translation.service';
import { ResponseDTO } from '../../dto/response.dto';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private translation: TranslationService,
  ) {}

  async login(
    req,
    res,
    credentials: Credentials,
    lang: string,
  ): Promise<ResponseDTO> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username: credentials.username },
        select: {
          id: true,
          username: true,
          password: true,
          role: true,
        },
      });

      if (user) {
        const isPasswordRight = user.password === credentials.password;
        if (isPasswordRight) {
          const tokenError = await this.translation.translate(
            'errors.token.create',
            {
              lang,
            },
          );
          const token = this.jwt.generate(
            {
              id: user.id,
              username: user.username,
              role: user.role.name,
            },
            tokenError,
          );
          res.cookie('vispsprt', token, {
            httpOnly: true,
            domain: process.env.FRONTEND_DOMAIN,
          });

          return {
            data: {
              token,
            },
          };
        }
      }

      // If credentials wrong

      const error = await this.translation.translate('errors.authentication', {
        lang,
      });
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
