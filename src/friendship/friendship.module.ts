import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { PrismaService } from '../services/prisma.service';
import { JwtService } from '../services/jwt.service';
import { TranslationService } from '../services/translation.service';
import { ErrorService } from '../services/error.service';

@Module({
  controllers: [FriendshipController],
  providers: [
    JwtService,
    PrismaService,
    TranslationService,
    ErrorService,
    FriendshipService,
  ],
})
export class FriendshipModule {}
