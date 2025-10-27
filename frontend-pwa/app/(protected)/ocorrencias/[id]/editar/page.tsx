'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ocorrenciasApi } from '@/lib/api';
import { ArrowLeft, Save, MapPin, Calendar, FileText, AlertTriangle } from 'lucide-react';

const ocorrenciaSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  data_hora_fato: z.string().min(1, 'Data e hora são obrigatórios'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  opm: z.string().optional(),
  status: z.enum(['ativa', 'resolvida', 'arquivada']),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
});

type OcorrenciaForm = z.infer<typeof ocorrenciaSchema>;

interface Ocorrencia extends OcorrenciaForm {
  id: string;
  created_at: string;
  updated_at: string;
}

export default function EditarOcorrenciaPage() {
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<OcorrenciaForm>({
    resolver: zodResolver(ocorrenciaSchema),
  });
  
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
      
      // Preencher o formulário com os dados existentes
      setValue('tipo', data.tipo);
      setValue('data_hora_fato', new Date(data.data_hora_fato).toISOString().slice(0, 16));
      setValue('endereco', data.endereco);
      setValue('bairro', data.bairro || '');
      setValue('cidade', data.cidade || '');
      setValue('estado', data.estado || '');
      setValue('cep', data.cep || '');
      setValue('latitude', data.latitude || 0);
      setValue('longitude', data.longitude || 0);
      setValue('opm', data.opm || '');
      setValue('status', data.status);
      setValue('descricao', data.descricao || '');
      setValue('observacoes', data.observacoes || '');
    } catch (error) {
      console.error('Erro ao carregar ocorrência:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: OcorrenciaForm) => {
    if (!ocorrencia) return;
    
    try {
      setIsSaving(true);
      await ocorrenciasApi.update(ocorrencia.id, data);
      router.push(`/ocorrencias/${ocorrencia.id}`);
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      alert('Erro ao atualizar ocorrência');
    } finally {
      setIsSaving(false);
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
                  Editar Ocorrência
                </h1>
                <p className="text-gray-600">
                  ID: {ocorrencia.id}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ocorrência *
                </label>
                <input
                  {...register('tipo')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Roubo, Furto, Homicídio..."
                />
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ativa">Ativa</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="arquivada">Arquivada</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="data_hora_fato" className="block text-sm font-medium text-gray-700 mb-2">
                  Data e Hora do Fato *
                </label>
                <input
                  {...register('data_hora_fato')}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.data_hora_fato && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_hora_fato.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="opm" className="block text-sm font-medium text-gray-700 mb-2">
                  OPM
                </label>
                <input
                  {...register('opm')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Órgão Policial Militar"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localização
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  {...register('endereco')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rua, número, complemento..."
                />
                {errors.endereco && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input
                    {...register('bairro')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    {...register('cidade')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    {...register('estado')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    {...register('cep')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="00000-000"
                  />
                </div>
                
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    {...register('latitude', { valueAsNumber: true })}
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: -23.5505"
                  />
                </div>
                
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    {...register('longitude', { valueAsNumber: true })}
                    type="number"
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: -46.6333"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Descrição e Observações
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Fato
                </label>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva detalhadamente o que aconteceu..."
                />
              </div>
              
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  {...register('observacoes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informações complementares, suspeitos, testemunhas..."
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}