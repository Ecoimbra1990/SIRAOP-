# Script para instalar Node.js
Write-Host "Instalando Node.js..." -ForegroundColor Green

# Baixar Node.js
$url = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
$output = "$env:TEMP\nodejs-installer.msi"

Write-Host "Baixando Node.js..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Instalando Node.js..." -ForegroundColor Yellow
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i $output /quiet" -Wait

Write-Host "Atualizando PATH..." -ForegroundColor Yellow
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "Verificando instalação..." -ForegroundColor Yellow
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
    Write-Host "Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Erro ao verificar Node.js" -ForegroundColor Red
}

Write-Host "Instalação concluída!" -ForegroundColor Green
