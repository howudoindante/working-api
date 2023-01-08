export interface ITokenPayloadType {
  id: number;
  username: string;
  role: string;
}

export type ITokenDecoded = {
  iat: number;
} & ITokenPayloadType;
