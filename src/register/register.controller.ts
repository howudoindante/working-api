import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { Credentials } from '../login/interfaces/users.interface';
import { ResponseDTO } from '../../dto/response.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async register(@Body() credentials: Credentials): Promise<ResponseDTO> {
    return await this.registerService.register(credentials);
  }
}
