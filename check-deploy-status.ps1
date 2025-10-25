# Script para verificar status do deploy
Write-Host "🔍 Verificando status do deploy..." -ForegroundColor Green

# Verificar se o Firebase CLI está disponível
try {
    firebase --version
    Write-Host "✅ Firebase CLI encontrado" -ForegroundColor Green
    
    # Navegar para o diretório do frontend
    Set-Location "frontend-pwa"
    
    # Verificar se está logado
    try {
        firebase projects:list
        Write-Host "✅ Firebase CLI logado" -ForegroundColor Green
        
        # Fazer deploy manual
        Write-Host "🚀 Fazendo deploy manual..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
    } catch {
        Write-Host "❌ Firebase CLI não está logado" -ForegroundColor Red
        Write-Host "💡 Execute: firebase login" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Firebase CLI não encontrado" -ForegroundColor Red
    Write-Host "💡 Instale com: npm install -g firebase-tools" -ForegroundColor Yellow
    Write-Host "💡 Ou configure deploy automático no GitHub Actions" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
