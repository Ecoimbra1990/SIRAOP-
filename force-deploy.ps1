# Script para forçar deploy do Firebase
Write-Host "🚀 Forçando deploy do Firebase Hosting..." -ForegroundColor Green

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
        
        # Fazer commit das mudanças
        Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
        Set-Location ".."
        git add frontend-pwa/out frontend-pwa/.firebaserc frontend-pwa/firebase.json
        git commit -m "feat: configurar Firebase Hosting e atualizar frontend"
        git push origin main
        
        Write-Host "🎉 Deploy forçado concluído!" -ForegroundColor Green
        Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
        Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
        
        # Verificar se o Firebase CLI está disponível
        try {
            firebase --version
            Write-Host "✅ Firebase CLI encontrado" -ForegroundColor Green
            Write-Host "💡 Para forçar deploy: firebase deploy --only hosting" -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Firebase CLI não encontrado" -ForegroundColor Red
            Write-Host "💡 Instale com: npm install -g firebase-tools" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Nenhum arquivo HTML encontrado na pasta 'out'" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
