export interface ResponseDTO<T = any> {
  readonly message?: string;
  readonly code?: number;
  readonly data?: T;
}
