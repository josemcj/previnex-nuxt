<script setup lang="ts">
const props = defineProps<{
  status: number | string;
}>();

const isActive = computed(() => Number(props.status) === 1);
</script>

<template>
  <BBadge pill :class="isActive ? 'bg-soft-success' : 'bg-soft-danger'" class="font-size-12">
    {{ isActive ? 'Activo' : 'Inactivo' }}
  </BBadge>
</template>
