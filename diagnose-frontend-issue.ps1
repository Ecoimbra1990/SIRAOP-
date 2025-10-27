# Script para diagnosticar problema do frontend
Write-Host "🔍 Diagnosticando problema do frontend..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (Test-Path "frontend-pwa\out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Listar arquivos
    Write-Host "📁 Arquivos na pasta 'out':" -ForegroundColor Yellow
    Get-ChildItem "frontend-pwa\out" -Recurse | Select-Object Name, LastWriteTime
    
    # Verificar se há arquivos HTML
    $htmlFiles = Get-ChildItem "frontend-pwa\out" -Filter "*.html" -Recurse
    if ($htmlFiles.Count -gt 0) {
        Write-Host "✅ Encontrados $($htmlFiles.Count) arquivos HTML" -ForegroundColor Green
        
        # Verificar conteúdo dos arquivos
        Write-Host "📄 Verificando conteúdo dos arquivos HTML:" -ForegroundColor Yellow
        
        # Verificar index.html
        $indexContent = Get-Content "frontend-pwa\out\index.html" -Raw
        if ($indexContent -like "*Dimensionamento*") {
            Write-Host "✅ index.html contém 'Dimensionamento'" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html não contém 'Dimensionamento'" -ForegroundColor Red
        }
        
        # Verificar se há cache bust
        if ($indexContent -like "*Cache Bust:*") {
            Write-Host "✅ index.html contém cache bust" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html não contém cache bust" -ForegroundColor Red
        }
        
        # Verificar se há meta tags de cache
        if ($indexContent -like "*Cache-Control*") {
            Write-Host "✅ index.html contém meta tags de cache" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html não contém meta tags de cache" -ForegroundColor Red
        }
        
        Write-Host "🎉 Diagnóstico concluído!" -ForegroundColor Green
        
        # Explicar o problema
        Write-Host "🔍 POSSÍVEIS CAUSAS:" -ForegroundColor Yellow
        Write-Host "1. Cache do navegador - O navegador está mostrando versão antiga" -ForegroundColor Red
        Write-Host "2. Firebase não atualizou - O deploy não foi processado" -ForegroundColor Red
        Write-Host "3. DNS/CDN cache - O Firebase CDN está servindo versão antiga" -ForegroundColor Red
        Write-Host "4. Configuração incorreta - Firebase não está servindo arquivos corretos" -ForegroundColor Red
        
        Write-Host "🔧 SOLUÇÕES:" -ForegroundColor Yellow
        Write-Host "1. Limpar cache do navegador (Ctrl+F5 ou Ctrl+Shift+R)" -ForegroundColor Cyan
        Write-Host "2. Abrir em aba anônima/privada" -ForegroundColor Cyan
        Write-Host "3. Aguardar alguns minutos para o Firebase processar" -ForegroundColor Cyan
        Write-Host "4. Verificar se o Firebase CLI está funcionando" -ForegroundColor Cyan
        
        Write-Host "💡 TESTE RÁPIDO:" -ForegroundColor Yellow
        Write-Host "1. Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
        Write-Host "2. Pressione Ctrl+F5 para forçar atualização" -ForegroundColor Cyan
        Write-Host "3. Procure por 'Cache Bust:' na página" -ForegroundColor Cyan
        Write-Host "4. Verifique se há link para 'Dimensionamento'" -ForegroundColor Cyan
        
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado na pasta 'out'" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
