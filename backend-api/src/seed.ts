import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);

  try {
    // Verificar se já existe um admin
    const existingAdmin = await usersService.findByEmail('admin@siraop.com');
    
    if (existingAdmin) {
      console.log('✅ Usuário admin já existe:', existingAdmin.email);
      return;
    }

    // Criar usuário admin
    const adminData = {
      email: 'admin@siraop.com',
      password: 'admin123',
      nome_completo: 'Administrador SIRAOP',
      matricula: 'ADMIN001',
      telefone: '(11) 99999-9999',
      role: 'admin',
      ativo: true,
    };

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    const adminUser = await usersService.create({
      ...adminData,
      password: hashedPassword,
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Senha:', adminData.password);
    console.log('👤 Nome:', adminUser.nome_completo);
    console.log('🎯 Role:', adminUser.role);

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error);
  } finally {
    await app.close();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  createAdminUser();
}

export { createAdminUser };
