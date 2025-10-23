'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ocorrenciasApi } from '@/lib/api';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Share2,
  Edit,
  Trash2
} from 'lucide-react';

interface Ocorrencia {
  id: string;
  tipo: string;
  data_hora_fato: string;
  descricao: string;
  endereco: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  opm?: string;
  numero_bo?: string;
  delegacia?: string;
  status: string;
  observacoes?: string;
  created_at: string;
}

export default function OcorrenciaDetailPage() {
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      loadOcorrencia();
    }
  }, [id]);

  const loadOcorrencia = async () => {
    try {
      const data = await ocorrenciasApi.getById(id);
      setOcorrencia(data);
    } catch (err: any) {
      setError('Erro ao carregar ocorrência');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && ocorrencia) {
      navigator.share({
        title: `Ocorrência - ${ocorrencia.tipo}`,
        text: `Ocorrência registrada em ${new Date(ocorrencia.data_hora_fato).toLocaleDateString('pt-BR')}`,
        url: window.location.href,
      });
    } else {
      // Fallback para WhatsApp
      const text = `Ocorrência - ${ocorrencia?.tipo}\nData: ${new Date(ocorrencia?.data_hora_fato || '').toLocaleDateString('pt-BR')}\nEndereço: ${ocorrencia?.endereco}\n\nVer detalhes: ${window.location.href}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !ocorrencia) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600 mb-4">{error || 'Ocorrência não encontrada'}</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn-outline flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes da Ocorrência</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>
            <button
              onClick={() => router.push(`/ocorrencias/${id}/editar`)}
              className="btn-outline flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="card-title">{ocorrencia.tipo}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  ocorrencia.status === 'ativa' 
                    ? 'bg-red-100 text-red-800'
                    : ocorrencia.status === 'resolvida'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ocorrencia.status}
                </span>
              </div>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data do Fato</p>
                    <p className="text-sm text-gray-600">{formatDate(ocorrencia.data_hora_fato)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horário</p>
                    <p className="text-sm text-gray-600">
                      {new Date(ocorrencia.data_hora_fato).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Descrição</p>
                <p className="text-sm text-gray-600">{ocorrencia.descricao}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Endereço</p>
                <p className="text-sm text-gray-600">{ocorrencia.endereco}</p>
              </div>

              {(ocorrencia.bairro || ocorrencia.cidade || ocorrencia.estado) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ocorrencia.bairro && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bairro</p>
                      <p className="text-sm text-gray-600">{ocorrencia.bairro}</p>
                    </div>
                  )}
                  {ocorrencia.cidade && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cidade</p>
                      <p className="text-sm text-gray-600">{ocorrencia.cidade}</p>
                    </div>
                  )}
                  {ocorrencia.estado && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Estado</p>
                      <p className="text-sm text-gray-600">{ocorrencia.estado}</p>
                    </div>
                  )}
                </div>
              )}

              {ocorrencia.latitude && ocorrencia.longitude && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Coordenadas</p>
                  <p className="text-sm text-gray-600">
                    {ocorrencia.latitude.toFixed(6)}, {ocorrencia.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {ocorrencia.observacoes && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Observações</h2>
              </div>
              <div className="card-content">
                <p className="text-sm text-gray-600">{ocorrencia.observacoes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Informações Policiais</h2>
            </div>
            <div className="card-content space-y-4">
              {ocorrencia.opm && (
                <div>
                  <p className="text-sm font-medium text-gray-900">OPM</p>
                  <p className="text-sm text-gray-600">{ocorrencia.opm}</p>
                </div>
              )}
              
              {ocorrencia.numero_bo && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Número do BO</p>
                  <p className="text-sm text-gray-600">{ocorrencia.numero_bo}</p>
                </div>
              )}
              
              {ocorrencia.delegacia && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Delegacia</p>
                  <p className="text-sm text-gray-600">{ocorrencia.delegacia}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Metadados</h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">ID da Ocorrência</p>
                <p className="text-sm text-gray-600 font-mono">{ocorrencia.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900">Criado em</p>
                <p className="text-sm text-gray-600">{formatDateTime(ocorrencia.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
