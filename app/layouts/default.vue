<script setup lang="ts">
const appConfig = useAppConfig();
const layoutType = appConfig.layout.type;
</script>

<template>
  <LazyLayoutVerticalLayout v-if="layoutType === 'vertical'">
    <slot />
  </LazyLayoutVerticalLayout>

  <LazyLayoutHorizontalLayout v-else>
    <slot />
  </LazyLayoutHorizontalLayout>
</template>
