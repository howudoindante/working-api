import { HttpException, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';
import { PermissionsDTO } from '../../dto/permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private translation: TranslationService,
  ) {}

  async getPermissions(lang: string): Promise<ResponseDTO<PermissionsDTO>> {
    try {
      const permissions = await this.prisma.permission.findMany();
      const data = [];
      for (const key in permissions) {
        const t = await this.translation.translate(
          `permissions.${permissions[key].name}`,
          { lang },
        );
        data.push({ ...permissions[key], translation: t });
      }
      return {
        data,
      };

      const error = await this.translation.translate('errors.permissions.get', {
        lang,
      });
      throw new Error(error);
    } catch (e) {
      throw new HttpException(e.message, 401);
    }
  }
}
