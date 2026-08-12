import type { FetchPaginatedDataOptions, PaginatedResponse } from '#layers/shared/app/types/paginatedTable';
import type { ApiResponse } from '#layers/shared/app/types/api';
import type { Standard, StandardPayload } from '#layers/standards/app/types/standard';

export function useStandardsApi() {
  const { $api } = useNuxtApp();
  const uriPrefix = '/norms554';

  function getStandards(body: FetchPaginatedDataOptions) {
    return $api<PaginatedResponse<Standard>>(uriPrefix, {
      method: 'POST',
      body,
    });
  }

  function createStandard(body: StandardPayload) {
    return $api<ApiResponse<Standard>>(`${uriPrefix}/create`, {
      method: 'POST',
      body,
    });
  }

  function updateStandard(id: number, body: StandardPayload) {
    return $api<ApiResponse<Standard>>(`${uriPrefix}/update/${id}`, {
      method: 'PUT',
      body,
    });
  }

  function changeStandardStatus(id: number) {
    return $api<ApiResponse<Standard>>(`${uriPrefix}/delete/${id}`, {
      method: 'PUT',
    });
  }

  return {
    getStandards,
    createStandard,
    updateStandard,
    changeStandardStatus,
  };
}
