import { HttpException, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { PrismaService } from '../services/prisma.service';
import { Credentials } from '../login/interfaces/users.interface';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,
    private translation: TranslationService,
  ) {}

  async register(credentials: Credentials): Promise<ResponseDTO> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username: credentials.username },
      });

      if (!user) {
        await this.prisma.user.create({
          data: {
            username: credentials.username,
            password: credentials.password,
            email: null,
            name: null,
          },
        });
        return {};
      }

      // If credentials wrong

      const error = await this.translation.translate('errors.registration');
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
