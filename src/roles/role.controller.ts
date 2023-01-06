import { Controller, Get } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { RoleService } from './role.service';
import { RolesDTO } from '../../dto/roles.dto';
import { I18nLang } from 'nestjs-i18n';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async roles(@I18nLang() lang: string): Promise<ResponseDTO<RolesDTO>> {
    return await this.roleService.getRoles(lang);
  }
}
