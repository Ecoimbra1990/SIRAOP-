import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';

export function useAuth() {
  const { isAuthenticated, isLoading, isHydrated, user, token, setHydrated, setLoading } = useUserStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Só executar uma vez por montagem do componente
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
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
      
      // Só marcar como não carregando se já estamos hidratados
      if (isHydrated) {
        setLoading(false);
      }
    }
  }, []); // Dependências vazias para executar apenas uma vez

  return {
    isAuthenticated,
    isLoading: isLoading || !isHydrated, // Sempre mostrar loading se não hidratado
    isHydrated,
    user,
    token,
  };
}
