import type { User } from '#layers/auth/app/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth-token', {
    default: () => null,
    sameSite: 'lax',
  });

  const user = useCookie<User | null>('auth-user', {
    default: () => null,
    sameSite: 'lax',
  });

  const isLoggedIn = computed(() => Boolean(token.value));

  const fullName = computed(() => {
    if (!user.value) return '';
    return [user.value.name, user.value.last_name, user.value.second_last_name].filter(Boolean).join(' ');
  });

  function setSession(accessToken: string, authenticatedUser: User) {
    token.value = accessToken;
    user.value = authenticatedUser;
  }

  function forceLogout() {
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    isLoggedIn,
    fullName,
    setSession,
    forceLogout,
  };
});
