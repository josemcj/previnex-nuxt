<script setup lang="ts" generic="T extends TableRow">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { TableRow } from '~~/layers/shared/app/types/table';

const props = withDefaults(
  defineProps<{
    fields: readonly TableFieldRaw<T>[];
    items: T[];
    isBusy: boolean;
    currentPage: number;
    perPage?: number;
    totalRows: number;
    showAddBtn?: boolean;
    perPageOptions?: readonly number[];
    showEditBtn?: boolean;
    showDeleteBtn?: boolean;
    addBtnText?: string;
    addBtnHref?: string;
    permissionsAsBadges?: boolean;
  }>(),
  {
    perPage: 10,
    showAddBtn: true,
    perPageOptions: () => [10, 25, 50, 100],
    showEditBtn: true,
    showDeleteBtn: true,
    addBtnText: '',
    addBtnHref: undefined,
    permissionsAsBadges: false,
  },
);

const emit = defineEmits<{
  search: [value: string];
  addBtnClick: [];
  change: [currentPage: number, perPage: number];
  updateItem: [item: T];
  deleteItem: [id: unknown, item: T];
}>();

const page = ref(props.currentPage);
const pageSize = ref(props.perPage);

watch(
  () => props.currentPage,
  (value) => {
    page.value = value;
  },
);

watch(
  () => props.perPage,
  (value) => {
    pageSize.value = value;
  },
);

function handleSearch(value: string) {
  page.value = 1;
  emit('search', value);
}

function handlePageChange(value: number) {
  page.value = value;
  emit('change', page.value, pageSize.value);
}

function handlePerPageChange(value: number) {
  page.value = 1;
  pageSize.value = value;
  emit('change', page.value, pageSize.value);
}

function releaseFocus(event: MouseEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.blur();
  }
}

function handleUpdateItem(event: MouseEvent, item: T) {
  releaseFocus(event);
  emit('updateItem', item);
}

function handleAddItem(event: MouseEvent) {
  releaseFocus(event);
  emit('addBtnClick');
}

function handleDeleteItem(event: MouseEvent, item: T) {
  releaseFocus(event);
  emit('deleteItem', item.id, item);
}

function statusId(item: TableRow): number | undefined {
  const value = typeof item.status === 'object' ? item.status?.id : (item.status ?? item.status_id);

  if (value === undefined || value === null || value === '') return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}
</script>

<template>
  <div class="table-toolbar d-flex flex-column flex-lg-row align-items-lg-center gap-3 mb-3">
    <div v-if="showAddBtn">
      <BLink v-if="addBtnHref" :to="addBtnHref" class="btn btn-primary text-nowrap">
        <i class="bx bx-plus align-middle" />
        Agregar {{ addBtnText }}
      </BLink>

      <BButton v-else variant="primary" class="text-nowrap" @click="handleAddItem">
        <i class="bx bx-plus align-middle" />
        Agregar {{ addBtnText }}
      </BButton>
    </div>

    <div class="table-controls d-flex flex-column flex-sm-row align-items-sm-center gap-3 ms-lg-auto">
      <TablesSearch @search="handleSearch" />
      <TablesPerPageSelect :options="perPageOptions" :option-selected="pageSize" @change="handlePerPageChange" />
    </div>
  </div>

  <div class="table-responsive">
    <BTable :busy="isBusy" :items="items" :fields="fields" responsive="sm" striped hover>
      <template #table-busy>
        <TablesSpinner />
      </template>

      <template #cell(status)="data">
        <TablesStatusBadge :status="statusId(data.item) ?? 0" />
      </template>

      <template #cell(status_id)="data">
        <TablesStatusBadge :status="statusId(data.item) ?? 0" />
      </template>

      <template #cell(actions)="data">
        <div class="d-inline-flex align-items-center gap-2" role="group" aria-label="Acciones del registro">
          <BButton
            v-if="showEditBtn && statusId(data.item) != 2"
            v-b-tooltip.hover
            class="action-button action-button--edit p-1"
            variant="link"
            title="Editar"
            aria-label="Editar"
            @click="handleUpdateItem($event, data.item)">
            <i class="bx bx-edit-alt font-size-20" aria-hidden="true" />
          </BButton>

          <BButton
            v-if="showDeleteBtn && statusId(data.item) != null"
            v-b-tooltip.hover
            class="action-button p-1"
            :class="statusId(data.item) === 1 ? 'action-button--delete' : 'action-button--activate'"
            variant="link"
            :title="statusId(data.item) === 1 ? 'Eliminar' : 'Activar'"
            :aria-label="statusId(data.item) === 1 ? 'Eliminar' : 'Activar'"
            @click="handleDeleteItem($event, data.item)">
            <TablesStatusIcon :status="statusId(data.item) ?? 0" aria-hidden="true" />
          </BButton>
        </div>
      </template>
    </BTable>
  </div>

  <TablesPagination :current-page="page" :total-rows="totalRows" :per-page="pageSize" @change="handlePageChange" />
</template>

<style scoped>
.table-controls {
  width: 100%;
}

@media (min-width: 992px) {
  .table-controls {
    width: auto;
  }
}

.action-button {
  border-radius: 0.35rem;
  line-height: 1;
}

.action-button--edit {
  color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.12);
}

.action-button--delete {
  color: var(--bs-danger);
  background-color: rgba(var(--bs-danger-rgb), 0.14);
}

.action-button--activate {
  color: var(--bs-success);
  background-color: rgba(var(--bs-success-rgb), 0.14);
}
</style>
