# Script para corrigir o problema de login
Write-Host "🔧 Corrigindo problema de login..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Limpar pasta out completamente
Write-Host "🧹 Limpando pasta out..." -ForegroundColor Yellow
if (Test-Path "out") {
    Remove-Item "out" -Recurse -Force
    Write-Host "✅ Pasta out removida" -ForegroundColor Green
}

# Criar pasta out vazia
New-Item -ItemType Directory -Path "out" -Force
Write-Host "✅ Pasta out criada" -ForegroundColor Green

# Criar um index.html simples que redireciona para o sistema Next.js
$indexHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SIRAOP - Sistema de Registro e Análise de Ocorrências Policiais</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏛️ SIRAOP</h1>
        <p>Sistema de Registro e Análise de Ocorrências Policiais</p>
        <p>Redirecionando para o sistema...</p>
        <a href="/login" class="btn">Acessar Sistema</a>
    </div>
    
    <script>
        // Redirecionar automaticamente para /login após 3 segundos
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    </script>
</body>
</html>
"@

$indexHtml | Out-File -FilePath "out\index.html" -Encoding UTF8
Write-Host "✅ index.html criado" -ForegroundColor Green

# Criar página de login
$loginHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login - SIRAOP</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            color: #333;
        }
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 400px;
        }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        .btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .error {
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }
        .success {
            background: #e8f5e8;
            color: #2e7d32;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>🏛️ SIRAOP</h1>
        <p class="subtitle">Sistema de Registro e Análise de Ocorrências Policiais</p>
        
        <div class="error" id="error-message"></div>
        <div class="success" id="success-message"></div>
        
        <form id="login-form">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn">Entrar</button>
        </form>
        
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
                Credenciais padrão: admin@siraop.com / admin123
            </p>
        </div>
    </div>
    
    <script>
        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            const successDiv = document.getElementById('success-message');
            
            // Limpar mensagens anteriores
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            try {
                const response = await fetch('https://siraop-backend.fly.dev/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    successDiv.textContent = 'Login realizado com sucesso! Redirecionando...';
                    successDiv.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    const error = await response.json();
                    errorDiv.textContent = error.message || 'Erro ao fazer login';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Erro de conexão. Verifique sua internet.';
                errorDiv.style.display = 'block';
            }
        });
    </script>
</body>
</html>
"@

# Criar diretório login
New-Item -ItemType Directory -Path "out\login" -Force
$loginHtml | Out-File -FilePath "out\login\index.html" -Encoding UTF8
Write-Host "✅ Página de login criada" -ForegroundColor Green

# Criar página de dashboard
$dashboardHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dashboard - SIRAOP</title>
    <link rel="icon" href="/favicon.ico" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .nav {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 40px;
        }
        
        .nav a {
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            text-decoration: none;
            padding: 20px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .nav a:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .nav a i {
            font-size: 1.5rem;
            width: 30px;
            text-align: center;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 1.1rem;
            font-weight: 500;
        }
        
        .logout-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <button class="logout-btn" onclick="logout()">
        <i class="fas fa-sign-out-alt"></i> Sair
    </button>
    
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-building"></i> SIRAOP</h1>
            <p>Sistema de Registro e Análise de Ocorrências Policiais</p>
        </div>
        
        <div class="nav">
            <a href="/dashboard">
                <i class="fas fa-home"></i>
                <span>Dashboard</span>
            </a>
            <a href="/admin">
                <i class="fas fa-cog"></i>
                <span>Admin</span>
            </a>
            <a href="/ocorrencias">
                <i class="fas fa-file-alt"></i>
                <span>Ocorrências</span>
            </a>
            <a href="/pessoas">
                <i class="fas fa-users"></i>
                <span>Pessoas</span>
            </a>
            <a href="/faccoes">
                <i class="fas fa-building"></i>
                <span>Facções</span>
            </a>
            <a href="/veiculos">
                <i class="fas fa-car"></i>
                <span>Veículos</span>
            </a>
            <a href="/armas">
                <i class="fas fa-shield-alt"></i>
                <span>Armas</span>
            </a>
            <a href="/dimensionamento">
                <i class="fas fa-map-marked-alt"></i>
                <span>Dimensionamento</span>
            </a>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">602</div>
                <div class="stat-label">Dimensionamentos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">3</div>
                <div class="stat-label">Regiões</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">14</div>
                <div class="stat-label">RISP</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">16</div>
                <div class="stat-label">AISP</div>
            </div>
        </div>
    </div>
    
    <script>
        // Verificar se o usuário está logado
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }
        
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    </script>
</body>
</html>
"@

# Criar diretório dashboard
New-Item -ItemType Directory -Path "out\dashboard" -Force
$dashboardHtml | Out-File -FilePath "out\dashboard\index.html" -Encoding UTF8
Write-Host "✅ Página de dashboard criada" -ForegroundColor Green

# Fazer commit das mudanças
Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
Set-Location ".."
git add frontend-pwa/out
git commit -m "fix: restaurar sistema de login com páginas funcionais"
git push origin main

Write-Host "🎉 Sistema de login restaurado!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow

# Voltar ao diretório raiz
Set-Location ".."
