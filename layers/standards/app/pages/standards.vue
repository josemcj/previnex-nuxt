<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { BreadcrumbItem } from '#layers/core/app/types/utils';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { Standard } from '#layers/standards/app/types/standard';

definePageMeta({
  path: '/catalogs/standards',
  name: 'catalogs-standards',
});

useSeoMeta({
  title: 'Normas',
  description: 'Catálogo de Normas',
});

const pageTitle = 'Normas';
const breadcrumbItems: BreadcrumbItem[] = [
  { text: 'Inicio', href: '/' },
  { text: 'Catálogos' },
  { text: 'Normas', active: true },
];

const fields = [
  { key: 'norm_key', label: 'Clave', sortable: false },
  { key: 'complement_1', label: 'Complemento 1', sortable: false },
  { key: 'complement_2', label: 'Complemento 2', sortable: false },
  { key: 'complement_3', label: 'Complemento 3', sortable: false },
  { key: 'name', label: 'Nombre', sortable: false },
  { key: 'status_id', label: 'Estado', sortable: false },
  { key: 'actions', label: 'Acciones' },
] satisfies readonly TableFieldRaw<Standard>[];

const { getStandards, changeStandardStatus } = useStandardsApi();
const swal = useSwal();

const showModal = ref(false);
const modalMode = ref<ModalMode>('create');
const selectedStandard = ref<Standard | null>(null);

const { tableItems, isBusy, currentPage, perPage, totalRows, fetchData, onSearch, onTableChange } =
  usePaginatedTable<Standard>(fields, getStandards);

await fetchData();

function onAddStandard() {
  modalMode.value = 'create';
  selectedStandard.value = null;
  showModal.value = true;
}

function onUpdateStandard(standard: Standard) {
  modalMode.value = 'edit';
  selectedStandard.value = standard;
  showModal.value = true;
}

async function onStandardSaved(message: string) {
  await swal.success(message);
  await fetchData();
}

async function onChangeStandardStatus(id: unknown, standard: Standard) {
  if (typeof id !== 'number') return;

  const isActive = Number(standard.status_id) === 1;
  const action = isActive ? 'desactivar' : 'activar';
  const confirmed = await swal.warning({
    title: `¿Deseas ${action} la norma?`,
    text: `Se ${action === 'desactivar' ? 'desactivará' : 'activará'} “${standard.name}”.`,
    confirmButtonText: `Sí, ${action}`,
  });

  if (!confirmed) return;

  try {
    const response = await changeStandardStatus(id);
    await swal.success(response.message);
    await fetchData();
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    const message = data.message ?? `No fue posible ${action} la norma.`;

    await swal.error({ title: 'Error', text: message });
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
      @add-btn-click="onAddStandard"
      @update-item="onUpdateStandard"
      @delete-item="onChangeStandardStatus" />
  </BCard>

  <StandardModal
    v-model="showModal"
    :mode="modalMode"
    :standard="selectedStandard"
    @saved="onStandardSaved"
    @hidden="selectedStandard = null" />
</template>
