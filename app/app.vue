<script setup lang="ts">
const appConfig = useAppConfig();

useHead({
  titleTemplate: (pageTitle) => {
    if (!pageTitle) {
      return appConfig.title;
    }

    return `${pageTitle} | ${appConfig.title}`;
  },
});

useSeoMeta({
  description: appConfig.description,
});
</script>

<template>
  <BApp>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </BApp>
</template>
