import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import { User } from 'src/core';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

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

  async findAll(queryDto: QueryUsersDto) {
    const { page, limit, search, role, status } = queryDto;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return {
      status: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          association: 'customers',
          limit: 5,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      status: 200,
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const user = await this.userModel.create({
      ...createUserDto,
      role: createUserDto.role || 'user',
      status: createUserDto.status || 'active',
    });

    const userJson = user.toJSON();
    const tokens = this.generateTokens(userJson);

    return {
      status: 200,
      success: true,
      message: 'User created successfully',
      data: {
        user: userJson,
        tokens,
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username || updateUserDto.email) {
      const whereClause: any = {
        id: { [Op.ne]: id },
        [Op.or]: [],
      };

      if (updateUserDto.username) {
        whereClause[Op.or].push({ username: updateUserDto.username });
      }

      if (updateUserDto.email) {
        whereClause[Op.or].push({ email: updateUserDto.email });
      }

      const existingUser = await this.userModel.findOne({ where: whereClause });

      if (existingUser) {
        throw new ConflictException('Username or email already exists');
      }
    }

    await user.update(updateUserDto);
    return {
      status: 200,
      success: true,
      message: 'User updated successfully',
      data: user.toJSON(),
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update({ status: 'inactive' });
    return {
      status: 200,
      success: true,
      message: 'User deactivated successfully',
    };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isCurrentPasswordValid = await user.comparePassword(changePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    await user.update({ password: changePasswordDto.newPassword });
    return {
      status: 200,
      success: true,
      message: 'Password changed successfully',
    };
  }

  async updateRole(id: string, role: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update({ role });
    return {
      status: 200,
      success: true,
      message: 'User role updated successfully',
      data: user.toJSON(),
    };
  }

  async updateStatus(id: string, status: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update({ status });
    return {
      status: 200,
      success: true,
      message: 'User status updated successfully',
      data: user.toJSON(),
    };
  }

  async getUserStats() {
    const totalUsers = await this.userModel.count();
    const activeUsers = await this.userModel.count({ where: { status: 'active' } });
    const adminUsers = await this.userModel.count({ where: { role: 'admin' } });
    const brokerUsers = await this.userModel.count({ where: { role: 'broker' } });

    const roleDistribution = await this.userModel.findAll({
      attributes: [
        'role',
        [this.userModel.sequelize.fn('COUNT', this.userModel.sequelize.col('role')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    return {
      status: 200,
      success: true,
      message: 'User statistics retrieved successfully',
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        brokerUsers,
        roleDistribution,
      },
    };
  }
}
