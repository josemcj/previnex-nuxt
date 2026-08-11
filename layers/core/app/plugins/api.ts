export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('auth-token');
  const authStore = useAuthStore();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }

      options.headers.set('Accept', 'application/json');
    },

    async onResponseError({ response }) {
      if (response.status !== 401) {
        return;
      }

      authStore.forceLogout();
      const route = useRoute();

      if (route.path !== '/login') {
        await nuxtApp.runWithContext(() => navigateTo('/login'));
      }
    },
  });

  return {
    provide: { api },
  };
});
