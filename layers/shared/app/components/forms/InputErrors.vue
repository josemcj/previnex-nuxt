<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';

defineProps<{
  errors: readonly ErrorObject[];
}>();
</script>

<template>
  <div v-for="error in errors" :key="error.$uid" class="invalid-feedback">
    <span>{{ error.$message }}</span>
  </div>
</template>
