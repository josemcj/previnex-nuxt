export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('auth-token');

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore();

        authStore.forceLogout();

        if (useRoute().path !== '/login') {
          await navigateTo('/login');
        }
      }
    },
  });

  return {
    provide: { api },
  };
});
