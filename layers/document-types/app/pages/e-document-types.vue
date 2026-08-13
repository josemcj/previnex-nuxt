<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next'
import type { BreadcrumbItem } from '#layers/core/app/types/utils'
import type { ModalMode } from '#layers/shared/app/types/crud'
import type { EDocumentType } from '../types/e-document-types'
import { useEDocumentTypesApi } from '../composables/useEDocumentTypesApi'

definePageMeta({
  name: 'e-document-types',
  path: '/catalogs/e-document-types',
})

useSeoMeta({
  title: 'Tipos de documentos',
  description: 'Catalogo de Tipos de documentos',
})

const pageTitle = 'Tipos de documentos'
const breadcrumbItems: BreadcrumbItem[] = [
  { text: 'Inicio', href: '/' },
  { text: 'Catálogos' },
  { text: 'Tipos de documentos', active: true },
]

const fields = [
  { key: 'id', label: 'ID', sortable: false },
  { key: 'name', label: 'Nombre del Documento', sortable: false },
  { key: 'vucem_code', label: 'Codigo VUCEM', sortable: false },
  { key: 'requiredDocument.name', label: 'Documento requerido', sortable: false },
  { key: 'status_id', label: 'Estado', sortable: false },
  { key: 'actions', label: 'Opciones' },
] satisfies readonly TableFieldRaw<EDocumentType>[]

const { getDocumentTypes, changeDocumentTypeStatus } = useEDocumentTypesApi()
const swal = useSwal()

const showModal = ref(false)
const modalMode = ref<ModalMode>('create')
const selectedDocumentType = ref<EDocumentType | null>(null)

const { tableItems, isBusy, currentPage, perPage, totalRows, fetchData, onSearch, onTableChange } =
  usePaginatedTable <EDocumentType >(fields, getDocumentTypes)

await fetchData()

function onAddDocumentType() {
  modalMode.value = 'create'
  selectedDocumentType.value = null
  showModal.value = true
}

function onUpdateDocumentType(documentType: EDocumentType) {
  modalMode.value = 'edit'
  selectedDocumentType.value = documentType
  showModal.value = true
}

async function onDocumentTypeSaved(message: string) {
  await swal.success(message)
  await fetchData()
}

async function onChangeDocumentTypeStatus(id: unknown, documentType: EDocumentType) {
  if (typeof id !== 'number') return

  const isActive = Number(documentType.status_id) === 1
  const action = isActive ? 'desactivar' : 'activar'

  const confirmed = await swal.warning({
    title: `¿Deseas ${action} el tipo de documento?`,
    text: `Se ${action === 'desactivar' ? 'desactivará' : 'activará'} "${documentType.name}".`,
    confirmButtonText: `Sí, ${action}`,
  })

  if (!confirmed) return

  try {
    const response = await changeDocumentTypeStatus(id)
    await swal.success(response.message)
    await fetchData()
  } catch (error: unknown) {
    const data = getApiErrorData(error)
    const message = data.message ?? `No fue posible ${action} el tipo de documento.`

    await swal.error({ title: 'Error', text: message })
  }
}
</script>

<template>
  <CommonPageHeader :title="pageTitle" :items="breadcrumbItems" />

  <BCard>
    <TablesTable
      :fields="fields"
      :items="tableItems"
      :is-busy="isBusy"
      :current-page="currentPage"
      :show-upload-layout-btn="false"
      :per-page="perPage"
      :total-rows="totalRows"
      @search="onSearch"
      @change="onTableChange"
      @add-btn-click="onAddDocumentType"
      @update-item="onUpdateDocumentType"
      @delete-item="onChangeDocumentTypeStatus" />
  </BCard>

  <DocumentTypesModal
    v-model="showModal"
    :mode="modalMode"
    :e-document-type="selectedDocumentType"
    @saved="onDocumentTypeSaved"
    @hidden="selectedDocumentType = null" />
</template>
