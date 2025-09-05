import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/core';
import { Op } from 'sequelize';

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

  private generateTokens(user: any) {
    const payload = {
      email: user.email,
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    return {
      status: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        tokens,
      },
    };
  }

 async register(registerDto: RegisterDto) {
    // Fixed: Use proper Sequelize Op.or syntax
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: registerDto.username },
          { email: registerDto.email }
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const user = await this.userModel.create({
      ...registerDto,
      role: registerDto.role || 'user',
    });

    const userJson = user.toJSON();
    const tokens = this.generateTokens(userJson);

    return {
      status: 200,
      success: true,
      message: 'User registered successfully',
      data: {
        user: userJson,
        tokens,
      },
    };
  }

  async createDefaultAdmin() {
    const adminExists = await this.userModel.findOne({
      where: { role: 'admin' },
    });

    if (!adminExists) {
      await this.userModel.create({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        firstName: process.env.DEFAULT_ADMIN_FIRSTNAME,
        lastName: process.env.DEFAULT_ADMIN_LASTNAME,
        role: 'admin',
      });

      await this.userModel.create({
        username: process.env.AOLAYEMI_USERNAME,
        email: process.env.AOLAYEMI_EMAIL,
        password: process.env.AOLAYEMI_PASSWORD,
        firstName: process.env.AOLAYEMI_FIRSTNAME,
        lastName: process.env.AOLAYEMI_LASTNAME,
        role: 'admin',
      });
    }
  }
}
