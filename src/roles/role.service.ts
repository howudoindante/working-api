import { HttpException, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';
import { RolesDTO } from '../../dto/roles.dto';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private translation: TranslationService,
  ) {}

  async getRoles(): Promise<ResponseDTO<RolesDTO>> {
    try {
      const rolesAndPermssions = await this.prisma.rolesPermissions.findMany({
        select: {
          role: true,
          permission: true,
        },
      });

      // If credentials wrong

      return {
        data: rolesAndPermssions.reduce(function (target, current) {
          target[current.role.name] = {
            permissions: rolesAndPermssions
              .filter((item) => item.role.name === current.role.name)
              .map((item) => item.permission.name),
          };
          return target;
        }, {} as RolesDTO),
      };
      // const error = await this.translation.translate('errors.registration');
      // throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
