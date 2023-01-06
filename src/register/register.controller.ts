import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { Credentials } from '../login/interfaces/users.interface';
import { ResponseDTO } from '../../dto/response.dto';
import { I18nLang } from 'nestjs-i18n';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(
    @Body() credentials: Credentials,
    @I18nLang() lang: string,
  ): Promise<ResponseDTO> {
    return await this.registerService.register(credentials, lang);
  }
}
