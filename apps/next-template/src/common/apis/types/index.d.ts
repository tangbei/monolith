export type TBResponse<T> = {
  code: number;
  message: string;
  data: T;
};