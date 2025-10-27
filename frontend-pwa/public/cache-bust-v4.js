// Cache Busting Script - Force reload
console.log('🚀 CACHE BUST v4.0 - ' + new Date().toISOString());

// Force reload if this is an old version
if (!document.title.includes('v3.0')) {
  console.log('🔄 Forçando reload da página...');
  window.location.reload(true);
}

// Add visual indicator
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('h1');
  if (title && title.textContent.includes('Dimensionamento Territorial')) {
    if (!title.textContent.includes('🚀 v3.0')) {
      console.log('⚠️ Versão antiga detectada - forçando reload');
      window.location.reload(true);
    } else {
      console.log('✅ Versão correta detectada');
    }
  }
});
