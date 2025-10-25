'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Navbar from '@/components/Navbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, token } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Aguardar a rehidratação do Zustand
    if (!isLoading) {
      // Verificar se temos dados válidos de autenticação
      if (!user || !token || !isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, token, router]);

  // Mostrar loading durante a rehidratação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated || !user || !token) {
    return null;
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
