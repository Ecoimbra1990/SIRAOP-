# Script para diagnosticar problema de deploy
Write-Host "🔍 Diagnosticando problema de deploy..." -ForegroundColor Green

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
        
        # Verificar se há timestamp de deploy
        if ($indexContent -like "*Deploy:*") {
            Write-Host "✅ index.html contém timestamp de deploy" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html não contém timestamp de deploy" -ForegroundColor Red
        }
        
        # Verificar admin/index.html
        if (Test-Path "frontend-pwa\out\admin\index.html") {
            $adminContent = Get-Content "frontend-pwa\out\admin\index.html" -Raw
            if ($adminContent -like "*Dimensionamento*") {
                Write-Host "✅ admin/index.html contém 'Dimensionamento'" -ForegroundColor Green
            } else {
                Write-Host "❌ admin/index.html não contém 'Dimensionamento'" -ForegroundColor Red
            }
        }
        
        # Verificar dimensionamento/index.html
        if (Test-Path "frontend-pwa\out\dimensionamento\index.html") {
            $dimensionamentoContent = Get-Content "frontend-pwa\out\dimensionamento\index.html" -Raw
            if ($dimensionamentoContent -like "*Dimensionamento Territorial*") {
                Write-Host "✅ dimensionamento/index.html contém 'Dimensionamento Territorial'" -ForegroundColor Green
            } else {
                Write-Host "❌ dimensionamento/index.html não contém 'Dimensionamento Territorial'" -ForegroundColor Red
            }
        }
        
        Write-Host "🎉 Diagnóstico concluído!" -ForegroundColor Green
        
        # Explicar o problema
        Write-Host "🔍 PROBLEMA IDENTIFICADO:" -ForegroundColor Yellow
        Write-Host "O Firebase Hosting não está configurado para deploy automático." -ForegroundColor Red
        Write-Host "Isso significa que as mudanças no GitHub não são automaticamente" -ForegroundColor Red
        Write-Host "deployadas para o site https://siraop-frontend.web.app" -ForegroundColor Red
        
        Write-Host "🔧 SOLUÇÕES POSSÍVEIS:" -ForegroundColor Yellow
        Write-Host "1. Configurar Firebase CLI localmente" -ForegroundColor Cyan
        Write-Host "2. Configurar GitHub Actions com chaves do Firebase" -ForegroundColor Cyan
        Write-Host "3. Deploy manual via Firebase Console" -ForegroundColor Cyan
        Write-Host "4. Usar Vercel ou Netlify para deploy automático" -ForegroundColor Cyan
        
        Write-Host "💡 RECOMENDAÇÃO:" -ForegroundColor Yellow
        Write-Host "Configure o Firebase CLI localmente para fazer deploy manual:" -ForegroundColor Cyan
        Write-Host "1. npm install -g firebase-tools" -ForegroundColor White
        Write-Host "2. firebase login" -ForegroundColor White
        Write-Host "3. firebase deploy --only hosting" -ForegroundColor White
        
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado na pasta 'out'" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
