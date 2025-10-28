'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isHydrated, user, token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Só executar redirecionamento uma vez
    if (mounted && isHydrated && !isLoading && !hasRedirected) {
      // Verificar se temos dados válidos de autenticação
      if (!user || !token || !isAuthenticated) {
        console.log('Redirecionando para login - dados de auth inválidos:', { user, token, isAuthenticated });
        setHasRedirected(true);
        
        // Verificar se já estamos na página de login
        if (!window.location.pathname.includes('/login')) {
          router.replace('/login');
        }
      }
    }
  }, [mounted, isHydrated, isLoading, hasRedirected, user, token, isAuthenticated, router]);

  // Aguardar montagem do componente
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-loading="true">
        <LoadingSpinner size="lg" text="Inicializando aplicação" />
      </div>
    );
  }

  // Mostrar loading durante a hidratação
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-loading="true">
        <LoadingSpinner size="lg" text="Verificando autenticação" />
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated || !user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-loading="true">
        <LoadingSpinner size="lg" text="Redirecionando para login..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}
