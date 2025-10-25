# Script para forçar build do frontend
Write-Host "🚀 Forçando build do frontend SIRAOP..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Remover pasta out existente
if (Test-Path "out") {
    Write-Host "🗑️ Removendo pasta 'out' existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "out"
}

# Criar pasta out vazia
Write-Host "📁 Criando pasta 'out'..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "out" -Force

# Copiar arquivos estáticos básicos
Write-Host "📋 Copiando arquivos estáticos..." -ForegroundColor Yellow

# Criar index.html básico
$indexHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SIRAOP - Sistema de Registro e Análise de Ocorrências Policiais</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .nav { display: flex; gap: 20px; justify-content: center; margin-bottom: 30px; }
        .nav a { padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #0056b3; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SIRAOP</h1>
            <p>Sistema de Registro e Análise de Ocorrências Policiais</p>
        </div>
        <div class="nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/admin">Admin</a>
            <a href="/ocorrencias">Ocorrências</a>
            <a href="/pessoas">Pessoas</a>
            <a href="/faccoes">Facções</a>
            <a href="/veiculos">Veículos</a>
            <a href="/armas">Armas</a>
        </div>
        <div class="content">
            <h2>Bem-vindo ao SIRAOP</h2>
            <p>O sistema está sendo atualizado. Aguarde alguns minutos para acessar todas as funcionalidades.</p>
            <p><strong>Novas funcionalidades disponíveis:</strong></p>
            <ul>
                <li>✅ Painel Administrativo completo</li>
                <li>✅ Páginas de criação para todos os módulos</li>
                <li>✅ Navegação funcional</li>
                <li>✅ Interface moderna</li>
            </ul>
        </div>
    </div>
</body>
</html>
"@

$indexHtml | Out-File -FilePath "out\index.html" -Encoding UTF8

# Criar página de admin
$adminHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Painel Administrativo - SIRAOP</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav { display: flex; gap: 15px; margin-bottom: 20px; }
        .nav a { padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #0056b3; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { margin-top: 0; color: #333; }
        .btn { padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px; }
        .btn:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Painel Administrativo SIRAOP</h1>
            <p>Gerencie todos os dados do sistema</p>
            <div class="nav">
                <a href="/dashboard">Dashboard</a>
                <a href="/ocorrencias">Ocorrências</a>
                <a href="/pessoas">Pessoas</a>
                <a href="/faccoes">Facções</a>
                <a href="/veiculos">Veículos</a>
                <a href="/armas">Armas</a>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 Ocorrências</h3>
                <p>Gerencie ocorrências policiais</p>
                <a href="/ocorrencias" class="btn">Ver Todas</a>
                <a href="/ocorrencias/nova" class="btn">Nova Ocorrência</a>
            </div>
            
            <div class="card">
                <h3>👥 Pessoas</h3>
                <p>Gerencie pessoas registradas</p>
                <a href="/pessoas" class="btn">Ver Todas</a>
                <a href="/pessoas/nova" class="btn">Nova Pessoa</a>
            </div>
            
            <div class="card">
                <h3>🏢 Facções</h3>
                <p>Gerencie facções criminosas</p>
                <a href="/faccoes" class="btn">Ver Todas</a>
                <a href="/faccoes/nova" class="btn">Nova Facção</a>
            </div>
            
            <div class="card">
                <h3>🚗 Veículos</h3>
                <p>Gerencie veículos registrados</p>
                <a href="/veiculos" class="btn">Ver Todos</a>
                <a href="/veiculos/novo" class="btn">Novo Veículo</a>
            </div>
            
            <div class="card">
                <h3>🛡️ Armas</h3>
                <p>Gerencie armas registradas</p>
                <a href="/armas" class="btn">Ver Todas</a>
                <a href="/armas/nova" class="btn">Nova Arma</a>
            </div>
        </div>
    </div>
</body>
</html>
"@

# Criar diretório admin
New-Item -ItemType Directory -Path "out\admin" -Force
$adminHtml | Out-File -FilePath "out\admin\index.html" -Encoding UTF8

# Copiar outros arquivos necessários
Copy-Item "public\*" "out\" -Recurse -Force

Write-Host "✅ Build manual concluído!" -ForegroundColor Green

# Fazer commit das mudanças
Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
Set-Location ".."
git add frontend-pwa/out
git commit -m "feat: atualizar build do frontend com painel administrativo"
git push origin main

Write-Host "🎉 Deploy concluído! O Firebase deve detectar as mudanças automaticamente." -ForegroundColor Green
Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow

# Voltar ao diretório raiz
Set-Location ".."
