<script setup lang="ts">
const props = defineProps<{
  status: number | string;
}>();

const isActive = computed(() => Number(props.status) === 1);
</script>

<template>
  <i class="bx font-size-20" :class="isActive ? 'bx-trash' : 'bx-check-circle'" />
</template>
