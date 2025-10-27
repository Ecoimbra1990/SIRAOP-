# Script para forçar atualização do cache
Write-Host "🔄 Forçando atualização do cache..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Verificar se a pasta out existe
if (Test-Path "out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Criar um arquivo de cache bust com timestamp único
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $cacheBustContent = @"
# Cache Bust - $timestamp
Deploy realizado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Cache bust timestamp: $timestamp

Este arquivo força a atualização do cache do navegador.
Se você está vendo este arquivo, o deploy foi realizado com sucesso!
"@
    
    $cacheBustContent | Out-File -FilePath "out\cache-bust-$timestamp.txt" -Encoding UTF8
    
    # Atualizar index.html com cache bust
    $indexContent = Get-Content "out\index.html" -Raw
    $updatedIndex = $indexContent -replace "Sistema Atualizado!", "Sistema Atualizado! (Cache Bust: $timestamp)"
    
    # Adicionar meta tags para cache bust
    $metaTags = @"
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
"@
    
    $updatedIndex = $updatedIndex -replace "<head>", "<head>$metaTags"
    $updatedIndex | Out-File -FilePath "out\index.html" -Encoding UTF8
    
    # Atualizar firebase.json para desabilitar cache
    $firebaseConfig = @"
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          },
          {
            "key": "Pragma",
            "value": "no-cache"
          },
          {
            "key": "Expires",
            "value": "0"
          }
        ]
      }
    ]
  }
}
"@
    
    $firebaseConfig | Out-File -FilePath "firebase.json" -Encoding UTF8
    
    Write-Host "✅ Cache bust aplicado com timestamp: $timestamp" -ForegroundColor Green
    
    # Fazer commit das mudanças
    Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
    Set-Location ".."
    git add frontend-pwa/out frontend-pwa/firebase.json
    git commit -m "force: cache bust - $timestamp"
    git push origin main
    
    Write-Host "🎉 Cache bust concluído!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
    Write-Host "💡 Se ainda não funcionar, limpe o cache do navegador (Ctrl+F5)" -ForegroundColor Yellow
    
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."
