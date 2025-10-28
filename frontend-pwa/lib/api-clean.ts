import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://siraop-backend.fly.dev/api';

// Instância limpa do Axios sem interceptors problemáticos
export const apiClean = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para adicionar token manualmente
export const addAuthToken = (token: string) => {
  apiClean.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Função para remover token
export const removeAuthToken = () => {
  delete apiClean.defaults.headers.common['Authorization'];
};

// Funções de API para dimensionamento sem interceptors
export const dimensionamentoApiClean = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    regiao?: string;
    opm?: string;
  }) => {
    const response = await apiClean.get('/dimensionamento', { params });
    return response.data;
  },
  
  getStats: async () => {
    const response = await apiClean.get('/dimensionamento/stats');
    return response.data;
  },
  
  import: async (data: any) => {
    const response = await apiClean.post('/dimensionamento/import', data);
    return response.data;
  },
};
