'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dimensionamentoApi } from '@/lib/api';
import { 
  MapPin, 
  Search, 
  Filter, 
  Upload, 
  Download, 
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
  console.log('🚀 VERCEL DEBUG v3.0 - Componente carregado');
  console.log('🚀 VERCEL DEBUG v3.0 - Stats inicial:', null);
  
  const [dimensionamentos, setDimensionamentos] = useState<Dimensionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegiao, setFilterRegiao] = useState('');
  const [filterOpm, setFilterOpm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importObservacoes, setImportObservacoes] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    loadDimensionamentos();
    loadStats();
  }, []);

  useEffect(() => {
    // Recarregar quando filtros mudarem
    const timeoutId = setTimeout(() => {
      loadDimensionamentos(1, false);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
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

      const data = await dimensionamentoApi.getAll({
        page,
        limit: 50,
        search: searchTerm,
        regiao: filterRegiao,
        opm: filterOpm
      });

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
    } catch (error) {
      console.error('Erro ao carregar dimensionamentos:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
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
      console.log('🔍 VERCEL DEBUG - Iniciando loadStats');
      console.log('🔍 VERCEL DEBUG - Stats atual:', stats);
      console.log('📊 Carregando estatísticas...');
      
      // Tentar carregar dados sem paginação para obter todos os registros
      const statsData = await dimensionamentoApi.getAll({
        page: 1,
        limit: 1000 // Limite alto para pegar todos os dados
      });
      
      console.log('📊 Dados recebidos para estatísticas:', statsData);
      console.log('🔍 VERCEL DEBUG - Tipo dos dados:', typeof statsData);
      console.log('🔍 VERCEL DEBUG - É array?', Array.isArray(statsData));

      // Se a resposta é paginada, usar os dados paginados
      if (statsData && typeof statsData === 'object' && 'items' in statsData) {
        const items = statsData.items;
        const stats = {
          total: statsData.total,
          porRegiao: {},
          porRisp: {},
          porAisp: {}
        };

        items.forEach(item => {
          stats.porRegiao[item.regiao] = (stats.porRegiao[item.regiao] || 0) + 1;
          stats.porRisp[item.risp] = (stats.porRisp[item.risp] || 0) + 1;
          stats.porAisp[item.aisp] = (stats.porAisp[item.aisp] || 0) + 1;
        });

        console.log('📊 Estatísticas calculadas:', stats);
        console.log('🔍 VERCEL DEBUG - Definindo stats:', stats);
        setStats(stats);
        console.log('🔍 VERCEL DEBUG - Stats definido com sucesso');
      } else if (Array.isArray(statsData)) {
        // Se a resposta é um array simples
        const stats = {
          total: statsData.length,
          porRegiao: {},
          porRisp: {},
          porAisp: {}
        };

        statsData.forEach(item => {
          stats.porRegiao[item.regiao] = (stats.porRegiao[item.regiao] || 0) + 1;
          stats.porRisp[item.risp] = (stats.porRisp[item.risp] || 0) + 1;
          stats.porAisp[item.aisp] = (stats.porAisp[item.aisp] || 0) + 1;
        });

        console.log('📊 Estatísticas calculadas:', stats);
        console.log('🔍 VERCEL DEBUG - Definindo stats:', stats);
        setStats(stats);
        console.log('🔍 VERCEL DEBUG - Stats definido com sucesso');
      } else {
        // Banco vazio - mostrar zeros
        console.log('📊 Banco vazio - definindo estatísticas como zero');
        setStats({
          total: 0,
          porRegiao: {},
          porRisp: {},
          porAisp: {}
        });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      console.log('🔍 VERCEL DEBUG - Erro capturado, definindo stats como zero');
      // Banco vazio ou erro - mostrar zeros
      setStats({
        total: 0,
        porRegiao: {},
        porRisp: {},
        porAisp: {}
      });
      console.log('🔍 VERCEL DEBUG - Stats definido como zero após erro');
    }
  };

  const handleImport = async () => {
    try {
      if (!importData.trim()) {
        alert('Por favor, cole o conteúdo do CSV antes de importar.');
        return;
      }

      setIsImporting(true);
      const result = await dimensionamentoApi.import({
        csvContent: importData,
        observacoes: importObservacoes
      });

      console.log('Importação realizada:', result);
      alert(`Importação concluída! ${result.imported} registros importados.${result.errors.length > 0 ? ` ${result.errors.length} erros encontrados.` : ''}`);
      
      setShowImportModal(false);
      setImportData('');
      setImportObservacoes('');
      
      // Recarregar dados após importação
      loadDimensionamentos();
      loadStats();
    } catch (error) {
      console.error('Erro na importação:', error);
      alert('Erro ao importar dados. Verifique o console para mais detalhes.');
    } finally {
      setIsImporting(false);
    }
  };

  const loadSampleData = async () => {
    try {
      setIsImporting(true);
      
      console.log('🔍 Iniciando importação automática...');
      
      // Carregar dados do arquivo CSV local
      const response = await fetch('/dimensionamento.csv');
      if (!response.ok) {
        throw new Error(`Erro ao carregar CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvContent = await response.text();
      console.log('✅ CSV carregado:', csvContent.length, 'caracteres');
      console.log('📊 Primeiras linhas do CSV:', csvContent.split('\n').slice(0, 5));
      
      console.log('📤 Enviando para API...');
      const result = await dimensionamentoApi.import({
        csvContent,
        observacoes: 'Importação automática dos dados de dimensionamento'
      });

      console.log('✅ Importação automática realizada:', result);
      alert(`Importação automática concluída! ${result.imported} registros importados.${result.errors.length > 0 ? ` ${result.errors.length} erros encontrados.` : ''}`);
      
      // Recarregar dados após importação
      console.log('🔄 Recarregando dados...');
      loadDimensionamentos();
      loadStats();
    } catch (error) {
      console.error('❌ Erro na importação automática:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert(`Erro ao importar dados automaticamente: ${error.message}. Verifique o console para mais detalhes.`);
    } finally {
      setIsImporting(false);
    }
  };

  const showDebugInfo = () => {
    const debug = {
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
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://siraop-backend.fly.dev/api',
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(debug);
    console.log('🔍 Debug Info:', debug);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
            <button
              onClick={loadSampleData}
              disabled={isImporting}
              className="btn-outline flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Carregando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Carregar Dados
                </>
              )}
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="btn-outline flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </button>
            <button className="btn-outline flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo
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
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRegiao('');
                  setFilterOpm('');
                }}
                className="btn-outline w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
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
                ))}
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

      {/* Modal de Importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Importar Dimensionamento CSV
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo do CSV
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                  className="input"
                  placeholder="Cole aqui o conteúdo do arquivo CSV..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={importObservacoes}
                  onChange={(e) => setImportObservacoes(e.target.value)}
                  className="input"
                  placeholder="Observações sobre a importação..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="btn-primary flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importando...
                  </>
                ) : (
                  'Importar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
