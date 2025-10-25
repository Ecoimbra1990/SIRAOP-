'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pessoasApi } from '@/lib/api';
import { ArrowLeft, Save, User, Phone, MapPin } from 'lucide-react';

const pessoaSchema = z.object({
  nome_completo: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 dígitos'),
  rg: z.string().optional(),
  data_nascimento: z.string().optional(),
  nome_pai: z.string().optional(),
  nome_mae: z.string().optional(),
  sexo: z.string().optional(),
  cor: z.string().optional(),
  profissao: z.string().optional(),
  apelidos: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  observacoes: z.string().optional(),
});

type PessoaForm = z.infer<typeof pessoaSchema>;

export default function NovaPessoaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PessoaForm>({
    resolver: zodResolver(pessoaSchema),
  });

  const onSubmit = async (data: PessoaForm) => {
    try {
      setIsLoading(true);
      setError('');
      
      await pessoasApi.create(data);
      router.push('/pessoas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar pessoa');
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
          <h1 className="text-2xl font-bold text-gray-900">Nova Pessoa</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  {...register('nome_completo')}
                  type="text"
                  className="input"
                  placeholder="Nome completo da pessoa"
                />
                {errors.nome_completo && (
                  <p className="mt-1 text-sm text-red-600">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    {...register('cpf')}
                    type="text"
                    className="input"
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RG
                  </label>
                  <input
                    {...register('rg')}
                    type="text"
                    className="input"
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    {...register('data_nascimento')}
                    type="date"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo
                  </label>
                  <select {...register('sexo')} className="input">
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor/Raça
                </label>
                <select {...register('cor')} className="input">
                  <option value="">Selecione</option>
                  <option value="Branca">Branca</option>
                  <option value="Parda">Parda</option>
                  <option value="Negra">Negra</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <input
                  {...register('profissao')}
                  type="text"
                  className="input"
                  placeholder="Profissão da pessoa"
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contato
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  {...register('telefone')}
                  type="tel"
                  className="input"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="input"
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  {...register('endereco')}
                  type="text"
                  className="input"
                  placeholder="Rua, número, complemento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apelidos
                </label>
                <input
                  {...register('apelidos')}
                  type="text"
                  className="input"
                  placeholder="Apelidos conhecidos (separados por vírgula)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informações Familiares */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Informações Familiares</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Pai
                </label>
                <input
                  {...register('nome_pai')}
                  type="text"
                  className="input"
                  placeholder="Nome completo do pai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Mãe
                </label>
                <input
                  {...register('nome_mae')}
                  type="text"
                  className="input"
                  placeholder="Nome completo da mãe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Observações</h2>
          </div>
          <div className="card-content">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Adicionais
              </label>
              <textarea
                {...register('observacoes')}
                rows={4}
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
            {isLoading ? 'Salvando...' : 'Salvar Pessoa'}
          </button>
        </div>
      </form>
    </div>
  );
}
