export default defineNuxtPlugin((nuxtApp) => {
  const layoutStore = useLayoutStore();

  nuxtApp.hook('page:start', () => {
    layoutStore.changeLoaderValue(true);
  });

  nuxtApp.hook('page:finish', () => {
    layoutStore.changeLoaderValue(false);
  });

  nuxtApp.$router.onError(() => {
    layoutStore.changeLoaderValue(false);
  });
});
