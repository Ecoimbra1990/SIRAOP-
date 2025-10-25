'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pessoasApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  User,
  Phone,
  MapPin
} from 'lucide-react';

interface Pessoa {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  sexo: string;
  telefone?: string;
  endereco?: string;
  created_at: string;
}

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [filteredPessoas, setFilteredPessoas] = useState<Pessoa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadPessoas();
  }, []);

  useEffect(() => {
    filterPessoas();
  }, [pessoas, searchTerm]);

  const loadPessoas = async () => {
    try {
      const data = await pessoasApi.getAll();
      setPessoas(data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPessoas = () => {
    let filtered = pessoas;

    if (searchTerm) {
      filtered = filtered.filter(pessoa =>
        pessoa.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa.cpf.includes(searchTerm) ||
        pessoa.telefone?.includes(searchTerm)
      );
    }

    setFilteredPessoas(filtered);
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
            <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
            <p className="text-gray-600">
              Gerencie todas as pessoas registradas
            </p>
          </div>
          <button
            onClick={() => router.push('/pessoas/nova')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Pessoa
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
                  placeholder="Nome, CPF, telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pessoas */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Todas as Pessoas</h2>
            <span className="text-sm text-gray-500">
              {filteredPessoas.length} pessoa(s) encontrada(s)
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
                    CPF
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Data Nascimento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Sexo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Registrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPessoas.map((pessoa) => (
                  <tr
                    key={pessoa.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/pessoas/${pessoa.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {pessoa.nome_completo}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pessoa.cpf}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pessoa.data_nascimento ? formatDate(pessoa.data_nascimento) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pessoa.sexo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pessoa.telefone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {pessoa.telefone}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(pessoa.created_at)}
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
