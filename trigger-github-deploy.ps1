# Script para acionar deploy via GitHub Actions
Write-Host "🚀 Acionando deploy via GitHub Actions..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (Test-Path "frontend-pwa\out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Fazer commit das mudanças para acionar o GitHub Actions
    Write-Host "📝 Fazendo commit para acionar GitHub Actions..." -ForegroundColor Yellow
    
    # Adicionar um arquivo de trigger
    $triggerContent = @"
# Deploy Trigger
Deploy realizado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Arquivos atualizados:
- index.html
- admin/index.html  
- dimensionamento/index.html
"@
    
    $triggerContent | Out-File -FilePath "frontend-pwa\out\deploy-trigger.txt" -Encoding UTF8
    
    # Fazer commit
    git add frontend-pwa/out/deploy-trigger.txt
    git commit -m "trigger: acionar deploy automático do Firebase Hosting"
    git push origin main
    
    Write-Host "🎉 GitHub Actions acionado!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://github.com/Ecoimbra1990/SIRAOP/actions" -ForegroundColor Cyan
    Write-Host "⏱️ Aguarde 2-5 minutos para o deploy ser concluído" -ForegroundColor Yellow
    Write-Host "🔗 Depois acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}
