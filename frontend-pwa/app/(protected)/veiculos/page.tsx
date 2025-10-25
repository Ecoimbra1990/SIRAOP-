'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { veiculosApi } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Car,
  Calendar,
  MapPin
} from 'lucide-react';

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  cor: string;
  ano?: number;
  chassi?: string;
  renavam?: string;
  created_at: string;
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadVeiculos();
  }, []);

  useEffect(() => {
    filterVeiculos();
  }, [veiculos, searchTerm]);

  const loadVeiculos = async () => {
    try {
      const data = await veiculosApi.getAll();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVeiculos = () => {
    let filtered = veiculos;

    if (searchTerm) {
      filtered = filtered.filter(veiculo =>
        veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.cor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVeiculos(filtered);
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
            <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
            <p className="text-gray-600">
              Gerencie todos os veículos registrados
            </p>
          </div>
          <button
            onClick={() => router.push('/veiculos/novo')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Veículo
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
                  placeholder="Placa, modelo, marca, cor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Veículos */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Todos os Veículos</h2>
            <span className="text-sm text-gray-500">
              {filteredVeiculos.length} veículo(s) encontrado(s)
            </span>
          </div>
        </div>
        
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Placa
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Marca
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Cor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Ano
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Registrado em
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVeiculos.map((veiculo) => (
                  <tr
                    key={veiculo.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/veiculos/${veiculo.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        {veiculo.placa}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {veiculo.modelo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {veiculo.marca}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {veiculo.cor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {veiculo.ano || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(veiculo.created_at)}
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
