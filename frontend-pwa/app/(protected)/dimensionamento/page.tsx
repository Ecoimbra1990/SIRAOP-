'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [dimensionamentos, setDimensionamentos] = useState<Dimensionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegiao, setFilterRegiao] = useState('');
  const [filterOpm, setFilterOpm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importObservacoes, setImportObservacoes] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadDimensionamentos();
    loadStats();
  }, []);

  const loadDimensionamentos = async () => {
    try {
      setIsLoading(true);
      // Simular carregamento de dados
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
    } catch (error) {
      console.error('Erro ao carregar dimensionamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Simular carregamento de estatísticas
      setStats({
        total: 602,
        porRegiao: {
          'Capital': 185,
          'Interior': 400,
          'RMS': 17
        },
        porRisp: {
          'Atlântico': 45,
          'BTS': 38,
          'Central': 52,
          'Chapada': 25,
          'Extremo Sul': 15,
          'Leste': 35,
          'Meio-Oeste': 28,
          'Nordeste': 22,
          'Norte': 18,
          'Oeste': 12,
          'Recôncavo': 20,
          'RMS': 17,
          'Sudoeste': 45,
          'Sul': 30
        },
        porAisp: {
          '01 - Barris': 8,
          '02 - Liberdade': 12,
          '03 - Bonfim': 15,
          '04 - São Caetano': 10,
          '05 - Periperi': 18,
          '06 - Brotas': 22,
          '07 - Rio Vermelho': 15,
          '08 - CIA': 5,
          '09 - Boca do Rio': 8,
          '10 - Pau da Lima': 12,
          '11 - Tancredo Neves': 25,
          '12 - Itapuã': 20,
          '13 - Cajazeiras': 18,
          '14 - Barra': 10,
          '15 - Nordeste de Amaralina': 8,
          '16 - Pituba': 12
        }
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleImport = async () => {
    try {
      // Implementar importação
      console.log('Importando dados:', importData);
      setShowImportModal(false);
      setImportData('');
      setImportObservacoes('');
      loadDimensionamentos();
    } catch (error) {
      console.error('Erro na importação:', error);
    }
  };

  const filteredDimensionamentos = dimensionamentos.filter(item => {
    const matchesSearch = item.municipio_bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.opm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.risp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.aisp.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegiao = !filterRegiao || item.regiao === filterRegiao;
    const matchesOpm = !filterOpm || item.opm.includes(filterOpm);
    
    return matchesSearch && matchesRegiao && matchesOpm;
  });

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
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-blue-600">{Object.keys(stats.porRegiao).length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{Object.keys(stats.porRisp).length}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{Object.keys(stats.porAisp).length}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      )}

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
            Dimensionamento Territorial ({filteredDimensionamentos.length} registros)
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
                {filteredDimensionamentos.map((item) => (
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
                className="btn-primary"
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
