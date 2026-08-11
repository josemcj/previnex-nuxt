import type { LoginResponse, LogoutResponse, UserCredentials } from '#layers/auth/app/types/auth';

export function useAuthApi() {
  const { $api } = useNuxtApp();

  function login(credentials: UserCredentials) {
    return $api<LoginResponse>('/login', {
      method: 'POST',
      body: credentials,
    });
  }

  function logout() {
    return $api<LogoutResponse>('/logout', {
      method: 'POST',
    });
  }

  return {
    login,
    logout,
  };
}
