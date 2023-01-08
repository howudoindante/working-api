import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';
import { PrismaService } from '../services/prisma.service';
import { TOKENFIELD } from '../../config/config';
import { ResponseDTO } from '../../dto/response.dto';
import { PrivateUserDTO } from '../../dto/account.dto';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly translationService: TranslationService,
  ) {}

  async getMyData(
    request: Request,
    lang: string,
  ): Promise<ResponseDTO<PrivateUserDTO>> {
    try {
      const token = request.headers[TOKENFIELD];
      if (token) {
        const decoded = new JwtService().decode(token);
        if (decoded) {
          const mineData = await this.prismaService.user.findFirst({
            where: { username: decoded.username },
          });
          if (mineData) {
            return {
              data: {
                username: mineData.username,
                email: mineData.email,
                shortlink: mineData.shortlink,
                name: mineData.name,
              },
            };
          } else {
            throw new Error('');
          }
        }
      } else {
        const error = await this.translationService.translate(
          'errors.users.me',
          {
            lang,
          },
        );
        throw new Error(error);
      }
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
