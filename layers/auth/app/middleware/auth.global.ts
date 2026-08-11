export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.requiresAuth === false) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    return navigateTo('/login');
  }
});
