import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TranslationService } from '../services/translation.service';
import { RolesController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RolesController],
  providers: [TranslationService, PrismaService, RoleService],
})
export class RoleModule {}
