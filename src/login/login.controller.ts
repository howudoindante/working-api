import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { Credentials } from './interfaces/users.interface';
import { I18nLang } from 'nestjs-i18n';
import { ResponseDTO } from '../../dto/response.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() credentials: Credentials,
    @I18nLang() lang: string,
  ): Promise<ResponseDTO> {
    return await this.loginService.login(req, res, credentials, lang);
  }
}
