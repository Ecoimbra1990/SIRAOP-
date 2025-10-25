import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nome_completo: user.nome_completo,
        matricula: user.matricula,
        role: user.role,
      },
    };
  }

  async register(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...result } = savedUser as any;
    return result;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }

  async createAdmin() {
    // Verificar se já existe um admin
    const existingAdmin = await this.usersRepository.findOne({ 
      where: { email: 'admin@siraop.com' } 
    });
    
    if (existingAdmin) {
      return { message: 'Usuário admin já existe', user: existingAdmin };
    }

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = this.usersRepository.create({
      email: 'admin@siraop.com',
      password: hashedPassword,
      nome_completo: 'Administrador SIRAOP',
      matricula: 'ADMIN001',
      role: 'admin',
      ativo: true,
    });

    const savedAdmin = await this.usersRepository.save(admin);
    const { password: _, ...result } = savedAdmin as any;
    
    return { 
      message: 'Usuário admin criado com sucesso', 
      user: result 
    };
  }
}
