import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { JwtService } from '../services/jwt.service';
import { TranslationService } from '../services/translation.service';
import { ResponseDTO } from '../../dto/response.dto';
import {
  FriendshipStatusDTO,
  FriendshipWithTypeDTO,
} from '../../dto/friendship.dto';
import { HttpError } from '../../utils/ApiErrors';
import { ErrorWithCodeTranslation } from '../../types/translations.types';
import { FriendshipStatuses } from '../../constants/friendship';
import {
  TCreateFriendshipProps,
  TDeleteFriendshipProps,
  TUpdateFriendshipProps,
} from '../../types/friendship.type';
import { ErrorService } from '../services/error.service';
import parseToDto from './utils/mappers';
import { getRequestType } from './utils/requestTypeParser';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly translationService: TranslationService,
    private readonly jwtService: JwtService,

    private readonly errorService: ErrorService,
  ) {}

  async getFriendshipStatus(
    request: Request,
    shortlink,
    lang: string,
  ): Promise<
    ResponseDTO<FriendshipWithTypeDTO | FriendshipWithTypeDTO[] | object>
  > {
    try {
      const { fs, recipient, sender } = await this.getFriendshipProps(
        request,
        shortlink,
      );
      let result = parseToDto();
      const isFriendshipExists = !!fs;
      if (sender) {
        if (recipient && isFriendshipExists) {
          const friendship = await this.prismaService.friendship.findFirst({
            where: {
              OR: [
                { senderId: sender.id, recipientId: recipient.id },
                { senderId: recipient.id, recipientId: sender.id },
              ],
            },
            include: {
              friendshipStatus: true,
              sender: true,
              recipient: true,
            },
          });
          result = parseToDto(friendship, getRequestType(sender));
        } else if (!recipient) {
          const friendship = await this.prismaService.friendship.findMany({
            where: {
              OR: [{ senderId: sender.id }, { recipientId: sender.id }],
            },
            include: {
              friendshipStatus: true,
              sender: true,
              recipient: true,
            },
          });
          result = parseToDto(friendship, getRequestType(sender));
        } else {
        }
        return result;
      } else {
        await this.errorService.throwHTTP(
          'errors.friendship.entities-not-found',
          lang,
        );
      }
    } catch (e) {
      throw HttpError.send(e.message, e.code);
    }
  }

  async block(
    request: Request,
    shortlink,
    lang: string,
  ): Promise<ResponseDTO<FriendshipStatusDTO>> {
    try {
      const decodedToken = this.jwtService.decodeFromRequest(request);
      if (decodedToken) {
        const sender = await this.prismaService.user.findFirst({
          where: {
            username: decodedToken.username,
          },
        });
        const recipient = shortlink
          ? await this.prismaService.user.findFirst({
              where: {
                shortlink,
              },
            })
          : null;
        if (sender && recipient) {
          let fs = await this.prismaService.friendship.findFirst({
            where: {
              OR: [
                { senderId: sender.id, recipientId: recipient.id },
                { senderId: recipient.id, recipientId: sender.id },
              ],
            },

            select: {
              id: true,
              sender: true,
              recipient: true,
              friendshipStatus: true,
            },
          });
          const isFriendshipExists = !!fs;

          const isRecipientBlocked =
            isFriendshipExists &&
            fs.recipient.id === sender.id &&
            fs.friendshipStatus.name === FriendshipStatuses.BLOCK_FIRST_SECOND;

          const isSenderBlocked =
            isFriendshipExists &&
            fs.sender.id === sender.id &&
            fs.friendshipStatus.name === FriendshipStatuses.BLOCK_SECOND_FIRST;

          const isBlockedPreviously =
            isFriendshipExists && (isSenderBlocked || isRecipientBlocked);

          // Если взаимоотношения установлены и кто-то заблокировал кого-то
          if (isFriendshipExists && isBlockedPreviously) {
            fs = await this.prismaService.friendship.update({
              where: {
                id: fs.id,
              },
              data: {
                friendshipStatus: {
                  connect: {
                    name: FriendshipStatuses.BLOCK_BOTH,
                  },
                },
              },
              select: {
                id: true,
                friendshipStatus: true,
                sender: true,
                recipient: true,
              },
            });
          } else if (
            isFriendshipExists &&
            fs.friendshipStatus.name !== FriendshipStatuses.BLOCK_BOTH
          ) {
            // Если взаимоотношения установлены, но пользователь не был заблокирован

            fs = await this.prismaService.friendship.update({
              where: {
                id: fs.id,
              },
              data: {
                friendshipStatus: {
                  connect: {
                    name:
                      fs.recipient.id === sender.id
                        ? FriendshipStatuses.BLOCK_SECOND_FIRST
                        : FriendshipStatuses.BLOCK_FIRST_SECOND,
                  },
                },
              },
              select: {
                id: true,
                friendshipStatus: true,
                sender: true,
                recipient: true,
              },
            });
          } else if (!isFriendshipExists) {
            // Если не установлены взаимоотношения - создать и заблокировать

            fs = await this.prismaService.friendship.create({
              data: {
                sender: {
                  connect: {
                    id: sender.id,
                  },
                },
                recipient: {
                  connect: {
                    id: recipient.id,
                  },
                },
                friendshipStatus: {
                  connect: {
                    name: FriendshipStatuses.BLOCK_FIRST_SECOND,
                  },
                },
              },
              select: {
                id: true,
                sender: true,
                recipient: true,
                friendshipStatus: true,
              },
            });
          }
          return {
            data: {
              status: fs.friendshipStatus.name,
              senderId: fs.sender.id,
              senderLink: fs.sender.shortlink,
              recipientId: fs.recipient.id,
              recipientLink: fs.recipient.shortlink,
            },
          };
        } else {
          throw new Error();
        }
      }
    } catch (e) {}
  }

  async addToFriends(
    request: Request,
    shortlink,
    lang: string,
  ): Promise<ResponseDTO<FriendshipStatusDTO | object>> {
    try {
      const { fs, recipient, sender } = await this.getFriendshipProps(
        request,
        shortlink,
      );
      let friendship = null;
      let result = parseToDto(friendship);

      const isFriendshipExists = !!fs;
      if (isFriendshipExists) {
        switch (fs.friendshipStatus.name) {
          case FriendshipStatuses.PENDING_FIRST_SECOND: {
            if (fs.recipient.id === sender.id) {
              friendship = await this.updateFriendship({
                friendshipId: fs.id,
                status: FriendshipStatuses.FRIENDS,
              });
            }
            break;
          }
          case FriendshipStatuses.PENDING_SECOND_FIRST: {
            if (fs.sender.id === sender.id) {
              friendship = await this.updateFriendship({
                friendshipId: fs.id,
                status: FriendshipStatuses.FRIENDS,
              });
            }
            break;
          }

          default: {
            const error = await this.translationService.translate<{
              code: number;
              text: string;
            }>('errors.friendship.cannot-add-friend');
            throw new HttpError(error.text, error.code);

            break;
          }
        }
      } else {
        friendship = await this.createFriendship({
          senderId: sender.id,
          recipientId: recipient.id,
          status: FriendshipStatuses.PENDING_FIRST_SECOND,
        });
      }

      result = parseToDto(friendship);

      return result;
    } catch (e) {
      throw HttpError.send(e.message, e.code);
    }
  }

  async unblock(
    request: Request,
    shortlink,
    lang: string,
  ): Promise<ResponseDTO<FriendshipStatusDTO | object>> {
    try {
      const { fs, recipient, sender } = await this.getFriendshipProps(
        request,
        shortlink,
      );
      const isFriendshipExists = !!fs;
      if (isFriendshipExists) {
        switch (fs.friendshipStatus.name) {
          case FriendshipStatuses.BLOCK_BOTH: {
            const updatedFriendship =
              await this.prismaService.friendship.update({
                where: {
                  id: fs.id,
                },
                data: {
                  friendshipStatus: {
                    connect: {
                      name:
                        fs.recipient.id === sender.id
                          ? FriendshipStatuses.BLOCK_FIRST_SECOND
                          : FriendshipStatuses.BLOCK_SECOND_FIRST,
                    },
                  },
                },
                select: {
                  id: true,
                  sender: true,
                  recipient: true,
                  friendshipStatus: true,
                },
              });

            return parseToDto(updatedFriendship);
            break;
          }
          case FriendshipStatuses.BLOCK_FIRST_SECOND:
          case FriendshipStatuses.BLOCK_SECOND_FIRST: {
            const isUserAvailableToUnblock =
              (FriendshipStatuses.BLOCK_SECOND_FIRST &&
                sender.id === fs.recipient.id) ||
              (FriendshipStatuses.BLOCK_FIRST_SECOND &&
                sender.id === fs.sender.id);

            if (isUserAvailableToUnblock) {
              await this.prismaService.friendship.delete({
                where: {
                  id: fs.id,
                },
              });
              return parseToDto();
            } else {
              const error =
                await this.translationService.translate<ErrorWithCodeTranslation>(
                  'errors.friendship.cannot-unblock',
                );
              throw new HttpError(error.text, error.code);
            }
            break;
          }
          default: {
            const error =
              await this.translationService.translate<ErrorWithCodeTranslation>(
                'errors.friendship.cannot-unblock',
              );
            throw new HttpError(error.text, error.code);
            break;
          }
        }
      } else {
        const error =
          await this.translationService.translate<ErrorWithCodeTranslation>(
            'errors.friendship.not-exists',
          );
        throw new HttpError(error.text, error.code);
      }
    } catch (e) {
      throw HttpError.send(e.message, e.code);
    }
  }

  async deleteFriend(
    request: Request,
    shortlink,
    lang: string,
  ): Promise<ResponseDTO<FriendshipStatusDTO | object>> {
    try {
      const { fs, recipient, sender } = await this.getFriendshipProps(
        request,
        shortlink,
      );
      const isFriendshipExists = !!fs;
      if (isFriendshipExists) {
        const notFriendsStatuses = [
          FriendshipStatuses.PENDING_FIRST_SECOND,
          FriendshipStatuses.PENDING_SECOND_FIRST,
        ];
        const getFriendshipStatusName = () => {
          switch (sender.id) {
            case fs.sender.id: {
              if (fs.friendshipStatus.name === FriendshipStatuses.FRIENDS) {
                return FriendshipStatuses.PENDING_SECOND_FIRST;
              }
              if (
                notFriendsStatuses.some(
                  (status) => status === fs.friendshipStatus.name,
                )
              ) {
                return null;
              }
              break;
            }
            case fs.recipient.id: {
              if (fs.friendshipStatus.name === FriendshipStatuses.FRIENDS) {
                return FriendshipStatuses.PENDING_FIRST_SECOND;
              }
              if (
                notFriendsStatuses.some(
                  (status) => status === fs.friendshipStatus.name,
                )
              ) {
                return null;
              }
              break;
            }

            default: {
              return null;
            }
          }
        };
        const nextFsStatus = getFriendshipStatusName();
        let newFs: ResponseDTO<FriendshipStatusDTO | object> = {};
        if (nextFsStatus) {
          const updatedFriendship = await this.updateFriendship({
            friendshipId: fs.id,
            status: nextFsStatus,
          });

          newFs = parseToDto(updatedFriendship);
        } else {
          await this.prismaService.friendship.delete({
            where: {
              id: fs.id,
            },
          });
          newFs = {
            data: {},
          };
        }
        return newFs;
      } else {
        const error =
          await this.translationService.translate<ErrorWithCodeTranslation>(
            'errors.friendship.not-exists',
          );
        throw new HttpError(error.text, error.code);
      }
    } catch (e) {
      throw HttpError.send(e.message, e.code);
    }
  }

  private createFriendship(props: TCreateFriendshipProps) {
    const { senderId, recipientId, status } = props;
    return this.prismaService.friendship.create({
      data: {
        sender: {
          connect: {
            id: senderId,
          },
        },
        recipient: {
          connect: {
            id: recipientId,
          },
        },
        friendshipStatus: {
          connect: {
            name: status,
          },
        },
      },
      select: {
        id: true,
        sender: true,
        recipient: true,
        friendshipStatus: true,
      },
    });
  }
  private deleteFriendship(props: TDeleteFriendshipProps) {
    const { friendshipId } = props;
    return this.prismaService.friendship.delete({
      where: {
        id: friendshipId,
      },
    });
  }
  private updateFriendship(props: TUpdateFriendshipProps) {
    const { friendshipId, status } = props;
    return this.prismaService.friendship.update({
      where: {
        id: friendshipId,
      },
      data: {
        friendshipStatus: {
          connect: {
            name: status,
          },
        },
      },
      select: {
        id: true,
        friendshipStatus: true,
        sender: true,
        recipient: true,
      },
    });
  }

  private async getFriendshipProps(request: Request, shortlink: string | null) {
    const decodedToken = this.jwtService.decodeFromRequest(request);
    if (decodedToken) {
      const sender = await this.prismaService.user.findFirst({
        where: {
          username: decodedToken.username,
        },
      });
      const recipient = shortlink
        ? await this.prismaService.user.findFirst({
            where: {
              shortlink,
            },
          })
        : null;

      const recipientId = recipient ? recipient.id : undefined;
      if (sender) {
        const fs = await this.prismaService.friendship.findFirst({
          where: {
            OR: [
              {
                senderId: sender.id,
                recipientId: recipientId,
              },
              { senderId: recipientId, recipientId: sender.id },
            ],
          },

          select: {
            id: true,
            sender: true,
            recipient: true,
            friendshipStatus: true,
          },
        });
        return { fs, sender, recipient };
      } else {
        const error = await this.translationService.translate<{
          code: number;
          text: string;
        }>('errors.friendship.entities-not-found');
        throw new HttpError(error.text, error.code);
      }
    } else {
      const error = await this.translationService.translate<{
        code: number;
        text: string;
      }>('errors.token.decode');
      throw new HttpError(error.text, error.code);
    }
  }
}
