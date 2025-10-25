# Script para build manual do frontend
Write-Host "🚀 Fazendo build manual do frontend SIRAOP..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Usar o executável do Node.js portável
$nodeExe = "..\nodejs-portable\node-v18.19.0-win-x64\node.exe"

if (Test-Path $nodeExe) {
    Write-Host "✅ Node.js portável encontrado" -ForegroundColor Green
    
    # Fazer build usando o executável direto
    Write-Host "🔨 Fazendo build do Next.js..." -ForegroundColor Yellow
    
    # Executar o build
    & $nodeExe ".\node_modules\next\dist\bin\next" build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
        
        # Verificar se a pasta out foi criada/atualizada
        if (Test-Path "out") {
            Write-Host "📁 Pasta 'out' encontrada com build atualizado" -ForegroundColor Green
            
            # Fazer commit das mudanças
            Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
            Set-Location ".."
            git add frontend-pwa/out
            git commit -m "feat: atualizar build do frontend com novas páginas"
            git push origin main
            
            Write-Host "🎉 Deploy concluído! O Firebase deve detectar as mudanças automaticamente." -ForegroundColor Green
            Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
            Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
            
        } else {
            Write-Host "❌ Erro: Pasta 'out' não foi criada" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Erro no build. Código de saída: $LASTEXITCODE" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Node.js portável não encontrado" -ForegroundColor Red
}

# Voltar ao diretório raiz
Set-Location ".."
