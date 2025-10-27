import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nome_completo: any;
            matricula: any;
            role: any;
        };
    }>;
    register(createUserDto: any): Promise<any>;
    findUserById(id: string): Promise<User>;
    createAdmin(): Promise<{
        message: string;
        user: any;
    }>;
}
