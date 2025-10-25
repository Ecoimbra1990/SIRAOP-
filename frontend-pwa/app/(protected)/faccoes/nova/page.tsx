'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { faccoesApi } from '@/lib/api';
import { ArrowLeft, Save, Building2, MapPin } from 'lucide-react';

const faccaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sigla: z.string().optional(),
  descricao: z.string().optional(),
  territorio_atuacao: z.string().optional(),
  observacoes: z.string().optional(),
});

type FaccaoForm = z.infer<typeof faccaoSchema>;

export default function NovaFaccaoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FaccaoForm>({
    resolver: zodResolver(faccaoSchema),
  });

  const onSubmit = async (data: FaccaoForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      await faccoesApi.create(data);
      router.push('/faccoes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar facção');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Nova Facção</h1>
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
              <h2 className="card-title flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Facção *
                </label>
                <input
                  {...register('nome')}
                  type="text"
                  className="input"
                  placeholder="Nome da facção criminosa"
                />
                {errors.nome && (
                  <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sigla
                </label>
                <input
                  {...register('sigla')}
                  type="text"
                  className="input"
                  placeholder="Sigla da facção"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  className="input"
                  placeholder="Descrição da facção, características, histórico..."
                />
              </div>
            </div>
          </div>

          {/* Informações de Território */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Território de Atuação
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Território de Atuação
                </label>
                <input
                  {...register('territorio_atuacao')}
                  type="text"
                  className="input"
                  placeholder="Bairros, cidades, regiões de atuação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  {...register('observacoes')}
                  rows={4}
                  className="input"
                  placeholder="Informações adicionais sobre a facção..."
                />
              </div>
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
            {isLoading ? 'Salvando...' : 'Salvar Facção'}
          </button>
        </div>
      </form>
    </div>
  );
}
