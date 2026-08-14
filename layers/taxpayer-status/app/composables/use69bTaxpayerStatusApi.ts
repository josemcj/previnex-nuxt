import type { FetchPaginatedDataOptions, PaginatedResponse } from '#layers/shared/app/types/paginatedTable';
import type { ApiResponse } from '#layers/shared/app/types/api';
import type { Taxpayer69bStatus, Taxpayer69bStatusPayload } from '../types/TaxpayerStatus';

export function use69bTaxpayerStatusApi() {
  const { $api } = useNuxtApp();
  const uriPrefix = '/taxpayer-69b-statuses';

  function getTaxpayerStatuses(body: FetchPaginatedDataOptions) {
    return $api<PaginatedResponse<Taxpayer69bStatus>>(uriPrefix, {
      method: 'POST',
      body,
    });
  }

  function createTaxpayerStatus(body: Taxpayer69bStatusPayload) {
    return $api<ApiResponse<Taxpayer69bStatus>>(`${uriPrefix}/create`, {
      method: 'POST',
      body,
    });
  }

  function updateTaxpayerStatus(id: number, body: Taxpayer69bStatusPayload) {
    return $api<ApiResponse<Taxpayer69bStatus>>(`${uriPrefix}/update/${id}`, {
      method: 'PUT',
      body,
    });
  }

  function changeTaxpayerStatus(id: number) {
    return $api<ApiResponse<Taxpayer69bStatus>>(`${uriPrefix}/delete/${id}/change-status`, {
      method: 'PATCH',
    });
  }

  return {
    getTaxpayerStatuses,
    createTaxpayerStatus,
    updateTaxpayerStatus,
    changeTaxpayerStatus,
  };
}
