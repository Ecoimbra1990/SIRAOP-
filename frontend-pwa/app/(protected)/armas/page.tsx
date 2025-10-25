'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { armasApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Shield,
  Calendar,
  Hash
} from 'lucide-react';

interface Arma {
  id: string;
  tipo: string;
  modelo: string;
  numero_serie?: string;
  calibre?: string;
  origem?: string;
  status?: string;
  created_at: string;
}

export default function ArmasPage() {
  const [armas, setArmas] = useState<Arma[]>([]);
  const [filteredArmas, setFilteredArmas] = useState<Arma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadArmas();
  }, []);

  useEffect(() => {
    filterArmas();
  }, [armas, searchTerm]);

  const loadArmas = async () => {
    try {
      const data = await armasApi.getAll();
      setArmas(data);
    } catch (error) {
      console.error('Erro ao carregar armas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArmas = () => {
    let filtered = armas;

    if (searchTerm) {
      filtered = filtered.filter(arma =>
        arma.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arma.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arma.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arma.calibre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArmas(filtered);
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
            <h1 className="text-2xl font-bold text-gray-900">Armas</h1>
            <p className="text-gray-600">
              Gerencie todas as armas registradas
            </p>
          </div>
          <button
            onClick={() => router.push('/armas/nova')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Arma
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tipo, modelo, número de série, calibre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Armas */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Todas as Armas</h2>
            <span className="text-sm text-gray-500">
              {filteredArmas.length} arma(s) encontrada(s)
            </span>
          </div>
        </div>
        
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Número de Série
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Calibre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Origem
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Registrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArmas.map((arma) => (
                  <tr
                    key={arma.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/armas/${arma.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        {arma.tipo}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {arma.modelo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {arma.numero_serie ? (
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          {arma.numero_serie}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {arma.calibre || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {arma.origem || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {arma.status || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(arma.created_at)}
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
