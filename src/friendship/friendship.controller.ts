import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '../guards/auth.guard';
import { I18nLang } from 'nestjs-i18n';
import { RFRIENDS } from '../../routes/friends';

@Controller(RFRIENDS.BASE)
@UseGuards(new AuthGuard())
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get(RFRIENDS.STATUS)
  getFriendshipStatus(@Request() req, @Param() param, @I18nLang() lang) {
    return this.friendshipService.getFriendshipStatus(
      req,
      param.shortlink,
      lang,
    );
  }

  @Post(RFRIENDS.ADD)
  addToFriends(@Request() req, @Param() param, @I18nLang() lang) {
    return this.friendshipService.addToFriends(req, param.shortlink, lang);
  }

  @Post(RFRIENDS.BLOCK)
  block(@Request() req, @Param() param, @I18nLang() lang) {
    return this.friendshipService.block(req, param.shortlink, lang);
  }

  @Post(RFRIENDS.UNBLOCK)
  unblock(@Request() req, @Param() param, @I18nLang() lang) {
    return this.friendshipService.unblock(req, param.shortlink, lang);
  }

  @Post(RFRIENDS.DELETE)
  deleteFriend(@Request() req, @Param() param, @I18nLang() lang) {
    return this.friendshipService.deleteFriend(req, param.shortlink, lang);
  }
}
