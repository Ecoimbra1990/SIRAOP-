'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Database, 
  Users, 
  FileText, 
  Car, 
  Shield, 
  Building2,
  Map,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';

interface AdminStats {
  ocorrencias: number;
  pessoas: number;
  veiculos: number;
  armas: number;
  faccoes: number;
  usuarios: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    ocorrencias: 0,
    pessoas: 0,
    veiculos: 0,
    armas: 0,
    faccoes: 0,
    usuarios: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const router = useRouter();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Simular carregamento de estatísticas
      setStats({
        ocorrencias: 15,
        pessoas: 8,
        veiculos: 12,
        armas: 5,
        faccoes: 3,
        usuarios: 1
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adminModules = [
    {
      id: 'ocorrencias',
      name: 'Ocorrências',
      icon: FileText,
      count: stats.ocorrencias,
      color: 'bg-red-500',
      description: 'Gerenciar ocorrências policiais',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'pessoas',
      name: 'Pessoas',
      icon: Users,
      count: stats.pessoas,
      color: 'bg-blue-500',
      description: 'Gerenciar pessoas registradas',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'veiculos',
      name: 'Veículos',
      icon: Car,
      count: stats.veiculos,
      color: 'bg-green-500',
      description: 'Gerenciar veículos registrados',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'armas',
      name: 'Armas',
      icon: Shield,
      count: stats.armas,
      color: 'bg-orange-500',
      description: 'Gerenciar armas registradas',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'faccoes',
      name: 'Facções',
      icon: Building2,
      count: stats.faccoes,
      color: 'bg-purple-500',
      description: 'Gerenciar facções criminosas',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: 'dimensionamento',
      name: 'Dimensionamento',
      icon: Map,
      count: 602,
      color: 'bg-indigo-500',
      description: 'Gerenciar dimensionamento territorial',
      actions: ['view', 'import', 'export', 'edit']
    },
    {
      id: 'usuarios',
      name: 'Usuários',
      icon: Settings,
      count: stats.usuarios,
      color: 'bg-gray-500',
      description: 'Gerenciar usuários do sistema',
      actions: ['view', 'create', 'edit', 'delete']
    }
  ];

  const handleModuleAction = (moduleId: string, action: string) => {
    switch (action) {
      case 'view':
        router.push(`/${moduleId}`);
        break;
      case 'create':
        router.push(`/${moduleId}/nova`);
        break;
      case 'edit':
        router.push(`/${moduleId}/editar`);
        break;
      case 'delete':
        // Implementar modal de confirmação
        break;
    }
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Database className="h-8 w-8 text-primary-600" />
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie todos os dados do sistema SIRAOP
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn-outline flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(stats).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <Database className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocorrências Ativas</p>
                <p className="text-2xl font-bold text-red-600">{stats.ocorrencias}</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pessoas Registradas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pessoas}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Módulos Administrativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="card-title">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {module.count}
                  </span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleModuleAction(module.id, 'view')}
                    className="btn-outline text-xs flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </button>
                  <button
                    onClick={() => handleModuleAction(module.id, 'create')}
                    className="btn-primary text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Novo
                  </button>
                  <button
                    onClick={() => handleModuleAction(module.id, 'edit')}
                    className="btn-outline text-xs flex items-center justify-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleModuleAction(module.id, 'delete')}
                    className="btn-outline text-xs flex items-center justify-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => router.push('/ocorrencias/nova')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-content text-center">
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Nova Ocorrência</h3>
              <p className="text-sm text-gray-600">Registrar nova ocorrência</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/pessoas/nova')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-content text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Nova Pessoa</h3>
              <p className="text-sm text-gray-600">Cadastrar nova pessoa</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/veiculos/novo')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-content text-center">
              <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Novo Veículo</h3>
              <p className="text-sm text-gray-600">Cadastrar novo veículo</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/armas/nova')}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-content text-center">
              <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Nova Arma</h3>
              <p className="text-sm text-gray-600">Cadastrar nova arma</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
