import { ResponseDTO } from '../../../dto/response.dto';
import {
  FriendshipStatusDTO,
  FriendshipWithTypeDTO,
} from '../../../dto/friendship.dto';
import { PrismaFriendshipWithIncludedFields } from '../types/friendship';

export default function parseToDto(
  friendship:
    | null
    | PrismaFriendshipWithIncludedFields
    | PrismaFriendshipWithIncludedFields[] = null,
  getRequestType?: (f) => string,
): ResponseDTO<
  | FriendshipStatusDTO
  | FriendshipStatusDTO[]
  | FriendshipWithTypeDTO[]
  | FriendshipWithTypeDTO
  | object
> {
  let data = {};
  const mapData = (f: PrismaFriendshipWithIncludedFields) => ({
    status: f.friendshipStatus.name,
    senderId: f.sender['id'],
    senderLink: f.sender['shortlink'],
    recipientId: f.recipient['id'],
    recipientLink: f.recipient['shortlink'],
    ...(getRequestType && { type: getRequestType(f) }),
  });
  if (friendship) {
    if (!Array.isArray(friendship) && Object.keys(friendship).length > 0) {
      data = mapData(friendship);
    } else if (Array.isArray(friendship)) {
      data = friendship.map((f) => mapData(f));
    }
  }

  return { data };
}
