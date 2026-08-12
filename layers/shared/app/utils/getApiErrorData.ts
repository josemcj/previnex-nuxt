import type { ApiErrorData } from '~~/layers/shared/app/types/api';

export function getApiErrorData(error: unknown): ApiErrorData {
  if (typeof error !== 'object' || error === null || !('data' in error)) return {};

  const data = error.data;
  return typeof data === 'object' && data !== null ? (data as ApiErrorData) : {};
}
