import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/core';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: typeof User, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
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
    register(registerDto: RegisterDto): Promise<any>;
    createDefaultAdmin(): Promise<void>;
}
