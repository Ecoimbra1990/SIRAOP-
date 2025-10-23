'use client';

import { useState } from 'react';

// Desabilitar prerendering para esta página
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ocorrenciasApi } from '@/lib/api';
import SimpleMapPicker from '@/components/SimpleMapPicker';
import { ArrowLeft, Save, MapPin } from 'lucide-react';

const ocorrenciaSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  data_hora_fato: z.string().min(1, 'Data e hora do fato são obrigatórias'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  opm: z.string().optional(),
  numero_bo: z.string().optional(),
  delegacia: z.string().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
});

type OcorrenciaForm = z.infer<typeof ocorrenciaSchema>;

export default function NovaOcorrenciaPage() {
  const [latitude, setLatitude] = useState<number>(-12.9714);
  const [longitude, setLongitude] = useState<number>(-38.5014);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OcorrenciaForm>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: {
      status: 'ativa',
      cidade: 'Salvador',
      estado: 'BA',
    },
  });

  const onSubmit = async (data: OcorrenciaForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      const ocorrenciaData = {
        ...data,
        latitude,
        longitude,
      };
      
      await ocorrenciasApi.create(ocorrenciaData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar ocorrência');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nova Ocorrência</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Informações Básicas</h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ocorrência *
                </label>
                <select
                  {...register('tipo')}
                  className="input"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Homicídio">Homicídio</option>
                  <option value="Roubo">Roubo</option>
                  <option value="Furto">Furto</option>
                  <option value="Tráfico">Tráfico de Drogas</option>
                  <option value="Assalto">Assalto</option>
                  <option value="Vandalismo">Vandalismo</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora do Fato *
                </label>
                <input
                  {...register('data_hora_fato')}
                  type="datetime-local"
                  className="input"
                />
                {errors.data_hora_fato && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_hora_fato.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  className="input"
                  placeholder="Descreva detalhadamente o que aconteceu..."
                />
                {errors.descricao && (
                  <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input"
                >
                  <option value="ativa">Ativa</option>
                  <option value="arquivada">Arquivada</option>
                  <option value="resolvida">Resolvida</option>
                </select>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  {...register('endereco')}
                  type="text"
                  className="input"
                  placeholder="Rua, número, complemento..."
                />
                {errors.endereco && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input
                    {...register('bairro')}
                    type="text"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    {...register('cep')}
                    type="text"
                    className="input"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    {...register('cidade')}
                    type="text"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    {...register('estado')}
                    type="text"
                    className="input"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Localização no Mapa</h2>
            <p className="text-sm text-gray-600">
              Clique no mapa para definir a localização exata da ocorrência
            </p>
          </div>
          <div className="card-content">
            <SimpleMapPicker
              latitude={latitude}
              longitude={longitude}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Informações Adicionais</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OPM (Órgão Policial Militar)
                </label>
                <input
                  {...register('opm')}
                  type="text"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do BO
                </label>
                <input
                  {...register('numero_bo')}
                  type="text"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delegacia
              </label>
              <input
                {...register('delegacia')}
                type="text"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                {...register('observacoes')}
                rows={3}
                className="input"
                placeholder="Informações adicionais relevantes..."
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar Ocorrência'}
          </button>
        </div>
      </form>
    </div>
  );
}
