export type MiddlewarePayload = {
  request: Request;
  token: {
    origin: string;
    decoded: any;
  };
};
