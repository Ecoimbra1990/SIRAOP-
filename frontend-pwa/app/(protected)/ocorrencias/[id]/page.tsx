'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ocorrenciasApi } from '@/lib/api';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Clock,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Building,
  Map
} from 'lucide-react';

interface Ocorrencia {
  id: string;
  tipo: string;
  data_hora_fato: string;
  endereco: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  opm?: string;
  status: string;
  descricao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  anexos_urls?: string[];
}

export default function OcorrenciaDetalhesPage() {
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const ocorrenciaId = params?.id as string;

  useEffect(() => {
    if (ocorrenciaId) {
      loadOcorrencia(ocorrenciaId);
    } else {
      setIsLoading(false);
    }
  }, [ocorrenciaId]);

  const loadOcorrencia = async (id: string) => {
    try {
      const data = await ocorrenciasApi.getById(id);
      setOcorrencia(data);
    } catch (error) {
      console.error('Erro ao carregar ocorrência:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!ocorrencia) return;
    
    if (confirm('Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita.')) {
      try {
        setIsDeleting(true);
        await ocorrenciasApi.delete(ocorrencia.id);
        router.push('/ocorrencias');
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error);
        alert('Erro ao excluir ocorrência');
      } finally {
        setIsDeleting(false);
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
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'resolvida':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'arquivada':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ocorrência não encontrada</p>
        <button 
          onClick={() => router.push('/ocorrencias')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Voltar para Ocorrências
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detalhes da Ocorrência
                </h1>
                <p className="text-gray-600">
                  ID: {ocorrencia.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/ocorrencias/${ocorrencia.id}/editar`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status e Tipo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Informações Gerais</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ocorrencia.status)}`}>
                  {getStatusIcon(ocorrencia.status)}
                  {ocorrencia.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Ocorrência
                  </label>
                  <p className="text-gray-900 font-medium">{ocorrencia.tipo}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OPM
                  </label>
                  <p className="text-gray-900">{ocorrencia.opm || 'Não informado'}</p>
                </div>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Data e Hora
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Fato
                  </label>
                  <p className="text-gray-900">{formatDate(ocorrencia.data_hora_fato)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora do Fato
                  </label>
                  <p className="text-gray-900">
                    {new Date(ocorrencia.data_hora_fato).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registrado em
                  </label>
                  <p className="text-gray-900">{formatDateTime(ocorrencia.created_at)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Última Atualização
                  </label>
                  <p className="text-gray-900">{formatDateTime(ocorrencia.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <p className="text-gray-900">{ocorrencia.endereco}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ocorrencia.bairro && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <p className="text-gray-900">{ocorrencia.bairro}</p>
                    </div>
                  )}
                  
                  {ocorrencia.cidade && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <p className="text-gray-900">{ocorrencia.cidade}</p>
                    </div>
                  )}
                  
                  {ocorrencia.estado && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <p className="text-gray-900">{ocorrencia.estado}</p>
                    </div>
                  )}
                </div>
                
                {(ocorrencia.latitude && ocorrencia.longitude) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <p className="text-gray-900">{ocorrencia.latitude}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <p className="text-gray-900">{ocorrencia.longitude}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            {(ocorrencia.descricao || ocorrencia.observacoes) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Descrição e Observações
                </h2>
                
                <div className="space-y-4">
                  {ocorrencia.descricao && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição do Fato
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">{ocorrencia.descricao}</p>
                    </div>
                  )}
                  
                  {ocorrencia.observacoes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações Adicionais
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">{ocorrencia.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/ocorrencias/${ocorrencia.id}/editar`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Editar Ocorrência
                </button>
                
                <button
                  onClick={() => {
                    // Implementar geração de PDF
                    alert('Funcionalidade de PDF será implementada');
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Gerar PDF
                </button>
                
                <button
                  onClick={() => {
                    // Implementar compartilhamento
                    alert('Funcionalidade de compartilhamento será implementada');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Map className="h-4 w-4" />
                  Ver no Mapa
                </button>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID da Ocorrência
                  </label>
                  <p className="text-sm text-gray-600 font-mono">{ocorrencia.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Criado em
                  </label>
                  <p className="text-sm text-gray-600">{formatDateTime(ocorrencia.created_at)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Atualizado em
                  </label>
                  <p className="text-sm text-gray-600">{formatDateTime(ocorrencia.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Anexos */}
            {ocorrencia.anexos_urls && ocorrencia.anexos_urls.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anexos</h3>
                
                <div className="space-y-2">
                  {ocorrencia.anexos_urls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Anexo {index + 1}</span>
                      </div>
                      <button
                        onClick={() => window.open(url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}