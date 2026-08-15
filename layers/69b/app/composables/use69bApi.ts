import type { FetchPaginatedDataOptions, PaginatedResponse } from '#layers/shared/app/types/paginatedTable';
import type { ApiResponse } from '#layers/shared/app/types/api';
import type { Import69bPayloadItem, Import69bResponseData, Verify69bPayload, _69bPayload, _69bRecord } from '../types/_69b';

interface Fetch69bOptions extends FetchPaginatedDataOptions {
  filters?: Record<string, unknown>;
}

export function use69bApi() {
  const { $api } = useNuxtApp();
  const uriPrefix = '/69b';

  function get69bRecords(body: Fetch69bOptions) {
    return $api<PaginatedResponse<_69bRecord>>(uriPrefix, {
      method: 'POST',
      body: {
        page: body.page ?? 1,
        per_page: body.per_page ?? 5,
        search: body.search ?? '',
        filters: body.filters ?? {},
      },
    });
  }

  function create69bRecord(body: _69bPayload) {
    return $api<ApiResponse<_69bRecord>>(`${uriPrefix}/create`, {
      method: 'POST',
      body,
    });
  }

  function update69bRecord(id: number, body: _69bPayload) {
    return $api<ApiResponse<_69bRecord>>(`${uriPrefix}/update/${id}`, {
      method: 'PUT',
      body,
    });
  }

  function change69bStatus(id: number) {
    return $api<ApiResponse<_69bRecord>>(`${uriPrefix}/delete/${id}`, {
      method: 'PUT',
    });
  }

  function verify69b(body: Verify69bPayload) {
    return $api<_69bRecord[]>(`${uriPrefix}/verify`, {
      method: 'POST',
      body,
    });
  }

  function import69b(body: Import69bPayloadItem[]) {
    return $api<ApiResponse<Import69bResponseData>>(`${uriPrefix}/import`, {
      method: 'POST',
      body,
    });
  }

  return {
    get69bRecords,
    create69bRecord,
    update69bRecord,
    change69bStatus,
    verify69b,
    import69b,
  };
}
