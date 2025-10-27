import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const { isAuthenticated, isLoading, isHydrated, user, token, setHydrated, setLoading } = useUserStore();

  useEffect(() => {
    // Marcar como hidratado quando o componente monta
    if (!isHydrated) {
      setHydrated(true);
    }
    
    // Se temos dados de autenticação válidos, marcar como autenticado
    if (user && token && !isAuthenticated) {
      useUserStore.getState().login(user, token);
    }
    
    // Só marcar como não autenticado se realmente não temos dados E já estamos hidratados
    if (isHydrated && (!user || !token) && isAuthenticated) {
      useUserStore.getState().logout();
    }
    
    setLoading(false);
  }, [isHydrated, setHydrated, setLoading, user, token, isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    isHydrated,
    user,
    token,
  };
}
