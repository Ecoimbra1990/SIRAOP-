'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ocorrenciasApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin,
  Calendar,
  Clock
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
}

export default function OcorrenciasPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [filteredOcorrencias, setFilteredOcorrencias] = useState<Ocorrencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadOcorrencias();
  }, []);

  useEffect(() => {
    filterOcorrencias();
  }, [ocorrencias, searchTerm, filterStatus]);

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
        ocorrencia.bairro?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(ocorrencia => ocorrencia.status === filterStatus);
    }

    setFilteredOcorrencias(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
            <h1 className="text-2xl font-bold text-gray-900">Ocorrências</h1>
            <p className="text-gray-600">
              Gerencie todas as ocorrências registradas
            </p>
          </div>
          <button
            onClick={() => router.push('/ocorrencias/nova')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Ocorrência
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="input pl-10"
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
                className="input"
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="arquivada">Arquivada</option>
                <option value="resolvida">Resolvida</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Ocorrências */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Todas as Ocorrências</h2>
            <span className="text-sm text-gray-500">
              {filteredOcorrencias.length} ocorrência(s) encontrada(s)
            </span>
          </div>
        </div>
        
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Data/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Endereço
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    OPM
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Lançado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOcorrencias.map((ocorrencia) => (
                  <tr
                    key={ocorrencia.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/ocorrencias/${ocorrencia.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(ocorrencia.data_hora_fato)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(ocorrencia.data_hora_fato).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {ocorrencia.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {ocorrencia.endereco}
                      </div>
                      {ocorrencia.bairro && (
                        <div className="text-gray-500 text-xs">
                          {ocorrencia.bairro}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {ocorrencia.opm || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ocorrencia.status === 'ativa' 
                          ? 'bg-red-100 text-red-800'
                          : ocorrencia.status === 'resolvida'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ocorrencia.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(ocorrencia.created_at)}
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
