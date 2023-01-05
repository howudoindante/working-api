import { Controller, Get } from '@nestjs/common';
import { ResponseDTO } from '../../dto/response.dto';
import { RoleService } from './role.service';
import { RolesDTO } from '../../dto/roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async roles(): Promise<ResponseDTO<RolesDTO>> {
    return await this.roleService.getRoles();
  }
}
