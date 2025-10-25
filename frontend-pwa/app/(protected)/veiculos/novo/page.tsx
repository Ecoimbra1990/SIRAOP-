'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { veiculosApi } from '@/lib/api';
import { ArrowLeft, Save, Car, Hash } from 'lucide-react';

const veiculoSchema = z.object({
  placa: z.string().min(7, 'Placa deve ter pelo menos 7 caracteres'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  cor: z.string().min(1, 'Cor é obrigatória'),
  ano: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  chassi: z.string().optional(),
  renavam: z.string().optional(),
  observacoes: z.string().optional(),
});

type VeiculoForm = z.infer<typeof veiculoSchema>;

export default function NovoVeiculoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VeiculoForm>({
    resolver: zodResolver(veiculoSchema),
  });

  const onSubmit = async (data: VeiculoForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      await veiculosApi.create(data);
      router.push('/veiculos');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar veículo');
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
          <h1 className="text-2xl font-bold text-gray-900">Novo Veículo</h1>
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
                <Car className="h-5 w-5" />
                Informações Básicas
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa *
                </label>
                <input
                  {...register('placa')}
                  type="text"
                  className="input"
                  placeholder="ABC-1234"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.placa && (
                  <p className="mt-1 text-sm text-red-600">{errors.placa.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    {...register('marca')}
                    type="text"
                    className="input"
                    placeholder="Ex: Toyota"
                  />
                  {errors.marca && (
                    <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    {...register('modelo')}
                    type="text"
                    className="input"
                    placeholder="Ex: Corolla"
                  />
                  {errors.modelo && (
                    <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor *
                  </label>
                  <input
                    {...register('cor')}
                    type="text"
                    className="input"
                    placeholder="Ex: Branco"
                  />
                  {errors.cor && (
                    <p className="mt-1 text-sm text-red-600">{errors.cor.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano
                  </label>
                  <input
                    {...register('ano', { valueAsNumber: true })}
                    type="number"
                    className="input"
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.ano && (
                    <p className="mt-1 text-sm text-red-600">{errors.ano.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Informações Técnicas
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chassi
                </label>
                <input
                  {...register('chassi')}
                  type="text"
                  className="input"
                  placeholder="Número do chassi (17 dígitos)"
                  maxLength={17}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RENAVAM
                </label>
                <input
                  {...register('renavam')}
                  type="text"
                  className="input"
                  placeholder="Número do RENAVAM"
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
                  placeholder="Informações adicionais sobre o veículo..."
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
            {isLoading ? 'Salvando...' : 'Salvar Veículo'}
          </button>
        </div>
      </form>
    </div>
  );
}
