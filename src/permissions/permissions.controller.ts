import { Controller, Get } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { PermissionsService } from './permissions.service';
import { PermissionsDTO } from '../../dto/permissions.dto';
import { I18nLang } from 'nestjs-i18n';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async permissions(
    @I18nLang() lang: string,
  ): Promise<ResponseDTO<PermissionsDTO>> {
    return await this.permissionsService.getPermissions(lang);
  }
}
