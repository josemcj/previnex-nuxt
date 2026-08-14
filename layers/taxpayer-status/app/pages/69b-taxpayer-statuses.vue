<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { BreadcrumbItem } from '#layers/core/app/types/utils';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { Taxpayer69bStatus } from '../types/TaxpayerStatus';

definePageMeta({
  path: '/catalogs/taxpayer-69b-statuses',
  name: 'catalogs-69b-taxpayer-statuses',
});

useSeoMeta({
  title: 'Situación de contribuyentes 69B',
  description: 'Catálogo de Situaciones de Contribuyentes 69B',
});

const pageTitle = 'Situaciones de Contribuyentes 69B';
const breadcrumbItems: BreadcrumbItem[] = [
  { text: 'Inicio', href: '/' },
  { text: 'Catálogos' },
  { text: 'Situaciones de Contribuyentes 69B', active: true },
];

const fields = [
  { key: 'name', label: 'Nombre', sortable: false },
  { key: 'status_id', label: 'Estado', sortable: false },
  { key: 'actions', label: 'Acciones' },
] satisfies readonly TableFieldRaw<Taxpayer69bStatus>[];

const { getTaxpayerStatuses, changeTaxpayerStatus } = use69bTaxpayerStatusApi();
const swal = useSwal();
const layoutStore = useLayoutStore();

const showModal = ref(false);
const modalMode = ref<ModalMode>('create');
const selectedItem = ref<Taxpayer69bStatus | null>(null);

const { tableItems, isBusy, currentPage, perPage, totalRows, fetchData, onSearch, onTableChange } =
  usePaginatedTable<Taxpayer69bStatus>(fields, getTaxpayerStatuses);

await fetchData();

function onAddStatus() {
  modalMode.value = 'create';
  selectedItem.value = null;
  showModal.value = true;
}

function onUpdateStatus(taxpayer69bStatus: Taxpayer69bStatus) {
  modalMode.value = 'edit';
  selectedItem.value = taxpayer69bStatus;
  showModal.value = true;
}

async function onStatusSaved(message: string) {
  await swal.success(message);
  await fetchData();
}

async function onChangeTaxpayerStatus(id: unknown, taxpayer69bStatus: Taxpayer69bStatus) {
  if (typeof id !== 'number') return;

  const isActive = Number(taxpayer69bStatus.status_id) === 1;
  const action = isActive ? 'desactivar' : 'activar';
  const confirmed = await swal.warning({
    title: `¿Deseas ${action} este estado?`,
    text: `Se ${action === 'desactivar' ? 'desactivará' : 'activará'} “${taxpayer69bStatus.name}”.`,
    confirmButtonText: `Sí, ${action}`,
  });

  if (!confirmed) return;

  layoutStore.changeLoaderValue(true);
  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  try {
    const response = await changeTaxpayerStatus(id);
    await fetchData();
    successMessage = response.message;
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    errorMessage = data.message ?? `No fue posible ${action} la norma.`;
  } finally {
    layoutStore.changeLoaderValue(false);
  }

  if (errorMessage) {
    await swal.error({ title: 'Error', text: errorMessage });
  } else if (successMessage) {
    await swal.success(successMessage);
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
      @add-btn-click="onAddStatus"
      @update-item="onUpdateStatus"
      @delete-item="onChangeTaxpayerStatus" />
  </BCard>

  <TaxpayerStatusModal
    v-model="showModal"
    :mode="modalMode"
    :taxpayerStatus="selectedItem"
    @saved="onStatusSaved"
    @hidden="selectedItem = null" />
</template>
