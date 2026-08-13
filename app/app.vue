<script setup lang="ts">
const appConfig = useAppConfig();
const layoutStore = useLayoutStore();
const { loader } = storeToRefs(layoutStore);

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

    <div v-if="loader" id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div v-for="index in 6" :key="index" class="chase-dot" />
        </div>
      </div>
    </div>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </BApp>
</template>
