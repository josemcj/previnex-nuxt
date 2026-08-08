export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export type ApiMethod<T> = (
  page?: number,
  perPage?: number,
  search?: string
) => Promise<{
  status: number;
  data: PaginatedResponse<T>;
}>;
