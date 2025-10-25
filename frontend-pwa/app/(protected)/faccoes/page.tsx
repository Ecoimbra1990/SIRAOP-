'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { faccoesApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Building2,
  Users,
  MapPin
} from 'lucide-react';

interface Faccao {
  id: string;
  nome: string;
  sigla?: string;
  descricao?: string;
  territorio_atuacao?: string;
  created_at: string;
}

export default function FaccoesPage() {
  const [faccoes, setFaccoes] = useState<Faccao[]>([]);
  const [filteredFaccoes, setFilteredFaccoes] = useState<Faccao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadFaccoes();
  }, []);

  useEffect(() => {
    filterFaccoes();
  }, [faccoes, searchTerm]);

  const loadFaccoes = async () => {
    try {
      const data = await faccoesApi.getAll();
      setFaccoes(data);
    } catch (error) {
      console.error('Erro ao carregar facções:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFaccoes = () => {
    let filtered = faccoes;

    if (searchTerm) {
      filtered = filtered.filter(faccao =>
        faccao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faccao.sigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faccao.territorio_atuacao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaccoes(filtered);
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
            <h1 className="text-2xl font-bold text-gray-900">Facções</h1>
            <p className="text-gray-600">
              Gerencie todas as facções registradas
            </p>
          </div>
          <button
            onClick={() => router.push('/faccoes/nova')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Facção
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
                  placeholder="Nome, sigla, território..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Facções */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Todas as Facções</h2>
            <span className="text-sm text-gray-500">
              {filteredFaccoes.length} facção(ões) encontrada(s)
            </span>
          </div>
        </div>
        
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Sigla
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Território
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Registrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFaccoes.map((faccao) => (
                  <tr
                    key={faccao.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/faccoes/${faccao.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {faccao.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {faccao.sigla || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {faccao.descricao || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {faccao.territorio_atuacao ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {faccao.territorio_atuacao}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(faccao.created_at)}
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
