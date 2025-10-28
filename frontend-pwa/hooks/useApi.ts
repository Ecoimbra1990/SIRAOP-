import { useRef, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';

export function useApi() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const makeRequest = useCallback(async <T>(
    requestFn: (config?: AxiosRequestConfig) => Promise<T>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    try {
      const result = await requestFn({
        ...config,
        signal: abortControllerRef.current.signal,
      });
      return result;
    } catch (error: any) {
      // Ignorar erros de requisições abortadas
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        throw error;
      }
      throw error;
    }
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    makeRequest,
    cancelRequest,
  };
}
