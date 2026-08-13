import type { FetchPaginatedDataOptions, PaginatedResponse } from '#layers/shared/app/types/paginatedTable'
import type { ApiResponse } from '#layers/shared/app/types/api'
import type { EDocumentType, EDocumentTypePayload } from '../types/e-document-types'

export function useEDocumentTypesApi() {
  const { $api } = useNuxtApp()
  const uriPrefix = '/e-document-types'

  function getDocumentTypes(body: FetchPaginatedDataOptions) {
    return $api<PaginatedResponse<EDocumentType>>(uriPrefix, {
      method: 'POST',
      body,
    })
  }

  function getActiveDocumentTypes() {
    return $api<ApiResponse<EDocumentType[]>>(`${uriPrefix}/active`, {
      method: 'GET',
    })
  }

  function getDocumentType(id: number) {
    return $api<ApiResponse<EDocumentType>>(`${uriPrefix}/${id}`, {
      method: 'GET',
    })
  }

  function createDocumentType(body: EDocumentTypePayload) {
    return $api<ApiResponse<EDocumentType>>(`${uriPrefix}/create`, {
      method: 'POST',
      body,
    })
  }

  function updateDocumentType(id: number, body: EDocumentTypePayload) {
    return $api<ApiResponse<EDocumentType>>(`${uriPrefix}/update/${id}`, {
      method: 'PUT',
      body,
    })
  }

  function changeDocumentTypeStatus(id: number) {
    return $api<ApiResponse<EDocumentType>>(`${uriPrefix}/delete/${id}`, {
      method: 'PUT',
    })
  }

  function createDocumentTypesBulk(body: EDocumentTypePayload[]) {
    return $api<ApiResponse<EDocumentType[]>>(`${uriPrefix}/layouts`, {
      method: 'POST',
      body,
    })
  }

  return {
    getDocumentTypes,
    getActiveDocumentTypes,
    getDocumentType,
    createDocumentType,
    updateDocumentType,
    changeDocumentTypeStatus,
    createDocumentTypesBulk,
  }
}

export const useDocumentTypesApi = useEDocumentTypesApi
