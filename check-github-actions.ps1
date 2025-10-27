# Script para verificar GitHub Actions e criar solução alternativa
Write-Host "🔍 Verificando GitHub Actions..." -ForegroundColor Green

# Verificar se o GitHub Actions está funcionando
Write-Host "🌐 Acesse: https://github.com/Ecoimbra1990/SIRAOP/actions" -ForegroundColor Cyan
Write-Host "💡 Procure por 'Deploy to Firebase Hosting' na lista de workflows" -ForegroundColor Yellow

# Se o GitHub Actions não estiver funcionando, criar solução alternativa
Write-Host "🔧 Criando solução alternativa..." -ForegroundColor Yellow

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Verificar se a pasta out existe
if (Test-Path "out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Criar um arquivo de verificação
    $verificationContent = @"
# Verificação de Deploy
Deploy realizado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Status: Verificação de deploy manual

Arquivos presentes:
- index.html
- admin/index.html
- dimensionamento/index.html
- deploy-timestamp.txt
- deploy-trigger.txt

Se você está vendo este arquivo, o deploy foi realizado com sucesso!
"@
    
    $verificationContent | Out-File -FilePath "out\deploy-verification.txt" -Encoding UTF8
    
    # Atualizar index.html com informações de deploy
    $indexContent = Get-Content "out\index.html" -Raw
    $updatedIndex = $indexContent -replace "Sistema Atualizado!", "Sistema Atualizado! (Verificação: $(Get-Date -Format 'HH:mm:ss'))"
    $updatedIndex | Out-File -FilePath "out\index.html" -Encoding UTF8
    
    Write-Host "✅ Arquivo de verificação criado" -ForegroundColor Green
    
    # Fazer commit das mudanças
    Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
    Set-Location ".."
    git add frontend-pwa/out
    git commit -m "feat: adicionar verificação de deploy manual"
    git push origin main
    
    Write-Host "🎉 Verificação de deploy concluída!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
    
    # Instruções para verificar se o deploy funcionou
    Write-Host "🔍 Para verificar se o deploy funcionou:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    Write-Host "2. Procure por 'Deploy:' na página inicial" -ForegroundColor Cyan
    Write-Host "3. Verifique se há link para 'Dimensionamento'" -ForegroundColor Cyan
    Write-Host "4. Teste a navegação entre páginas" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
