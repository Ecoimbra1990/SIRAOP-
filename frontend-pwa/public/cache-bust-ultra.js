// Cache Busting Otimizado - DESABILITADO TEMPORARIAMENTE PARA EVITAR LOOPS
console.log('🔥 CACHE BUST ULTRA - DESABILITADO TEMPORARIAMENTE');

// Verificar se é necessário fazer cache bust apenas uma vez por sessão
const cacheKey = 'siraop-cache-bust-' + window.location.pathname;
const lastCacheBust = sessionStorage.getItem(cacheKey);

if (!lastCacheBust) {
  console.log('🔄 Primeira carga da sessão - SEM RELOAD');
  
  // Marcar que já fizemos o cache bust nesta sessão
  sessionStorage.setItem(cacheKey, Date.now().toString());
  
  // DESABILITADO: Não fazer reload automático para evitar loops
  console.log('✅ Cache bust desabilitado para evitar loops de carregamento');
} else {
  console.log('✅ Cache bust já realizado nesta sessão');
}

// Adicionar timestamp único ao título apenas se necessário
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('h1');
  if (title && title.textContent.includes('Dimensionamento Territorial') && !title.textContent.includes('⚡')) {
    title.textContent += ' ⚡ ' + Date.now();
  }
});
