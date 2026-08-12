<script setup lang="ts">
import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { BreadcrumbItem } from '#layers/core/app/types/utils';
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

const { getStandards } = useStandardsApi();

const { tableItems, isBusy, currentPage, perPage, totalRows, fetchData, onSearch, onTableChange } =
  usePaginatedTable<Standard>(fields, getStandards);

await fetchData();
</script>

<template>
  <CommonPageHeader :title="pageTitle" :items="breadcrumbItems" />

  <BCard>
    <TablesTable
      :fields="fields"
      :items="tableItems"
      :is-busy="isBusy"
      :current-page="currentPage"
      :per-page="perPage"
      :total-rows="totalRows"
      @search="onSearch"
      @change="onTableChange" />
  </BCard>
</template>
