import type { User } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth-token', {
    default: () => null,
    sameSite: 'lax',
  });

  const user = ref<User | null>(null);

  const isLoggedIn = computed(() => Boolean(token.value));

  function setSession(accessToken: string, authenticatedUser: User) {
    token.value = accessToken;
    user.value = authenticatedUser;
  }

  function forceLogout() {
    token.value = null;
    user.value = null;
  }

  function getFullName(): string {
    if (!user.value) {
      return '';
    }

    return `${user.value.name} ${user.value.last_name}`.trim();
  }

  return {
    token,
    user,
    isLoggedIn,
    setSession,
    forceLogout,
    getFullName,
  };
});
