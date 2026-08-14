<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { BreadcrumbItem } from '#layers/core/app/types/utils';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { _69bRecord } from '../types/_69b';
import Modal69b from '../components/69bModal.vue';
import Verify69bModal from '../components/69bVerifyModal.vue';
import ImportSat69bModal from '../components/69bImportSatModal.vue';
import { use69bApi } from '../composables/use69bApi';

definePageMeta({
  path: '/catalogs/69b',
  name: '69b',
});

useSeoMeta({
  title: '69b',
  description: 'Listado 69b',
});

const pageTitle = 'Listado 69-B';
const breadcrumbItems: BreadcrumbItem[] = [
  { text: 'Inicio', href: '/' },
  { text: '69b', active: true },
];

const fields = [
  { key: 'id', label: 'ID', sortable: false },
  { key: 'name', label: 'Nombre', sortable: false },
  { key: 'tax_id', label: 'RFC/Tax ID', sortable: false },
  { key: 'taxpayer_69b_status.name', label: 'Situacion del contribuyente', sortable: false },
  { key: 'sat_global_official_number', label: 'Num. oficio global SAT', sortable: false },
  { key: 'sat_global_official_date', label: 'Fecha oficio global SAT', sortable: false },
  { key: 'status_id', label: 'Estado', sortable: false },
  { key: 'actions', label: 'Opciones' },
] satisfies readonly TableFieldRaw<_69bRecord>[];

const { get69bRecords, change69bStatus } = use69bApi();
const swal = useSwal();
const layoutStore = useLayoutStore();

const showModal = ref(false);
const showVerifyModal = ref(false);
const showImportModal = ref(false);
const modalMode = ref<ModalMode>('create');
const selected69b = ref<_69bRecord | null>(null);

const { tableItems, isBusy, currentPage, perPage, totalRows, fetchData, onSearch, onTableChange } =
  usePaginatedTable<_69bRecord>(fields, get69bRecords, 5);

await fetchData();

function onAdd69b() {
  modalMode.value = 'create';
  selected69b.value = null;
  showModal.value = true;
}

function onOpenVerifyModal() {
  showVerifyModal.value = true;
}

function onOpenImportModal() {
  showImportModal.value = true;
}

function onUpdate69b(record: _69bRecord) {
  modalMode.value = 'edit';
  selected69b.value = record;
  showModal.value = true;
}

async function on69bSaved(message: string) {
  await swal.success(message);
  await fetchData();
}

async function onChange69bStatus(id: unknown, record: _69bRecord) {
  if (typeof id !== 'number') return;

  const isActive = Number(record.status_id) === 1;
  const action = isActive ? 'desactivar' : 'activar';
  const confirmed = await swal.warning({
    title: `¿Deseas ${action} el registro 69b?`,
    text: `Se ${action === 'desactivar' ? 'desactivará' : 'activará'} "${record.name}".`,
    confirmButtonText: `Sí, ${action}`,
  });

  if (!confirmed) return;

  layoutStore.changeLoaderValue(true);
  let successMessage: string | null = null;
  let errorMessage: string | null = null;

  try {
    const response = await change69bStatus(id);
    await fetchData();
    successMessage = response.message;
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    errorMessage = data.message ?? `No fue posible ${action} el registro 69b.`;
  } finally {
    layoutStore.changeLoaderValue(false);
  }

  if (errorMessage) {
    await swal.error({ title: 'Error', text: errorMessage });
  } else if (successMessage) {
    await swal.success(successMessage);
  }
}

async function on69bImported(message: string) {
  await swal.success(message);
  await fetchData();
}
</script>

<template>
  <CommonPageHeader :title="pageTitle" :items="breadcrumbItems" />

  <BCard>
    <div class="d-flex flex-wrap gap-2 mb-3">
      <BButton variant="primary" @click="onAdd69b">
        <i class="bx bx-plus align-middle" />
        Agregar
      </BButton>

      <BButton variant="info" @click="onOpenVerifyModal">
        <i class="bx bx-search align-middle" />
        Verificar RFC/Razón Social
      </BButton>

      <BButton variant="success" @click="onOpenImportModal">
        <i class="bx bx-upload align-middle" />
        Importar SAT
      </BButton>
    </div>

    <TablesTable
      :fields="fields"
      :items="tableItems"
      :is-busy="isBusy"
      :current-page="currentPage"
      :show-add-btn="false"
      :show-upload-layout-btn="false"
      :per-page="perPage"
      :total-rows="totalRows"
      @search="onSearch"
      @change="onTableChange"
      @update-item="onUpdate69b"
      @delete-item="onChange69bStatus" />
  </BCard>

  <Modal69b
    v-model="showModal"
    :mode="modalMode"
    :record69b="selected69b"
    @saved="on69bSaved"
    @hidden="selected69b = null" />

  <Verify69bModal v-model="showVerifyModal" />

  <ImportSat69bModal v-model="showImportModal" @imported="on69bImported" />
</template>

<style scoped></style>
