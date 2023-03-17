export interface UpdateFriendshipDTO {
  friendLink: string;
}

export interface FriendshipStatusDTO {
  senderLink: string;
  senderId: number;
  recipientLink: string;
  recipientId: number;
  status: string;
}

export type FriendshipWithTypeDTO = FriendshipStatusDTO & {
  type: 'incoming' | 'pending';
};
