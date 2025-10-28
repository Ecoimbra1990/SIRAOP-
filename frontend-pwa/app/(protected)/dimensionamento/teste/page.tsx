'use client';

import { useState, useEffect } from 'react';
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

export default function DimensionamentoPageSimplified() {
  const [dimensionamentos, setDimensionamentos] = useState<Dimensionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log('🚀 DimensionamentoPageSimplified - Iniciando carregamento');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Carregando dados mock...');
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mock para teste
      const mockStats: Stats = {
        total: 150,
        porRegiao: {
          'Capital': 80,
          'Interior': 45,
          'RMS': 25
        },
        porRisp: {
          'Atlântico': 60,
          'Centro': 40,
          'Sul': 30,
          'Norte': 20
        },
        porAisp: {
          '01 - Centro': 15,
          '02 - Barris': 12,
          '03 - Brotas': 18,
          '04 - Itapuã': 20
        }
      };

      const mockDimensionamentos: Dimensionamento[] = [
        {
          id: '1',
          codigo: 1,
          regiao: 'Capital',
          municipio_bairro: 'Acupe',
          opm: '26ª CIPM - Brotas',
          risp: 'Atlântico',
          aisp: '06 - Brotas',
          ativo: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: '2',
          codigo: 2,
          regiao: 'Capital',
          municipio_bairro: 'Aeroporto',
          opm: '15ª CIPM - Itapuã',
          risp: 'Atlântico',
          aisp: '12 - Itapuã',
          ativo: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: '3',
          codigo: 3,
          regiao: 'Interior',
          municipio_bairro: 'Feira de Santana',
          opm: '1ª CIPM - Feira de Santana',
          risp: 'Centro',
          aisp: '01 - Centro',
          ativo: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];

      setStats(mockStats);
      setDimensionamentos(mockDimensionamentos);
      
      console.log('✅ Dados mock carregados com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const showDebugInfo = () => {
    const debug = {
      dimensionamentos: dimensionamentos.length,
      stats: stats,
      isLoading,
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    setDebugInfo(debug);
    console.log('🔍 Debug Info:', debug);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando dados de teste" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ Erro</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="btn-primary"
          >
            Tentar Novamente
          </button>
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
              Dimensionamento Territorial - TESTE
            </h1>
            <p className="text-gray-600 mt-2">
              Versão simplificada para teste de carregamento
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
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
            <h3 className="card-title">Informações de Debug</h3>
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

      {/* Tabela */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Dimensionamento Territorial ({dimensionamentos.length} registros)
          </h2>
        </div>
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Região
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Município/Bairro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RISP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AISP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dimensionamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.regiao === 'Capital' ? 'bg-blue-100 text-blue-800' :
                        item.regiao === 'Interior' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {item.regiao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.municipio_bairro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.opm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.risp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.aisp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 text-center text-sm text-gray-500">
        ✅ Página de teste carregada com sucesso - {new Date().toLocaleString()}
      </div>
    </div>
  );
}
