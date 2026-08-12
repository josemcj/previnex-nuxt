<script setup lang="ts">
const props = defineProps<{
  status: number | string;
}>();

const isActive = computed(() => Number(props.status) === 1);
</script>

<template>
  <BBadge
    pill
    :variant="null"
    class="status-badge font-size-12"
    :class="isActive ? 'status-badge--active' : 'status-badge--inactive'">
    {{ isActive ? 'Activo' : 'Inactivo' }}
  </BBadge>
</template>

<style scoped>
.status-badge {
  font-weight: 600;
}

.status-badge--active {
  color: var(--bs-success);
  background-color: rgba(var(--bs-success-rgb), 0.18) !important;
}

.status-badge--inactive {
  color: var(--bs-danger);
  background-color: rgba(var(--bs-danger-rgb), 0.18) !important;
}
</style>
