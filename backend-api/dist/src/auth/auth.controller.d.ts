import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nome_completo: any;
            matricula: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<any>;
    createAdmin(): Promise<{
        message: string;
        user: any;
    }>;
}
