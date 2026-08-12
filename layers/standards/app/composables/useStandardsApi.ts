import type { FetchPaginatedDataOptions, PaginatedResponse } from '#layers/shared/app/types/paginatedTable';
import type { Standard } from '#layers/standards/app/types/standard';

export function useStandardsApi() {
  const { $api } = useNuxtApp();
  const uriPrefix = '/norms554';

  function getStandards(body: FetchPaginatedDataOptions) {
    return $api<PaginatedResponse<Standard>>(uriPrefix, {
      method: 'POST',
      body,
    });
  }

  return {
    getStandards,
  };
}
