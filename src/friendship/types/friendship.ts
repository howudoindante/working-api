import { FriendshipStatuses, User } from '@prisma/client';

export type PrismaFriendshipWithIncludedFields = {
  id: number;
  sender: User;
  recipient: User;
  friendshipStatus: FriendshipStatuses;
};
