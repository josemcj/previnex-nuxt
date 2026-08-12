<script setup lang="ts">
import type { BreadcrumbItem } from '#layers/core/app/types/utils';

withDefaults(
  defineProps<{
    title?: string;
    items?: BreadcrumbItem[];
  }>(),
  {
    title: '',
    items: () => [],
  },
);
</script>

<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box d-flex align-items-center justify-content-between">
        <h4 class="mb-0 font-size-18">
          {{ title }}
        </h4>

        <div class="page-title-right">
          <BBreadcrumb :items="items" class="m-0" />
        </div>
      </div>
    </div>
  </div>
</template>
