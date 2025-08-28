import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/core';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({
      where: { username, status: 'active' },
    });

    if (user && (await user.comparePassword(password))) {
      await user.update({ lastLoginAt: new Date() });
      return user.toJSON();
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      where: [
        { username: registerDto.username },
        { email: registerDto.email }
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const user = await this.userModel.create({
      ...registerDto,
      role: registerDto.role || 'user',
    });

    return user.toJSON();
  }

  async createDefaultAdmin() {
    const adminExists = await this.userModel.findOne({
      where: { role: 'admin' },
    });

    if (!adminExists) {
      await this.userModel.create({
        username: 'admin',
        email: 'admin@company.com',
        password: 'Admin123!',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
      });
      
      // Also create AOlayemi user from screenshot
      await this.userModel.create({
        username: 'AOlayemi',
        email: 'aolayemi@company.com',
        password: 'Password1',
        firstName: 'A',
        lastName: 'Olayemi',
        role: 'admin',
      });
    }
  }
}
