<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentPage: number;
    perPage?: number;
    totalRows: number;
  }>(),
  {
    perPage: 10,
  },
);

const emit = defineEmits<{
  change: [page: number];
}>();

const page = ref(props.currentPage);

watch(
  () => props.currentPage,
  (value) => {
    page.value = value;
  },
);

watch(page, (value) => emit('change', value));
</script>

<template>
  <BRow>
    <BCol>
      <div class="dataTables_paginate paging_simple_numbers float-end">
        <BPagination v-model="page" class="pagination-rounded mb-0" :total-rows="totalRows" :per-page="perPage" />
      </div>
    </BCol>
  </BRow>
</template>
