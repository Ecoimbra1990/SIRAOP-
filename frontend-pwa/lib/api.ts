import axios from 'axios';
import { useUserStore } from '@/store/userStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://siraop-backend.fly.dev/api';

// Instância base do Axios com configurações otimizadas
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ignorar completamente erros de requisições abortadas
    if (error.code === 'ECONNABORTED' || 
        error.name === 'AxiosError' && error.message === 'Request aborted' ||
        error.name === 'AbortError') {
      // Não fazer nada - apenas rejeitar silenciosamente
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido - apenas fazer logout sem redirecionamento automático
      console.log('Token inválido detectado - fazendo logout silencioso');
      useUserStore.getState().logout();
      // NÃO fazer redirecionamento automático aqui - deixar o layout protegido lidar com isso
    }
    return Promise.reject(error);
  }
);

// Funções de API para autenticação
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Funções de API para ocorrências
export const ocorrenciasApi = {
  getAll: async () => {
    const response = await api.get('/ocorrencias');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/ocorrencias/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/ocorrencias', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/ocorrencias/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/ocorrencias/${id}`);
    return response.data;
  },
  
  findNearby: async (lat: number, lng: number, radius?: number) => {
    const response = await api.get('/ocorrencias/nearby', {
      params: { lat, lng, radius },
    });
    return response.data;
  },
};

// Funções de API para pessoas
export const pessoasApi = {
  getAll: async () => {
    const response = await api.get('/pessoas');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/pessoas/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/pessoas', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/pessoas/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/pessoas/${id}`);
    return response.data;
  },
  
  uploadFoto: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/pessoas/${id}/upload-foto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  addAreaAtuacao: async (id: string, areaData: any) => {
    const response = await api.post(`/pessoas/${id}/area-atuacao`, areaData);
    return response.data;
  },
};

// Funções de API para facções
export const faccoesApi = {
  getAll: async () => {
    const response = await api.get('/faccoes');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/faccoes/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/faccoes', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/faccoes/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/faccoes/${id}`);
    return response.data;
  },
};

// Funções de API para armas
export const armasApi = {
  getAll: async () => {
    const response = await api.get('/armas');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/armas/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/armas', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/armas/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/armas/${id}`);
    return response.data;
  },
  
  findByNumeroSerie: async (numeroSerie: string) => {
    const response = await api.get(`/armas/numero-serie/${numeroSerie}`);
    return response.data;
  },
};

// Funções de API para veículos
export const veiculosApi = {
  getAll: async () => {
    const response = await api.get('/veiculos');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/veiculos', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/veiculos/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/veiculos/${id}`);
    return response.data;
  },
  
  findByPlaca: async (placa: string) => {
    const response = await api.get(`/veiculos/placa/${placa}`);
    return response.data;
  },
};

// Funções de API para relatórios
export const relatoriosApi = {
  gerarInformativoPDF: async (ocorrenciaIds: string[]) => {
    const response = await api.post('/relatorios/informativo-pdf', {
      ocorrenciaIds,
    }, {
      responseType: 'blob',
    });
    
    // Criar link para download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `informativo_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};

// Funções de API para dimensionamento
export const dimensionamentoApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    regiao?: string;
    opm?: string;
  }) => {
    const response = await api.get('/dimensionamento', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/dimensionamento/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/dimensionamento', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/dimensionamento/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/dimensionamento/${id}`);
    return response.data;
  },
  
  import: async (data: any) => {
    const response = await api.post('/dimensionamento/import', data);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/dimensionamento/stats');
    return response.data;
  },
};
