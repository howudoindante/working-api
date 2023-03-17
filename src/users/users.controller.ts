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
  me(
    @Request() request,
    @I18nLang() lang,
  ): Promise<ResponseDTO<PrivateUserDTO>> {
    return this.usersService.getMyData(request, lang);
  }

  @Get(':shortlink')
  findByShortName(@Param() param, @I18nLang() lang) {
    return this.usersService.getUserByShortlink(
      { shortlink: param.shortlink },
      lang,
    );
  }

  @Get()
  findByQuery(@Query() query, @I18nLang() lang) {
    return this.usersService.getUserByQuery(query, lang);
  }
}
