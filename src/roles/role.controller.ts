import { Controller, Get, UseGuards } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { RoleService } from './role.service';
import { RolesDTO } from '../../dto/roles.dto';
import { I18nLang } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { GuardRoles } from '../guards/middlewares/role';
import { ROLE_USER } from '../../constants/roles';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(new AuthGuard(GuardRoles([ROLE_USER])))
  async roles(@I18nLang() lang: string): Promise<ResponseDTO<RolesDTO>> {
    return await this.roleService.getRoles(lang);
  }
}
