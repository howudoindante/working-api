import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { I18nLang } from 'nestjs-i18n';
import { ResponseDTO } from '../../dto/response.dto';
import { PrivateUserDTO } from '../../dto/account.dto';

@Controller('users')
@UseGuards(new AuthGuard())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(
    @Request() request,
    @I18nLang() lang,
  ): Promise<ResponseDTO<PrivateUserDTO>> {
    return this.usersService.getMyData(request, lang);
  }

  @Get(':shortname')
  findOne(@Param() param) {
    console.log(param.shortname);
    return {
      data: {
        name: 'Test',
        username: 'slayyedx',
        email: '123@mail.ru',
      },
    };
  }

  @Get()
  findByQuery(@Query() query) {
    console.log(query);
    return {
      data: {
        name: 'Test',
        username: 'slayyedx',
        email: '123@mail.ru',
      },
    };
  }
}
