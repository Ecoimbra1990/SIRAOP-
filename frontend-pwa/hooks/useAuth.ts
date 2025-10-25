import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const { isAuthenticated, isLoading, isHydrated, user, token, setHydrated } = useUserStore();

  useEffect(() => {
    // Marcar como hidratado quando o componente monta
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  return {
    isAuthenticated,
    isLoading,
    isHydrated,
    user,
    token,
  };
}
