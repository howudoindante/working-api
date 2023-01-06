import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { Credentials } from './interfaces/users.interface';
import { ResponseDTO } from '../../dto/response.dto';
import { I18nLang } from 'nestjs-i18n';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(
    @Body() credentials: Credentials,
    @I18nLang() lang: string,
  ): Promise<ResponseDTO> {
    return await this.loginService.login(credentials, lang);
  }
}
