import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';
import { PrismaService } from '../services/prisma.service';
import { ResponseDTO } from '../../dto/response.dto';
import { PrivateUserDTO, PublicUserDTO } from '../../dto/account.dto';
import { TranslationService } from '../services/translation.service';
import { Prisma } from '@prisma/client';
import { QueryParser } from '../../utils/QueryParser';

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
      const decodedToken = new JwtService().decodeFromRequest(request);
      if (decodedToken) {
        const mineData = await this.getUser({
          username: decodedToken.username,
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

  async getUserByQuery(
    query,
    lang: string,
  ): Promise<ResponseDTO<PublicUserDTO[]>> {
    try {
      // Todo - брать тип из Prisma.WhereInput
      const parsedQuery = QueryParser<{ name: 'string'; shortlink: 'string' }>(
        { name: 'string', shortlink: 'string' },
        query,
      );
      const usersData = await this.getUsers(parsedQuery);
      if (usersData.length > 0) {
        return {
          data: usersData.map((u) => ({
            shortlink: u.shortlink,
            name: u.name,
          })),
        };
      }
      const error = await this.translationService.translate('errors.users.me', {
        lang,
      });
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }

  async getUserByShortlink(
    query,
    lang: string,
  ): Promise<ResponseDTO<PublicUserDTO>> {
    try {
      // Todo - брать тип из Prisma.WhereInput
      const userData = await this.getUser(query);
      return {
        data: {
          shortlink: userData.shortlink,
          name: userData.name,
        },
      };
      const error = await this.translationService.translate('errors.users.me', {
        lang,
      });
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }

  public getUsers(condition: Prisma.UserWhereInput) {
    return this.prismaService.user.findMany({
      where: condition,
    });
  }

  public getUser(condition: Prisma.UserWhereInput) {
    return this.prismaService.user.findFirst({
      where: condition,
    });
  }
}
