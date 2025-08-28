import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
        access_token: string;
    }>;
    getProfile(req: any): any;
}
