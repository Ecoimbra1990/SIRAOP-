'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ocorrenciasApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Upload
} from 'lucide-react';

interface Ocorrencia {
  id: string;
  tipo: string;
  data_hora_fato: string;
  endereco: string;
  bairro?: string;
  opm?: string;
  status: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

export default function OcorrenciasPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [filteredOcorrencias, setFilteredOcorrencias] = useState<Ocorrencia[]>([]);
  const [selectedOcorrencias, setSelectedOcorrencias] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    loadOcorrencias();
  }, []);

  useEffect(() => {
    filterOcorrencias();
  }, [ocorrencias, searchTerm, filterStatus, filterTipo]);

  const loadOcorrencias = async () => {
    try {
      const data = await ocorrenciasApi.getAll();
      setOcorrencias(data);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOcorrencias = () => {
    let filtered = ocorrencias;

    if (searchTerm) {
      filtered = filtered.filter(ocorrencia =>
        ocorrencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ocorrencia.opm?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(ocorrencia => ocorrencia.status === filterStatus);
    }

    if (filterTipo) {
      filtered = filtered.filter(ocorrencia => ocorrencia.tipo === filterTipo);
    }

    setFilteredOcorrencias(filtered);
  };

  const handleSelectOcorrencia = (id: string) => {
    setSelectedOcorrencias(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedOcorrencias.length === filteredOcorrencias.length) {
      setSelectedOcorrencias([]);
    } else {
      setSelectedOcorrencias(filteredOcorrencias.map(oc => oc.id));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ocorrência?')) {
      try {
        await ocorrenciasApi.delete(id);
        await loadOcorrencias();
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        alert('Erro ao excluir ocorrência');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOcorrencias.length === 0) {
      alert('Selecione pelo menos uma ocorrência para excluir');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir ${selectedOcorrencias.length} ocorrência(s)?`)) {
      try {
        await Promise.all(selectedOcorrencias.map(id => ocorrenciasApi.delete(id)));
        setSelectedOcorrencias([]);
        await loadOcorrencias();
      } catch (error) {
        console.error('Erro ao excluir ocorrências:', error);
        alert('Erro ao excluir ocorrências');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'resolvida':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'arquivada':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolvida':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'arquivada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const tiposOcorrencia = Array.from(new Set(ocorrencias.map(o => o.tipo)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ocorrências</h1>
              <p className="text-gray-600">
                Gerencie todas as ocorrências policiais
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/ocorrencias/nova')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nova Ocorrência
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{ocorrencias.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ocorrencias.filter(o => o.status === 'ativa').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ocorrencias.filter(o => o.status === 'resolvida').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Arquivadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ocorrencias.filter(o => o.status === 'arquivada').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tipo, endereço, bairro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="arquivada">Arquivada</option>
                <option value="resolvida">Resolvida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                {tiposOcorrencia.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSelectAll}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {selectedOcorrencias.length === filteredOcorrencias.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleBulkDelete}
                disabled={selectedOcorrencias.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 inline mr-2" />
                Excluir Selecionadas
              </button>
            </div>
          </div>
        </div>

        {/* Ocorrências Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Ocorrências</h2>
              <span className="text-sm text-gray-500">
                {filteredOcorrencias.length} ocorrência(s) encontrada(s)
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOcorrencias.length === filteredOcorrencias.length && filteredOcorrencias.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    OPM
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOcorrencias.map((ocorrencia) => (
                  <tr
                    key={ocorrencia.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOcorrencias.includes(ocorrencia.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectOcorrencia(ocorrencia.id);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{formatDate(ocorrencia.data_hora_fato)}</div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(ocorrencia.data_hora_fato).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {ocorrencia.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div>{ocorrencia.endereco}</div>
                          {ocorrencia.bairro && (
                            <div className="text-gray-500 text-xs">
                              {ocorrencia.bairro}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ocorrencia.opm || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ocorrencia.status)}`}>
                        {getStatusIcon(ocorrencia.status)}
                        {ocorrencia.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/ocorrencias/${ocorrencia.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/ocorrencias/${ocorrencia.id}/editar`)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ocorrencia.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
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
    </div>
  );
}