// Cache Busting Conservador - Apenas quando necessário
console.log('🔥 CACHE BUST CONSERVADOR - ' + new Date().toISOString());

// Verificar se é necessário fazer cache bust apenas uma vez por sessão
const cacheKey = 'siraop-cache-bust-' + window.location.pathname;
const lastCacheBust = sessionStorage.getItem(cacheKey);

if (!lastCacheBust) {
  console.log('🔄 Primeira carga da sessão - verificando versão...');
  
  // Marcar que já fizemos o cache bust nesta sessão
  sessionStorage.setItem(cacheKey, Date.now().toString());
  
  // Verificação muito conservadora - apenas em casos específicos
  setTimeout(() => {
    // Só fazer reload se:
    // 1. Documento completamente carregado
    // 2. Não há elementos de loading
    // 3. Não há erros de JavaScript
    // 4. Título específico indica versão muito antiga
    if (document.readyState === 'complete' && 
        !document.querySelector('[data-loading="true"]') &&
        !window.hasError) {
      
      const title = document.querySelector('h1');
      // Verificação muito específica - apenas se título for exatamente o antigo
      if (title && 
          title.textContent === 'Dimensionamento Territorial' && 
          !title.textContent.includes('⚡') && 
          !title.textContent.includes('Sistema') &&
          !title.textContent.includes('SIRAOP')) {
        
        console.log('⚠️ Versão muito antiga detectada - forçando reload');
        window.location.reload(true);
      } else {
        console.log('✅ Versão atual detectada - sem reload necessário');
      }
    } else {
      console.log('✅ Página ainda carregando - sem reload');
    }
  }, 2000); // Delay maior para garantir estabilidade
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

// Detectar erros de JavaScript para evitar reloads
window.addEventListener('error', function() {
  window.hasError = true;
});
