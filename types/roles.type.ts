import { ROLE_ADMIN, ROLE_USER } from '../constants/roles';

export type Roles = typeof ROLE_ADMIN | typeof ROLE_USER;
