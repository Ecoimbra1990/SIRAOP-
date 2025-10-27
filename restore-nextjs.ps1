# Script para restaurar o sistema Next.js
Write-Host "🔄 Restaurando sistema Next.js..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Remover arquivos estáticos que estão causando conflito
Write-Host "🗑️ Removendo arquivos estáticos..." -ForegroundColor Yellow
if (Test-Path "out\index.html") {
    Remove-Item "out\index.html" -Force
    Write-Host "✅ index.html estático removido" -ForegroundColor Green
}

# Limpar pasta out
Write-Host "🧹 Limpando pasta out..." -ForegroundColor Yellow
if (Test-Path "out") {
    Remove-Item "out\*" -Recurse -Force
    Write-Host "✅ Pasta out limpa" -ForegroundColor Green
}

# Usar Node.js portátil para fazer build
Write-Host "🔨 Fazendo build com Node.js portátil..." -ForegroundColor Yellow
$nodePath = "..\nodejs-portable\node-v18.19.0-win-x64\node.exe"
$npmPath = "..\nodejs-portable\node-v18.19.0-win-x64\npm.cmd"

if (Test-Path $nodePath) {
    Write-Host "✅ Node.js portátil encontrado" -ForegroundColor Green
    
    # Instalar dependências
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    & $nodePath $npmPath install
    
    # Fazer build
    Write-Host "🔨 Fazendo build do Next.js..." -ForegroundColor Yellow
    & $nodePath $npmPath run build
    
    if (Test-Path "out") {
        Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
        
        # Verificar se os arquivos corretos foram gerados
        $htmlFiles = Get-ChildItem "out" -Filter "*.html" -Recurse
        Write-Host "📄 Arquivos HTML gerados: $($htmlFiles.Count)" -ForegroundColor Cyan
        
        foreach ($file in $htmlFiles) {
            Write-Host "  - $($file.Name)" -ForegroundColor Gray
        }
        
        # Fazer commit das mudanças
        Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
        Set-Location ".."
        git add frontend-pwa/out
        git commit -m "fix: restaurar sistema Next.js removendo arquivos estáticos"
        git push origin main
        
        Write-Host "🎉 Sistema Next.js restaurado!" -ForegroundColor Green
        Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
        Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
        
    } else {
        Write-Host "❌ Build falhou - pasta out não foi criada" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Node.js portátil não encontrado" -ForegroundColor Red
    Write-Host "💡 Tentando usar npm global..." -ForegroundColor Yellow
    
    # Tentar usar npm global
    try {
        npm install
        npm run build
        
        if (Test-Path "out") {
            Write-Host "✅ Build concluído com npm global!" -ForegroundColor Green
        } else {
            Write-Host "❌ Build falhou" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erro ao usar npm global: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Voltar ao diretório raiz
Set-Location ".."
