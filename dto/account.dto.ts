export type PrivateUserDTO = {
  username: string;
  email: string;
} & PublicUserDTO;

export interface PublicUserDTO {
  name: string;
  shortlink: string;
}
