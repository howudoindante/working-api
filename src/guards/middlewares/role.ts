import { Roles } from '../../../types/roles.type';
import { MiddlewarePayload } from '../../../types/guards.type';

export const GuardRoles =
  (roles: Roles[], allowConnection = true) =>
  (data: MiddlewarePayload) => {
    if (
      roles.some((role) =>
        allowConnection
          ? role === data.token.decoded.role
          : role !== data.token.decoded.role,
      )
    )
      return true;
    else return false;
  };
