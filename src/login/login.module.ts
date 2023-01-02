import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PrismaService } from '../services/prisma.service';
import { JwtService } from '../services/jwt.service';
import { TranslationService } from '../services/translation.service';

@Module({
  controllers: [LoginController],
  providers: [TranslationService, PrismaService, JwtService, LoginService],
})
export class LoginModule {}
