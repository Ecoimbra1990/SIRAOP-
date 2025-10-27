'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ocorrenciasApi } from '@/lib/api';
import { 
  Save, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock,
  FileText,
  Upload,
  X
} from 'lucide-react';

const ocorrenciaSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  data_hora_fato: z.string().min(1, 'Data e hora são obrigatórias'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  opm: z.string().optional(),
  status: z.enum(['ativa', 'resolvida', 'arquivada']).default('ativa'),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
});

type OcorrenciaForm = z.infer<typeof ocorrenciaSchema>;

export default function NovaOcorrenciaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ocorrenciaId, setOcorrenciaId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const router = useRouter();
  const params = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<OcorrenciaForm>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: {
      status: 'ativa',
    }
  });

  useEffect(() => {
    // Verificar se é edição
    if (params?.id && params.id !== 'nova') {
      setIsEditing(true);
      setOcorrenciaId(params.id as string);
      loadOcorrencia(params.id as string);
    }
  }, [params]);

  const loadOcorrencia = async (id: string) => {
    try {
      const ocorrencia = await ocorrenciasApi.getById(id);
      reset({
        tipo: ocorrencia.tipo,
        data_hora_fato: ocorrencia.data_hora_fato,
        endereco: ocorrencia.endereco,
        bairro: ocorrencia.bairro,
        cidade: ocorrencia.cidade,
        estado: ocorrencia.estado,
        cep: ocorrencia.cep,
        latitude: ocorrencia.latitude,
        longitude: ocorrencia.longitude,
        opm: ocorrencia.opm,
        status: ocorrencia.status,
        descricao: ocorrencia.descricao,
        observacoes: ocorrencia.observacoes,
      });
    } catch (error) {
      console.error('Erro ao carregar ocorrência:', error);
    }
  };

  const onSubmit = async (data: OcorrenciaForm) => {
    try {
      setIsLoading(true);
      
      if (isEditing && ocorrenciaId) {
        await ocorrenciasApi.update(ocorrenciaId, data);
      } else {
        await ocorrenciasApi.create(data);
      }
      
      router.push('/ocorrencias');
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
      alert('Erro ao salvar ocorrência');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const tiposOcorrencia = [
    'Roubo',
    'Furto',
    'Tráfico de Drogas',
    'Homicídio',
    'Tentativa de Homicídio',
    'Lesão Corporal',
    'Ameaça',
    'Estupro',
    'Violência Doméstica',
    'Porte Ilegal de Arma',
    'Apreensão de Drogas',
    'Apreensão de Arma',
    'Vandalismo',
    'Perturbação da Ordem',
    'Desacato',
    'Resistência',
    'Outros'
  ];

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
                  {isEditing ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Atualize os dados da ocorrência' : 'Registre uma nova ocorrência policial'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ocorrência *
                </label>
                <select
                  {...register('tipo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o tipo</option>
                  {tiposOcorrencia.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipo && (
                  <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ativa">Ativa</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="arquivada">Arquivada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OPM
                </label>
                <input
                  {...register('opm')}
                  type="text"
                  placeholder="Organização Policial Militar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  {...register('endereco')}
                  type="text"
                  placeholder="Rua, número, complemento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.endereco && (
                  <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input
                    {...register('bairro')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    {...register('cidade')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    {...register('estado')}
                    type="text"
                    placeholder="BA"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    {...register('cep')}
                    type="text"
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    {...register('latitude', { valueAsNumber: true })}
                    type="number"
                    step="any"
                    placeholder="-12.9716"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    {...register('longitude', { valueAsNumber: true })}
                    type="number"
                    step="any"
                    placeholder="-38.5018"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Descrição e Observações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Descrição e Observações
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Fato
                </label>
                <textarea
                  {...register('descricao')}
                  rows={4}
                  placeholder="Descreva detalhadamente o que aconteceu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  {...register('observacoes')}
                  rows={3}
                  placeholder="Observações importantes, informações complementares..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Anexos
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Arquivos
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Formatos aceitos: JPG, PNG, PDF, DOC, DOCX
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Arquivos Selecionados ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}