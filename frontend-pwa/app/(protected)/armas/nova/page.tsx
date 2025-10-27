'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { armasApi } from '@/lib/api';
import { ArrowLeft, Save, Shield, Hash } from 'lucide-react';

const armaSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  numero_serie: z.string().optional(),
  calibre: z.string().optional(),
  origem: z.string().optional(),
  status: z.string().optional(),
  observacoes: z.string().optional(),
});

type ArmaForm = z.infer<typeof armaSchema>;

export default function NovaArmaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArmaForm>({
    resolver: zodResolver(armaSchema),
  });

  const onSubmit = async (data: ArmaForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      await armasApi.create(data);
      router.push('/armas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar arma');
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
          <h1 className="text-2xl font-bold text-gray-900">Nova Arma</h1>
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
                <Shield className="h-5 w-5" />
                Informações Básicas
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Arma *
                </label>
                <select
                  {...register('tipo')}
                  className="input"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Pistola">Pistola</option>
                  <option value="Revólver">Revólver</option>
                  <option value="Fuzil">Fuzil</option>
                  <option value="Espingarda">Espingarda</option>
                  <option value="Metralhadora">Metralhadora</option>
                  <option value="Submetralhadora">Submetralhadora</option>
                  <option value="Carabina">Carabina</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
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
                  placeholder="Ex: Glock 17"
                />
                {errors.modelo && (
                  <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Série
                </label>
                <input
                  {...register('numero_serie')}
                  type="text"
                  className="input"
                  placeholder="Número de série da arma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calibre
                </label>
                <select
                  {...register('calibre')}
                  className="input"
                >
                  <option value="">Selecione o calibre</option>
                  <option value="9mm">9mm</option>
                  <option value=".40">.40</option>
                  <option value=".45">.45</option>
                  <option value=".38">.38</option>
                  <option value=".357">.357</option>
                  <option value=".44">.44</option>
                  <option value=".50">.50</option>
                  <option value="5.56mm">5.56mm</option>
                  <option value="7.62mm">7.62mm</option>
                  <option value="12 gauge">12 gauge</option>
                  <option value="20 gauge">20 gauge</option>
                  <option value=".22">.22</option>
                  <option value=".380">.380</option>
                  <option value=".32">.32</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Informações Adicionais
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origem
                </label>
                <select {...register('origem')} className="input">
                  <option value="">Selecione a origem</option>
                  <option value="Apreendida">Apreendida</option>
                  <option value="Recuperada">Recuperada</option>
                  <option value="Abandonada">Abandonada</option>
                  <option value="Achada">Achada</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select {...register('status')} className="input">
                  <option value="">Selecione o status</option>
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                  <option value="Destruída">Destruída</option>
                  <option value="Perdida">Perdida</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  {...register('observacoes')}
                  rows={4}
                  className="input"
                  placeholder="Informações adicionais sobre a arma..."
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
            {isLoading ? 'Salvando...' : 'Salvar Arma'}
          </button>
        </div>
      </form>
    </div>
  );
}
