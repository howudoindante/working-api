import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

@Module({
  controllers: [PermissionsController],
  providers: [TranslationService, PrismaService, PermissionsService],
})
export class PermissionsModule {}
