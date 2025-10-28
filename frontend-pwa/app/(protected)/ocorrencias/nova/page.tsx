'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ocorrenciasApi, dimensionamentoApi, pessoasApi, armasApi, faccoesApi, veiculosApi } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';
import { 
  Save, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock,
  FileText,
  Upload,
  X,
  Users,
  Shield,
  Users2,
  Car,
  Plus,
  Search,
  Trash2
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
  risp: z.string().optional(),
  aisp: z.string().optional(),
  status: z.enum(['ativa', 'resolvida', 'arquivada']).default('ativa'),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  // Campos específicos para Informação Relevante
  fonte_informacao: z.string().optional(),
  nome_fonte: z.string().optional(),
  data_publicacao: z.string().optional(),
  link_materia: z.string().url().optional().or(z.literal('')),
  resumo_informacao: z.string().optional(),
  relevancia_seguranca: z.string().optional(),
  observacoes_informacao: z.string().optional(),
}).refine((data) => {
  // Se for "Informação Relevante", alguns campos são obrigatórios
  if (data.tipo === 'Informação Relevante') {
    return data.fonte_informacao && data.resumo_informacao && data.relevancia_seguranca;
  }
  return true;
}, {
  message: "Para 'Informação Relevante', os campos Fonte da Informação, Resumo da Informação e Relevância para Segurança Pública são obrigatórios",
  path: ["fonte_informacao"]
});

type OcorrenciaForm = z.infer<typeof ocorrenciaSchema>;

export default function NovaOcorrenciaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ocorrenciaId, setOcorrenciaId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dimensionamentoData, setDimensionamentoData] = useState<any[]>([]);
  const [opmOptions, setOpmOptions] = useState<string[]>([]);
  const [rispOptions, setRispOptions] = useState<string[]>([]);
  const [aispOptions, setAispOptions] = useState<string[]>([]);
  
  // Estados para opções filtradas (cascata)
  const [filteredAispOptions, setFilteredAispOptions] = useState<string[]>([]);
  const [filteredOpmOptions, setFilteredOpmOptions] = useState<string[]>([]);
  
  // Estados para entidades relacionadas
  const [pessoasRelacionadas, setPessoasRelacionadas] = useState<any[]>([]);
  const [armasRelacionadas, setArmasRelacionadas] = useState<any[]>([]);
  const [faccoesRelacionadas, setFaccoesRelacionadas] = useState<any[]>([]);
  const [veiculosRelacionados, setVeiculosRelacionados] = useState<any[]>([]);
  
  // Estados para busca e seleção
  const [pessoasDisponiveis, setPessoasDisponiveis] = useState<any[]>([]);
  const [armasDisponiveis, setArmasDisponiveis] = useState<any[]>([]);
  const [faccoesDisponiveis, setFaccoesDisponiveis] = useState<any[]>([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState<any[]>([]);
  
  // Estados para modais de busca
  const [showPessoasModal, setShowPessoasModal] = useState(false);
  const [showArmasModal, setShowArmasModal] = useState(false);
  const [showFaccoesModal, setShowFaccoesModal] = useState(false);
  const [showVeiculosModal, setShowVeiculosModal] = useState(false);
  
  // Estados para modais de cadastro rápido
  const [showCadastroPessoaModal, setShowCadastroPessoaModal] = useState(false);
  const [showCadastroArmaModal, setShowCadastroArmaModal] = useState(false);
  const [showCadastroVeiculoModal, setShowCadastroVeiculoModal] = useState(false);
  
  // Estados para formulários de cadastro rápido
  const [novaPessoa, setNovaPessoa] = useState({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    endereco: '',
    telefone: '',
    tipoEnvolvimento: '',
    ehFaccionada: false,
    faccaoId: '',
    observacoes: ''
  });
  
  const [novaArma, setNovaArma] = useState({
    modelo: '',
    numeroSerie: '',
    calibre: '',
    tipo: '',
    origem: '',
    observacoes: ''
  });
  
  
  const [novoVeiculo, setNovoVeiculo] = useState({
    modelo: '',
    marca: '',
    placa: '',
    cor: '',
    ano: '',
    chassi: '',
    observacoes: ''
  });
  
  const router = useRouter();
  const params = useParams();
  const { makeRequest } = useApi();
  const { isLoaded: isGoogleLoaded, error: googleError, initializeAutocomplete, onPlaceSelected, cleanup } = useGooglePlaces();

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
    // Carregar dados do dimensionamento
    loadDimensionamentoData();
    
    // Carregar dados das entidades relacionadas
    loadEntidadesDisponiveis();
    
    // Verificar se é edição
    if (params?.id && params.id !== 'nova') {
      setIsEditing(true);
      setOcorrenciaId(params.id as string);
      loadOcorrencia(params.id as string);
    }
  }, [params]);

  // Configurar Google Places Autocomplete quando carregado
  useEffect(() => {
    console.log('🔄 useEffect Google Places - isGoogleLoaded:', isGoogleLoaded);
    
    if (isGoogleLoaded) {
      console.log('🗺️ Google Maps carregado - configurando autocomplete');
      
      // Configurar callback para quando um lugar for selecionado
      onPlaceSelected((addressComponents) => {
        console.log('🏠 Endereço selecionado:', addressComponents);
        console.log('🔧 Tentando preencher campos...');
        
        // Preencher campos automaticamente
        console.log('📝 Preenchendo endereço:', addressComponents.endereco);
        setValue('endereco', addressComponents.endereco);
        
        console.log('📝 Preenchendo bairro:', addressComponents.bairro);
        setValue('bairro', addressComponents.bairro);
        
        console.log('📝 Preenchendo cidade:', addressComponents.cidade);
        setValue('cidade', addressComponents.cidade);
        
        console.log('📝 Preenchendo estado:', addressComponents.estado);
        setValue('estado', addressComponents.estado);
        
        console.log('📝 Preenchendo CEP:', addressComponents.cep);
        setValue('cep', addressComponents.cep);
        
        console.log('📝 Preenchendo latitude:', addressComponents.latitude);
        setValue('latitude', addressComponents.latitude);
        
        console.log('📝 Preenchendo longitude:', addressComponents.longitude);
        setValue('longitude', addressComponents.longitude);
        
        console.log('✅ Todos os campos foram preenchidos');
        
        // Verificar se os valores foram realmente definidos
        setTimeout(() => {
          console.log('🔍 Verificando valores após preenchimento:', {
            endereco: watch('endereco'),
            bairro: watch('bairro'),
            cidade: watch('cidade'),
            estado: watch('estado'),
            cep: watch('cep'),
            latitude: watch('latitude'),
            longitude: watch('longitude')
          });
        }, 100);
      });
    } else {
      console.log('⏳ Aguardando carregamento do Google Maps...');
    }

    // Cleanup quando componente desmontar
    return () => {
      console.log('🧹 Cleanup do Google Places');
      cleanup();
    };
  }, [isGoogleLoaded, onPlaceSelected, setValue, cleanup]);

  // Garantir que o autocomplete seja inicializado quando o Google Maps carregar
  useEffect(() => {
    if (isGoogleLoaded) {
      console.log('🔄 Google Maps carregado - tentando inicializar autocomplete novamente');
      // Aguardar um pouco para garantir que o componente está renderizado
      setTimeout(() => {
        const enderecoInput = document.querySelector('input[name="endereco"]') as HTMLInputElement;
        if (enderecoInput) {
          console.log('🔍 Input de endereço encontrado, inicializando autocomplete');
          initializeAutocomplete(enderecoInput);
        } else {
          console.log('❌ Input de endereço não encontrado');
        }
      }, 500);
    }
  }, [isGoogleLoaded, initializeAutocomplete]);

  // Função para filtrar AISP baseado na RISP selecionada
  const filterAispByRisp = (selectedRisp: string) => {
    if (!selectedRisp) {
      setFilteredAispOptions([]);
      return;
    }
    
    const filteredAisps = dimensionamentoData
      .filter(item => item.risp === selectedRisp)
      .map(item => item.aisp)
      .filter(Boolean);
    
    const uniqueAisps = Array.from(new Set(filteredAisps)) as string[];
    setFilteredAispOptions(uniqueAisps);
    
    console.log('🔍 AISPs filtradas por RISP:', selectedRisp, uniqueAisps);
  };

  // Função para filtrar OPM baseado na RISP e AISP selecionadas
  const filterOpmByRispAndAisp = (selectedRisp: string, selectedAisp: string) => {
    if (!selectedRisp || !selectedAisp) {
      setFilteredOpmOptions([]);
      return;
    }
    
    const filteredOpms = dimensionamentoData
      .filter(item => item.risp === selectedRisp && item.aisp === selectedAisp)
      .map(item => item.opm)
      .filter(Boolean);
    
    const uniqueOpms = Array.from(new Set(filteredOpms)) as string[];
    setFilteredOpmOptions(uniqueOpms);
    
    console.log('🔍 OPMs filtradas por RISP e AISP:', selectedRisp, selectedAisp, uniqueOpms);
  };

  const loadDimensionamentoData = async () => {
    try {
      console.log('📊 Carregando dados do dimensionamento...');
      const data = await makeRequest(() => dimensionamentoApi.getAll());
      
      console.log('✅ Dados do dimensionamento carregados:', data);
      setDimensionamentoData(data);
      
      // Extrair opções únicas
      const opms = Array.from(new Set(data.map((item: any) => item.opm).filter(Boolean))) as string[];
      const risps = Array.from(new Set(data.map((item: any) => item.risp).filter(Boolean))) as string[];
      const aisps = Array.from(new Set(data.map((item: any) => item.aisp).filter(Boolean))) as string[];
      
      setOpmOptions(opms);
      setRispOptions(risps);
      setAispOptions(aisps);
      
      console.log('📋 Opções extraídas:', { opms, risps, aisps });
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dimensionamento:', error);
      // Fallback para dados mock se a API falhar
      const mockData = [
        { opm: '26ª CIPM - Brotas', risp: 'Atlântico', aisp: '06 - Brotas' },
        { opm: '15ª CIPM - Itapuã', risp: 'Atlântico', aisp: '12 - Itapuã' },
        { opm: '1ª CIPM - Feira de Santana', risp: 'Centro', aisp: '01 - Centro' }
      ];
      setDimensionamentoData(mockData);
      setOpmOptions(mockData.map(item => item.opm));
      setRispOptions(mockData.map(item => item.risp));
      setAispOptions(mockData.map(item => item.aisp));
    }
  };

  const loadEntidadesDisponiveis = async () => {
    try {
      console.log('📋 Carregando entidades disponíveis...');
      
      // Carregar todas as entidades em paralelo
      const [pessoas, armas, faccoes, veiculos] = await Promise.all([
        makeRequest(() => pessoasApi.getAll()),
        makeRequest(() => armasApi.getAll()),
        makeRequest(() => faccoesApi.getAll()),
        makeRequest(() => veiculosApi.getAll())
      ]);
      
      setPessoasDisponiveis(pessoas);
      setArmasDisponiveis(armas);
      setFaccoesDisponiveis(faccoes);
      setVeiculosDisponiveis(veiculos);
      
      console.log('✅ Entidades carregadas:', { pessoas: pessoas.length, armas: armas.length, faccoes: faccoes.length, veiculos: veiculos.length });
    } catch (error) {
      console.error('❌ Erro ao carregar entidades:', error);
      // Fallback para dados mock
      setPessoasDisponiveis([]);
      setArmasDisponiveis([]);
      setFaccoesDisponiveis([]);
      setVeiculosDisponiveis([]);
    }
  };

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
        risp: ocorrencia.risp,
        aisp: ocorrencia.aisp,
        status: ocorrencia.status,
        descricao: ocorrencia.descricao,
        observacoes: ocorrencia.observacoes,
      });
    } catch (error) {
      console.error('Erro ao carregar ocorrência:', error);
    }
  };

  // Handler para mudança da RISP
  const handleRispChange = (selectedRisp: string) => {
    console.log('🔄 RISP selecionada:', selectedRisp);
    
    // Limpar AISP e OPM quando RISP muda
    setValue('aisp', '');
    setValue('opm', '');
    setFilteredAispOptions([]);
    setFilteredOpmOptions([]);
    
    // Filtrar AISPs baseado na RISP
    filterAispByRisp(selectedRisp);
  };

  // Handler para mudança da AISP
  const handleAispChange = (selectedAisp: string) => {
    console.log('🔄 AISP selecionada:', selectedAisp);
    
    // Limpar OPM quando AISP muda
    setValue('opm', '');
    setFilteredOpmOptions([]);
    
    // Filtrar OPMs baseado na RISP e AISP
    const selectedRisp = watch('risp');
    if (selectedRisp) {
      filterOpmByRispAndAisp(selectedRisp, selectedAisp);
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

  // Funções para gerenciar entidades relacionadas
  const adicionarPessoa = (pessoa: any) => {
    if (!pessoasRelacionadas.find(p => p.id === pessoa.id)) {
      setPessoasRelacionadas(prev => [...prev, pessoa]);
    }
    setShowPessoasModal(false);
  };

  const removerPessoa = (pessoaId: string) => {
    setPessoasRelacionadas(prev => prev.filter(p => p.id !== pessoaId));
  };

  const adicionarArma = (arma: any) => {
    if (!armasRelacionadas.find(a => a.id === arma.id)) {
      setArmasRelacionadas(prev => [...prev, arma]);
    }
    setShowArmasModal(false);
  };

  const removerArma = (armaId: string) => {
    setArmasRelacionadas(prev => prev.filter(a => a.id !== armaId));
  };

  const adicionarFaccao = (faccao: any) => {
    if (!faccoesRelacionadas.find(f => f.id === faccao.id)) {
      setFaccoesRelacionadas(prev => [...prev, faccao]);
    }
    setShowFaccoesModal(false);
  };

  const removerFaccao = (faccaoId: string) => {
    setFaccoesRelacionadas(prev => prev.filter(f => f.id !== faccaoId));
  };

  const adicionarVeiculo = (veiculo: any) => {
    if (!veiculosRelacionados.find(v => v.id === veiculo.id)) {
      setVeiculosRelacionados(prev => [...prev, veiculo]);
    }
    setShowVeiculosModal(false);
  };

  const removerVeiculo = (veiculoId: string) => {
    setVeiculosRelacionados(prev => prev.filter(v => v.id !== veiculoId));
  };

  // Funções para cadastro rápido de entidades
  const cadastrarPessoaRapida = async () => {
    try {
      setIsLoading(true);
      const pessoaCriada = await makeRequest(() => pessoasApi.create(novaPessoa));
      
      // Adicionar à lista de pessoas relacionadas
      setPessoasRelacionadas(prev => [...prev, pessoaCriada]);
      
      // Atualizar lista de pessoas disponíveis
      setPessoasDisponiveis(prev => [...prev, pessoaCriada]);
      
      // Limpar formulário e fechar modal
      setNovaPessoa({
        nome: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        endereco: '',
        telefone: '',
        tipoEnvolvimento: '',
        ehFaccionada: false,
        faccaoId: '',
        observacoes: ''
      });
      setShowCadastroPessoaModal(false);
      
      console.log('✅ Pessoa cadastrada com sucesso:', pessoaCriada);
    } catch (error) {
      console.error('❌ Erro ao cadastrar pessoa:', error);
      alert('Erro ao cadastrar pessoa');
    } finally {
      setIsLoading(false);
    }
  };

  const cadastrarArmaRapida = async () => {
    try {
      setIsLoading(true);
      const armaCriada = await makeRequest(() => armasApi.create(novaArma));
      
      // Adicionar à lista de armas relacionadas
      setArmasRelacionadas(prev => [...prev, armaCriada]);
      
      // Atualizar lista de armas disponíveis
      setArmasDisponiveis(prev => [...prev, armaCriada]);
      
      // Limpar formulário e fechar modal
      setNovaArma({
        modelo: '',
        numeroSerie: '',
        calibre: '',
        tipo: '',
        origem: '',
        observacoes: ''
      });
      setShowCadastroArmaModal(false);
      
      console.log('✅ Arma cadastrada com sucesso:', armaCriada);
    } catch (error) {
      console.error('❌ Erro ao cadastrar arma:', error);
      alert('Erro ao cadastrar arma');
    } finally {
      setIsLoading(false);
    }
  };


  const cadastrarVeiculoRapido = async () => {
    try {
      setIsLoading(true);
      const veiculoCriado = await makeRequest(() => veiculosApi.create(novoVeiculo));
      
      // Adicionar à lista de veículos relacionados
      setVeiculosRelacionados(prev => [...prev, veiculoCriado]);
      
      // Atualizar lista de veículos disponíveis
      setVeiculosDisponiveis(prev => [...prev, veiculoCriado]);
      
      // Limpar formulário e fechar modal
      setNovoVeiculo({
        modelo: '',
        marca: '',
        placa: '',
        cor: '',
        ano: '',
        chassi: '',
        observacoes: ''
      });
      setShowCadastroVeiculoModal(false);
      
      console.log('✅ Veículo cadastrado com sucesso:', veiculoCriado);
    } catch (error) {
      console.error('❌ Erro ao cadastrar veículo:', error);
      alert('Erro ao cadastrar veículo');
    } finally {
      setIsLoading(false);
    }
  };

  const tiposOcorrencia = [
    'Informação Relevante',
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
                <select
                  {...register('opm')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!watch('risp') || !watch('aisp')}
                >
                  <option value="">Selecione a OPM</option>
                  {filteredOpmOptions.map(opm => (
                    <option key={opm} value={opm}>{opm}</option>
                  ))}
                </select>
                {(!watch('risp') || !watch('aisp')) && (
                  <p className="mt-1 text-sm text-gray-500">
                    Selecione uma RISP e AISP primeiro
                  </p>
                )}
              </div>
            </div>

            {/* Campos RISP e AISP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RISP
                </label>
                <select
                  {...register('risp')}
                  onChange={(e) => {
                    register('risp').onChange(e);
                    handleRispChange(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a RISP</option>
                  {rispOptions.map(risp => (
                    <option key={risp} value={risp}>{risp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AISP
                </label>
                <select
                  {...register('aisp')}
                  onChange={(e) => {
                    register('aisp').onChange(e);
                    handleAispChange(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!watch('risp')}
                >
                  <option value="">Selecione a AISP</option>
                  {filteredAispOptions.map(aisp => (
                    <option key={aisp} value={aisp}>{aisp}</option>
                  ))}
                </select>
                {!watch('risp') && (
                  <p className="mt-1 text-sm text-gray-500">Selecione uma RISP primeiro</p>
                )}
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
                  ref={(e) => {
                    register('endereco').ref(e);
                    console.log('🔗 Ref do input endereço:', e, 'isGoogleLoaded:', isGoogleLoaded);
                    if (e && isGoogleLoaded) {
                      console.log('🚀 Inicializando autocomplete no input');
                      // Usar setTimeout para garantir que o elemento está totalmente renderizado
                      setTimeout(() => {
                        initializeAutocomplete(e);
                      }, 100);
                    }
                  }}
                  type="text"
                  placeholder="Digite o endereço (ex: Rua da Liberdade)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isGoogleLoaded && (
                  <p className="mt-1 text-sm text-green-600">
                    🗺️ Autocomplete ativo - digite para buscar endereços
                  </p>
                )}
                {!isGoogleLoaded && (
                  <p className="mt-1 text-sm text-yellow-600">
                    ⏳ Carregando Google Maps API...
                  </p>
                )}
                {googleError && (
                  <p className="mt-1 text-sm text-red-600">
                    ❌ Erro no Google Maps: {googleError}
                  </p>
                )}
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

          {/* Campos específicos para Informação Relevante */}
          {watch('tipo') === 'Informação Relevante' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Jornalísticas Relevantes
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fonte da Informação *
                    </label>
                    <select
                      {...register('fonte_informacao')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione a fonte</option>
                      <option value="jornal_impresso">Jornal Impresso</option>
                      <option value="jornal_online">Jornal Online</option>
                      <option value="televisao">Televisão</option>
                      <option value="radio">Rádio</option>
                      <option value="redes_sociais">Redes Sociais</option>
                      <option value="site_noticias">Site de Notícias</option>
                      <option value="denuncia_anonima">Denúncia Anônima</option>
                      <option value="informacao_interna">Informação Interna</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Fonte
                    </label>
                    <input
                      {...register('nome_fonte')}
                      type="text"
                      placeholder="Ex: Jornal A Tarde, TV Bahia..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data da Publicação/Informação
                    </label>
                    <input
                      {...register('data_publicacao')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link da Matéria/Informação
                    </label>
                    <input
                      {...register('link_materia')}
                      type="url"
                      placeholder="https://exemplo.com/materia"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resumo da Informação *
                  </label>
                  <textarea
                    {...register('resumo_informacao')}
                    rows={4}
                    placeholder="Resuma a informação jornalística relevante para segurança pública..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevância para Segurança Pública *
                  </label>
                  <select
                    {...register('relevancia_seguranca')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione a relevância</option>
                    <option value="alta">Alta - Requer ação imediata</option>
                    <option value="media">Média - Monitoramento necessário</option>
                    <option value="baixa">Baixa - Informação para conhecimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações Adicionais
                  </label>
                  <textarea
                    {...register('observacoes_informacao')}
                    rows={3}
                    placeholder="Observações específicas sobre a informação, contexto adicional..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

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

          {/* Entidades Relacionadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Entidades Relacionadas
            </h2>
            
            <div className="space-y-6">
              {/* Pessoas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Pessoas ({pessoasRelacionadas.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPessoasModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCadastroPessoaModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Novo
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pessoasRelacionadas.map(pessoa => (
                    <div key={pessoa.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{pessoa.nome}</p>
                        <p className="text-xs text-gray-500">{pessoa.cpf || pessoa.rg}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerPessoa(pessoa.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {pessoasRelacionadas.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhuma pessoa relacionada</p>
                  )}
                </div>
              </div>

              {/* Armas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Armas ({armasRelacionadas.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowArmasModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCadastroArmaModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Novo
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {armasRelacionadas.map(arma => (
                    <div key={arma.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{arma.modelo}</p>
                        <p className="text-xs text-gray-500">{arma.numeroSerie}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerArma(arma.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {armasRelacionadas.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhuma arma relacionada</p>
                  )}
                </div>
              </div>

              {/* Veículos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Veículos ({veiculosRelacionados.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVeiculosModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCadastroVeiculoModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Novo
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {veiculosRelacionados.map(veiculo => (
                    <div key={veiculo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{veiculo.modelo}</p>
                        <p className="text-xs text-gray-500">{veiculo.placa}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerVeiculo(veiculo.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {veiculosRelacionados.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhum veículo relacionado</p>
                  )}
                </div>
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

      {/* Modais de Cadastro Rápido */}
      
      {/* Modal Cadastro Pessoa */}
      {showCadastroPessoaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cadastrar Nova Pessoa
                </h3>
                <button
                  onClick={() => setShowCadastroPessoaModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={novaPessoa.nome}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={novaPessoa.cpf}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, cpf: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RG
                    </label>
                    <input
                      type="text"
                      value={novaPessoa.rg}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, rg: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o RG"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={novaPessoa.dataNascimento}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, dataNascimento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={novaPessoa.telefone}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, telefone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(71) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Envolvimento *
                    </label>
                    <select
                      value={novaPessoa.tipoEnvolvimento}
                      onChange={(e) => setNovaPessoa(prev => ({ ...prev, tipoEnvolvimento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="vitima">Vítima</option>
                      <option value="suspeito">Suspeito</option>
                      <option value="testemunha">Testemunha</option>
                      <option value="denunciante">Denunciante</option>
                      <option value="envolvido">Envolvido</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="ehFaccionada"
                        checked={novaPessoa.ehFaccionada}
                        onChange={(e) => setNovaPessoa(prev => ({ 
                          ...prev, 
                          ehFaccionada: e.target.checked,
                          faccaoId: e.target.checked ? prev.faccaoId : ''
                        }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="ehFaccionada" className="text-sm font-medium text-gray-700">
                        É faccionada?
                      </label>
                    </div>
                    
                    {novaPessoa.ehFaccionada && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facção *
                        </label>
                        <select
                          value={novaPessoa.faccaoId}
                          onChange={(e) => setNovaPessoa(prev => ({ ...prev, faccaoId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione a facção</option>
                          {faccoesDisponiveis.map(faccao => (
                            <option key={faccao.id} value={faccao.id}>
                              {faccao.nome} {faccao.sigla && `(${faccao.sigla})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={novaPessoa.endereco}
                    onChange={(e) => setNovaPessoa(prev => ({ ...prev, endereco: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o endereço completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={novaPessoa.observacoes}
                    onChange={(e) => setNovaPessoa(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações importantes sobre a pessoa"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCadastroPessoaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={cadastrarPessoaRapida}
                disabled={!novaPessoa.nome || !novaPessoa.tipoEnvolvimento || (novaPessoa.ehFaccionada && !novaPessoa.faccaoId) || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar e Relacionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro Arma */}
      {showCadastroArmaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Cadastrar Nova Arma
                </h3>
                <button
                  onClick={() => setShowCadastroArmaModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      value={novaArma.modelo}
                      onChange={(e) => setNovaArma(prev => ({ ...prev, modelo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Glock 17"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Série *
                    </label>
                    <input
                      type="text"
                      value={novaArma.numeroSerie}
                      onChange={(e) => setNovaArma(prev => ({ ...prev, numeroSerie: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o número de série"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calibre
                    </label>
                    <select
                      value={novaArma.calibre}
                      onChange={(e) => setNovaArma(prev => ({ ...prev, calibre: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o calibre</option>
                      <option value=".22">.22</option>
                      <option value=".25">.25</option>
                      <option value=".32">.32</option>
                      <option value=".38">.38</option>
                      <option value=".380">.380</option>
                      <option value=".40">.40</option>
                      <option value=".45">.45</option>
                      <option value="9mm">9mm</option>
                      <option value=".357">.357</option>
                      <option value=".44">.44</option>
                      <option value=".50">.50</option>
                      <option value="5.56mm">5.56mm</option>
                      <option value="7.62mm">7.62mm</option>
                      <option value="12 gauge">12 gauge</option>
                      <option value="20 gauge">20 gauge</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={novaArma.tipo}
                      onChange={(e) => setNovaArma(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="pistola">Pistola</option>
                      <option value="revólver">Revólver</option>
                      <option value="fuzil">Fuzil</option>
                      <option value="espingarda">Espingarda</option>
                      <option value="metralhadora">Metralhadora</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origem
                    </label>
                    <select
                      value={novaArma.origem}
                      onChange={(e) => setNovaArma(prev => ({ ...prev, origem: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione a origem</option>
                      <option value="Apreendida">Apreendida</option>
                      <option value="Encontrada">Encontrada</option>
                      <option value="Recuperada">Recuperada</option>
                      <option value="Abandonada">Abandonada</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Apreendida em Operação">Apreendida em Operação</option>
                      <option value="Apreendida em Busca">Apreendida em Busca</option>
                      <option value="Apreendida em Flagrante">Apreendida em Flagrante</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={novaArma.observacoes}
                    onChange={(e) => setNovaArma(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações importantes sobre a arma"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCadastroArmaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={cadastrarArmaRapida}
                disabled={!novaArma.modelo || !novaArma.numeroSerie || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar e Relacionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cadastro Veículo */}
      {showCadastroVeiculoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Cadastrar Novo Veículo
                </h3>
                <button
                  onClick={() => setShowCadastroVeiculoModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      value={novoVeiculo.modelo}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, modelo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Civic"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={novoVeiculo.marca}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, marca: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Honda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa *
                    </label>
                    <input
                      type="text"
                      value={novoVeiculo.placa}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, placa: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ABC-1234"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cor
                    </label>
                    <input
                      type="text"
                      value={novoVeiculo.cor}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, cor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Branco"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={novoVeiculo.ano}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, ano: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2020"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chassi
                    </label>
                    <input
                      type="text"
                      value={novoVeiculo.chassi}
                      onChange={(e) => setNovoVeiculo(prev => ({ ...prev, chassi: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o chassi"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={novoVeiculo.observacoes}
                    onChange={(e) => setNovoVeiculo(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações importantes sobre o veículo"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCadastroVeiculoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={cadastrarVeiculoRapido}
                disabled={!novoVeiculo.modelo || !novoVeiculo.marca || !novoVeiculo.placa || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar e Relacionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Seleção */}
      
      {/* Modal Pessoas */}
      {showPessoasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Selecionar Pessoa
                </h3>
                <button
                  onClick={() => setShowPessoasModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {pessoasDisponiveis.map(pessoa => (
                  <div
                    key={pessoa.id}
                    onClick={() => adicionarPessoa(pessoa)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{pessoa.nome}</p>
                        <p className="text-sm text-gray-500">{pessoa.cpf || pessoa.rg}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {pessoasDisponiveis.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhuma pessoa disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Armas */}
      {showArmasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Selecionar Arma
                </h3>
                <button
                  onClick={() => setShowArmasModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {armasDisponiveis.map(arma => (
                  <div
                    key={arma.id}
                    onClick={() => adicionarArma(arma)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{arma.modelo}</p>
                        <p className="text-sm text-gray-500">{arma.numeroSerie}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {armasDisponiveis.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhuma arma disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Facções */}
      {showFaccoesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Selecionar Facção
                </h3>
                <button
                  onClick={() => setShowFaccoesModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {faccoesDisponiveis.map(faccao => (
                  <div
                    key={faccao.id}
                    onClick={() => adicionarFaccao(faccao)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{faccao.nome}</p>
                        <p className="text-sm text-gray-500">{faccao.sigla}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {faccoesDisponiveis.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhuma facção disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Veículos */}
      {showVeiculosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Selecionar Veículo
                </h3>
                <button
                  onClick={() => setShowVeiculosModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {veiculosDisponiveis.map(veiculo => (
                  <div
                    key={veiculo.id}
                    onClick={() => adicionarVeiculo(veiculo)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{veiculo.modelo}</p>
                        <p className="text-sm text-gray-500">{veiculo.placa}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {veiculosDisponiveis.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Nenhum veículo disponível</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}