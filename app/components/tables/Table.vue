<script setup lang="ts" generic="T extends TableRow">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { TableRow, TableStatusValue } from '@/types/table';

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

function statusId(item: TableRow): TableStatusValue | undefined {
  if (typeof item.status === 'object') {
    return item.status?.id;
  }

  return item.status ?? item.status_id;
}
</script>

<template>
  <BRow>
    <BCol md="6">
      <div v-if="showAddBtn" class="mb-3">
        <BLink v-if="addBtnHref" :to="addBtnHref" class="btn btn-primary">
          <i class="mdi mdi-plus" />
          Agregar {{ addBtnText }}
        </BLink>

        <BButton v-else variant="primary" @click="emit('addBtnClick')">
          <i class="mdi mdi-plus" />
          Agregar {{ addBtnText }}
        </BButton>
      </div>
    </BCol>
  </BRow>

  <BRow>
    <TablesPerPageSelect :options="perPageOptions" :option-selected="pageSize" @change="handlePerPageChange" />
    <TablesSearch @search="handleSearch" />
  </BRow>

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
        <ul class="list-inline mb-0">
          <li v-if="showEditBtn" class="list-inline-item">
            <BButton
              v-b-tooltip.hover
              class="px-2 text-primary"
              variant="link"
              title="Editar"
              @click="emit('updateItem', data.item)">
              <i class="uil uil-edit font-size-20" />
            </BButton>
          </li>

          <li v-if="showDeleteBtn && statusId(data.item) != null" class="list-inline-item">
            <BButton
              v-b-tooltip.hover
              class="px-2 text-primary"
              variant="link"
              :title="Number(statusId(data.item)) === 1 ? 'Eliminar' : 'Activar'"
              @click="emit('deleteItem', data.item.id, data.item)">
              <TablesStatusIcon :status="statusId(data.item) ?? 0" />
            </BButton>
          </li>
        </ul>
      </template>
    </BTable>
  </div>

  <TablesPagination :current-page="page" :total-rows="totalRows" :per-page="pageSize" @change="handlePageChange" />
</template>
