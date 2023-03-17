import { FriendshipStatuses } from '../constants/friendship';

export type FriendshipStatusType = keyof typeof FriendshipStatuses;

export type TCreateFriendshipProps = {
  senderId: number;
  recipientId: number;

  status: FriendshipStatusType;
};

export type TUpdateFriendshipProps = {
  friendshipId: number;

  status: FriendshipStatusType;
};

export type TDeleteFriendshipProps = {
  friendshipId: number;
};
