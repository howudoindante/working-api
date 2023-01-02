import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';

@Module({
  controllers: [RegisterController],
  providers: [TranslationService, PrismaService, RegisterService],
})
export class RegisterModule {}
