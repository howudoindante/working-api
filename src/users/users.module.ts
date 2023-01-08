import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '../services/jwt.service';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService, PrismaService, TranslationService],
})
export class UsersModule {}
