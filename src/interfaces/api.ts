export type ResolvedRequest<T> = {
  success: true;
  data: T;
};

export type RejectedRequest = {
  success: false;
  message: string;
};

export type IResponse<T> = ResolvedRequest<T> | RejectedRequest;
