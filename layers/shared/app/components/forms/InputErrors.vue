<script setup lang="ts">
import type { ValidationError } from '~~/layers/shared/app/types/validationError';

defineProps<{
  errors: readonly ValidationError[];
}>();
</script>

<template>
  <div v-for="error in errors" :key="error.$uid" class="invalid-feedback">
    <span>{{ error.$message }}</span>
  </div>
</template>
