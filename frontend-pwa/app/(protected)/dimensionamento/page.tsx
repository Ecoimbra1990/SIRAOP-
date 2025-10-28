'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dimensionamentoApi } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Building2,
  Users,
  Shield
} from 'lucide-react';

interface Dimensionamento {
  id: string;
  codigo: number;
  regiao: string;
  municipio_bairro: string;
  opm: string;
  risp: string;
  aisp: string;
  observacoes?: string;
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

export default function DimensionamentoPage() {
  
  const [dimensionamentos, setDimensionamentos] = useState<Dimensionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegiao, setFilterRegiao] = useState('');
  const [filterOpm, setFilterOpm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const { makeRequest, cancelRequest } = useApi();

  useEffect(() => {
    console.log('🚀 DimensionamentoPage - Iniciando');
    setMounted(true);
    
    // Carregar apenas estatísticas básicas na inicialização
    loadStats();
    
    // Cleanup: cancelar requisições quando o componente for desmontado
    return () => {
      console.log('🧹 DimensionamentoPage - Cleanup');
      cancelRequest();
    };
  }, []);

  useEffect(() => {
    // Só recarregar quando filtros mudarem E houver filtros ativos
    const hasActiveFilters = searchTerm.trim() || filterRegiao || filterOpm.trim();
    
    if (hasActiveFilters) {
      const timeoutId = setTimeout(() => {
        loadDimensionamentos(1, false);
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timeoutId);
    } else {
      // Se não há filtros, limpar dados
      setDimensionamentos([]);
      setTotalCount(0);
    }
  }, [searchTerm, filterRegiao, filterOpm]);

  const loadDimensionamentos = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      console.log('🔍 Carregando dimensionamentos...', {
        page,
        limit: 50,
        search: searchTerm,
        regiao: filterRegiao,
        opm: filterOpm
      });

      const data = await makeRequest(() => dimensionamentoApi.getAll({
        page,
        limit: 50,
        search: searchTerm,
        regiao: filterRegiao,
        opm: filterOpm
      }));

      console.log('✅ Dados recebidos da API:', data);
      console.log('✅ Tipo dos dados:', typeof data);
      console.log('✅ É array?', Array.isArray(data));
      console.log('✅ Tem propriedade items?', data && typeof data === 'object' && 'items' in data);

      // Verificar se a resposta é paginada ou um array simples
      if (data && typeof data === 'object' && 'items' in data) {
        // Resposta paginada
        console.log('📊 Processando resposta paginada:', data);
        if (append) {
          setDimensionamentos(prev => [...prev, ...data.items]);
        } else {
          setDimensionamentos(data.items);
        }
        
        setTotalCount(data.total);
        setHasMore(data.hasMore);
        setCurrentPage(page);
      } else if (Array.isArray(data)) {
        // Resposta é um array simples
        console.log('📊 Processando array simples:', data);
        if (append) {
          setDimensionamentos(prev => [...prev, ...data]);
        } else {
          setDimensionamentos(data);
        }
        
        setTotalCount(data.length);
        setHasMore(false);
        setCurrentPage(page);
      } else {
        console.log('❌ Formato de resposta inválido:', data);
        throw new Error('Formato de resposta inválido');
      }
    } catch (error: any) {
      // Ignorar erros de requisições abortadas
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || error.message === 'Request aborted') {
        console.log('Requisição de dimensionamentos cancelada - ignorando');
        return; // Não fazer nada se foi cancelada
      }
      
      console.error('Erro ao carregar dimensionamentos:', error);
      console.error('Detalhes do erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        status: (error as any)?.response?.status,
        data: (error as any)?.response?.data
      });
      
      // Fallback para dados mock se a API falhar
      const mockData: Dimensionamento[] = [
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
        }
      ];
      setDimensionamentos(mockData);
      setTotalCount(mockData.length);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadDimensionamentos(currentPage + 1, true);
    }
  };

  const loadStats = async () => {
    try {
      console.log('📊 Carregando estatísticas...');
      setError(null);
      
      // Usar endpoint específico de estatísticas (muito mais rápido)
      const statsData = await makeRequest(() => dimensionamentoApi.getStats());
      
      console.log('📊 Estatísticas recebidas:', statsData);
      setStats(statsData);
      console.log('✅ Estatísticas carregadas com sucesso');
      
    } catch (error: any) {
      // Ignorar erros de requisições abortadas
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || error.message === 'Request aborted') {
        console.log('Requisição de estatísticas cancelada - ignorando');
        return;
      }
      
      console.error('❌ Erro ao carregar estatísticas:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      // Definir erro específico
      if (error.response?.status === 401) {
        setError('Erro de autenticação. Faça login novamente.');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError(`Erro ao carregar dados: ${error.message}`);
      }
      
      // Banco vazio ou erro - mostrar zeros sem bloquear a interface
      setStats({
        total: 0,
        porRegiao: {},
        porRisp: {},
        porAisp: {}
      });
    } finally {
      // Garantir que o loading seja removido mesmo em caso de erro
      setIsLoading(false);
    }
  };


  const showDebugInfo = () => {
    const debug = {
      mounted,
      dimensionamentos: dimensionamentos.length,
      stats: stats,
      totalCount,
      isLoading,
      isLoadingMore,
      hasMore,
      currentPage,
      searchTerm,
      filterRegiao,
      filterOpm,
      error,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://siraop-backend.fly.dev/api',
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A'
    };
    
    setDebugInfo(debug);
    console.log('🔍 Debug Info:', debug);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando estatísticas" />
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
              <MapPin className="h-8 w-8 text-primary-600" />
              Dimensionamento Territorial
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie o dimensionamento territorial da PMBA
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo
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
              <MapPin className="h-8 w-8 text-primary-600" />
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
              <Building2 className="h-8 w-8 text-blue-500" />
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
              <Users className="h-8 w-8 text-green-500" />
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
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                  placeholder="Município, OPM, RISP, AISP..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Região
              </label>
              <select
                value={filterRegiao}
                onChange={(e) => setFilterRegiao(e.target.value)}
                className="input"
              >
                <option value="">Todas as regiões</option>
                <option value="Capital">Capital</option>
                <option value="Interior">Interior</option>
                <option value="RMS">RMS</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OPM
              </label>
              <input
                type="text"
                value={filterOpm}
                onChange={(e) => setFilterOpm(e.target.value)}
                className="input"
                placeholder="Filtrar por OPM..."
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  const hasActiveFilters = searchTerm.trim() || filterRegiao || filterOpm.trim();
                  if (hasActiveFilters) {
                    loadDimensionamentos(1, false);
                  }
                }}
                className="btn-primary flex-1"
                disabled={!searchTerm.trim() && !filterRegiao && !filterOpm.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRegiao('');
                  setFilterOpm('');
                }}
                className="btn-outline"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Dimensionamento Territorial ({totalCount} registros)
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dimensionamentos.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="h-12 w-12 text-gray-300" />
                        <div>
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum registro carregado
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Use os filtros acima para buscar dados específicos
                          </p>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilterRegiao('');
                              setFilterOpm('');
                              loadDimensionamentos(1, false);
                            }}
                            className="btn-primary"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Carregar Todos os Dados
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dimensionamentos.map((item) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Botão Carregar Mais */}
          {hasMore && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="btn-outline flex items-center gap-2 mx-auto"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Carregando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Carregar Mais ({totalCount - dimensionamentos.length} restantes)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
