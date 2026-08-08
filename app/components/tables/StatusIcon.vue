<script setup lang="ts">
const props = defineProps<{
  status: number | string;
}>();

const isActive = computed(() => Number(props.status) === 1);
</script>

<template>
  <i class="uil font-size-20" :class="isActive ? 'uil-trash-alt delete-icon' : 'uil-check-circle activate-icon'" />
</template>

<style scoped>
.activate-icon {
  color: #78c79e;
}
</style>
