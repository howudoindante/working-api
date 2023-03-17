import {
  FriendshipStatuses,
  INCOMING_FRIENDSHIP_REQUEST,
  PENDING_FRIENDSHIP_REQUEST,
} from '../../../constants/friendship';

export const getRequestType = (sender) => (f) => {
  switch (f.friendshipStatus.name) {
    case FriendshipStatuses.PENDING_FIRST_SECOND ||
      FriendshipStatuses.BLOCK_FIRST_SECOND: {
      if (sender.id === f.sender.id) {
        return PENDING_FRIENDSHIP_REQUEST;
      }
      if (sender.id === f.recipient.id) {
        return INCOMING_FRIENDSHIP_REQUEST;
      }
      break;
    }

    case FriendshipStatuses.PENDING_SECOND_FIRST ||
      FriendshipStatuses.BLOCK_SECOND_FIRST: {
      if (sender.id === f.sender.id) {
        return INCOMING_FRIENDSHIP_REQUEST;
      }
      if (sender.id === f.recipient.id) {
        return PENDING_FRIENDSHIP_REQUEST;
      }
      break;
    }

    default: {
      return f.friendshipStatus.name;
    }
  }
};
