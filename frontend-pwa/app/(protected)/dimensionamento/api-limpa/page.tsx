'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dimensionamentoApiClean, addAuthToken, removeAuthToken } from '@/lib/api-clean';
import { useUserStore } from '@/store/userStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MapPin, Search, Filter, Upload, Download, Plus } from 'lucide-react';

interface Dimensionamento {
  id: string;
  codigo: number;
  regiao: string;
  municipio_bairro: string;
  opm: string;
  risp: string;
  aisp: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  porRegiao: Record<string, number>;
  porRisp: Record<string, number>;
  porAisp: Record<string, number>;
}

export default function DimensionamentoPageClean() {
  const [dimensionamentos, setDimensionamentos] = useState<Dimensionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const { token } = useUserStore();

  useEffect(() => {
    console.log('🚀 DimensionamentoPageClean - Iniciando');
    setMounted(true);
    
    // Configurar token de autenticação
    if (token) {
      addAuthToken(token);
      console.log('✅ Token configurado na API limpa');
    } else {
      removeAuthToken();
      console.log('❌ Nenhum token encontrado');
    }
    
    loadStats();
  }, [token]);

  const loadStats = async () => {
    try {
      console.log('📊 Carregando estatísticas com API limpa...');
      setError(null);
      
      const statsData = await dimensionamentoApiClean.getStats();
      
      console.log('📊 Estatísticas recebidas:', statsData);
      setStats(statsData);
      console.log('✅ Estatísticas carregadas com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      // Definir erro específico
      if (error.response?.status === 401) {
        setError('Erro de autenticação. Token inválido ou expirado.');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError(`Erro ao carregar dados: ${error.message}`);
      }
      
      // Banco vazio ou erro - mostrar zeros
      setStats({
        total: 0,
        porRegiao: {},
        porRisp: {},
        porAisp: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showDebugInfo = () => {
    const debug = {
      mounted,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      stats: stats,
      error,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://siraop-backend.fly.dev/api',
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A'
    };
    
    setDebugInfo(debug);
    console.log('🔍 Debug Info (API Limpa):', debug);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando com API limpa" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-xl mb-4">❌ Erro</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                loadStats();
              }}
              className="btn-primary w-full"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push('/dimensionamento/teste-simples')}
              className="btn-outline w-full"
            >
              Ir para Teste Simples
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              Dimensionamento Territorial - API LIMPA
            </h1>
            <p className="text-gray-600 mt-2">
              Versão sem interceptors problemáticos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadStats}
              className="btn-outline flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Recarregar
            </button>
            <button
              onClick={showDebugInfo}
              className="btn-outline flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Debug
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">Informações de Debug (API Limpa)</h3>
          </div>
          <div className="card-content">
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button
              onClick={() => setDebugInfo(null)}
              className="btn-outline mt-4"
            >
              Fechar Debug
            </button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regiões</p>
                <p className="text-2xl font-bold text-blue-600">{stats ? Object.keys(stats.porRegiao).length : 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">RISP</p>
                <p className="text-2xl font-bold text-green-600">{stats ? Object.keys(stats.porRisp).length : 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AISP</p>
                <p className="text-2xl font-bold text-orange-600">{stats ? Object.keys(stats.porAisp).length : 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card">
        <div className="card-content text-center">
          <div className="text-green-600 text-xl mb-2">✅ API Limpa Funcionando</div>
          <p className="text-gray-600 mb-4">
            Esta versão usa uma API sem interceptors que causam reloads automáticos
          </p>
          <div className="text-sm text-gray-500">
            Carregado em: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
