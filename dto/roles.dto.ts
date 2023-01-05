import { Roles } from '../types/roles.type';

export type RolesDTO = {
  [x in Roles]: {
    permissions: string[];
  };
};
