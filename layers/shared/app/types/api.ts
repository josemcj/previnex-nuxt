export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

export interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}
