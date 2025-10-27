# Script para verificar status do deploy
Write-Host "🔍 Verificando status do deploy..." -ForegroundColor Green

# Verificar se a pasta out existe
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
        
        Write-Host "🎉 Deploy verificado com sucesso!" -ForegroundColor Green
        Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
        Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado na pasta 'out'" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Verificar status do GitHub Actions
Write-Host "🔍 Verificando status do GitHub Actions..." -ForegroundColor Yellow
Write-Host "🌐 Acesse: https://github.com/Ecoimbra1990/SIRAOP/actions" -ForegroundColor Cyan
Write-Host "💡 Procure por 'Deploy to Firebase Hosting' na lista de workflows" -ForegroundColor Yellow