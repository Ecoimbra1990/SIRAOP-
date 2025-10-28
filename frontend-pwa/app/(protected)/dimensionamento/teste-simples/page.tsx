'use client';

import { useState, useEffect } from 'react';

export default function DimensionamentoTesteSimples() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('🚀 DimensionamentoTesteSimples - Montado');
    setMounted(true);
    
    // Simular carregamento
    const timer = setTimeout(() => {
      setCount(1);
      console.log('✅ Carregamento simulado concluído');
    }, 1000);

    return () => {
      clearTimeout(timer);
      console.log('🧹 DimensionamentoTesteSimples - Desmontado');
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando componente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🧪 Teste Simples de Carregamento
        </h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Componente carregado com sucesso!
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <div className="card-content text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
              <p className="text-gray-600">Componente Montado</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{count}</div>
              <p className="text-gray-600">Estado Atualizado</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {new Date().toLocaleTimeString()}
              </div>
              <p className="text-gray-600">Timestamp</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded text-left">
          <h3 className="font-bold mb-2">Informações de Debug:</h3>
          <ul className="text-sm space-y-1">
            <li>• Montado: {mounted ? 'Sim' : 'Não'}</li>
            <li>• Count: {count}</li>
            <li>• Timestamp: {new Date().toISOString()}</li>
            <li>• User Agent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</li>
            <li>• URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</li>
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setCount(count + 1)}
            className="btn-primary mr-4"
          >
            Incrementar Contador
          </button>
          
          <button
            onClick={() => {
              console.log('🔄 Recarregando página...');
              window.location.reload();
            }}
            className="btn-outline"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    </div>
  );
}
