# Script para simular deploy manual
Write-Host "🚀 Simulando deploy manual do Firebase..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Verificar se a pasta out existe
if (Test-Path "out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Listar arquivos
    Write-Host "📁 Arquivos na pasta 'out':" -ForegroundColor Yellow
    Get-ChildItem "out" -Recurse | Select-Object Name, LastWriteTime
    
    # Verificar se há arquivos HTML
    $htmlFiles = Get-ChildItem "out" -Filter "*.html" -Recurse
    if ($htmlFiles.Count -gt 0) {
        Write-Host "✅ Encontrados $($htmlFiles.Count) arquivos HTML" -ForegroundColor Green
        
        # Verificar conteúdo dos arquivos
        Write-Host "📄 Verificando conteúdo dos arquivos HTML:" -ForegroundColor Yellow
        
        # Verificar index.html
        $indexContent = Get-Content "out\index.html" -Raw
        if ($indexContent -like "*Dimensionamento*") {
            Write-Host "✅ index.html contém 'Dimensionamento'" -ForegroundColor Green
        } else {
            Write-Host "❌ index.html não contém 'Dimensionamento'" -ForegroundColor Red
        }
        
        # Verificar admin/index.html
        if (Test-Path "out\admin\index.html") {
            $adminContent = Get-Content "out\admin\index.html" -Raw
            if ($adminContent -like "*Dimensionamento*") {
                Write-Host "✅ admin/index.html contém 'Dimensionamento'" -ForegroundColor Green
            } else {
                Write-Host "❌ admin/index.html não contém 'Dimensionamento'" -ForegroundColor Red
            }
        }
        
        # Verificar dimensionamento/index.html
        if (Test-Path "out\dimensionamento\index.html") {
            $dimensionamentoContent = Get-Content "out\dimensionamento\index.html" -Raw
            if ($dimensionamentoContent -like "*Dimensionamento Territorial*") {
                Write-Host "✅ dimensionamento/index.html contém 'Dimensionamento Territorial'" -ForegroundColor Green
            } else {
                Write-Host "❌ dimensionamento/index.html não contém 'Dimensionamento Territorial'" -ForegroundColor Red
            }
        }
        
        Write-Host "🎉 Deploy simulado concluído!" -ForegroundColor Green
        Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
        Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado na pasta 'out'" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
