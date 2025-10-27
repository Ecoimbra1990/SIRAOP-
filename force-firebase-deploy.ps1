# Script para forçar deploy do Firebase Hosting
Write-Host "🚀 Forçando deploy do Firebase Hosting..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Verificar se a pasta out existe
if (Test-Path "out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Criar um arquivo de timestamp para forçar atualização
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $timestampContent = @"
# Firebase Hosting Deploy
Deploy realizado em: $timestamp
Arquivos atualizados:
- index.html (correções de autenticação)
- admin/index.html (painel administrativo)
- dimensionamento/index.html (módulo de dimensionamento)

Status: Deploy forçado para resolver problema de cache
"@
    
    $timestampContent | Out-File -FilePath "out\deploy-timestamp.txt" -Encoding UTF8
    
    # Atualizar index.html com timestamp
    $indexContent = Get-Content "out\index.html" -Raw
    $updatedIndex = $indexContent -replace "Sistema Atualizado!", "Sistema Atualizado! (Deploy: $timestamp)"
    $updatedIndex | Out-File -FilePath "out\index.html" -Encoding UTF8
    
    Write-Host "✅ Arquivos atualizados com timestamp" -ForegroundColor Green
    
    # Fazer commit das mudanças
    Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
    Set-Location ".."
    git add frontend-pwa/out
    git commit -m "force: forçar deploy do Firebase Hosting com timestamp - $timestamp"
    git push origin main
    
    Write-Host "🎉 Deploy forçado concluído!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
    
    # Verificar se o GitHub Actions está funcionando
    Write-Host "🔍 Verificando GitHub Actions..." -ForegroundColor Yellow
    Write-Host "🌐 Acesse: https://github.com/Ecoimbra1990/SIRAOP/actions" -ForegroundColor Cyan
    Write-Host "💡 Procure por 'Deploy to Firebase Hosting' na lista de workflows" -ForegroundColor Yellow
    
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
