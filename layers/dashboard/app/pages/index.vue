<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

useSeoMeta({
  title: 'Dashboard',
  description: 'Panel principal',
});

const breadcrumbItems = [
  {
    text: 'Dashboard',
    active: true,
  },
];
</script>

<template>
  <CommonPageHeader title="Dashboard" :items="breadcrumbItems" />
</template>
