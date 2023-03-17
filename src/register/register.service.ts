import { HttpException, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { PrismaService } from '../services/prisma.service';
import { Credentials } from '../login/interfaces/users.interface';
import { TranslationService } from '../services/translation.service';
import { ROLE_USER } from '../../constants/roles';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,
    private translation: TranslationService,
  ) {}

  async register(
    credentials: Required<Credentials>,
    lang: string,
  ): Promise<ResponseDTO> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username: credentials.username },
      });

      if (!user) {
        const userRole = await this.prisma.role.findFirst({
          where: {
            name: ROLE_USER,
          },
        });
        if (userRole) {
          await this.prisma.user.create({
            data: {
              username: credentials.username,
              password: credentials.password,
              email: credentials.email ?? null,
              name: credentials.name ?? null,
              roleId: userRole.id,
            },
          });
        } else {
          const error = await this.translation.translate(
            'errors.registration',
            {
              lang,
            },
          );
          throw new Error(error);
        }
        return {};
      }

      // If credentials wrong

      const error = await this.translation.translate('errors.registration', {
        lang,
      });
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
