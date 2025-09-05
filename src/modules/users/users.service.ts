import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
  ) {}

  async findAll(queryDto: QueryUsersDto) {
    const { page, limit, search, role, status } = queryDto;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Search by username, email, firstName, or lastName
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
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: number) {
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

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // Check if username or email already exists
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

    return user.toJSON();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if username or email is being changed and already exists
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
    return user.toJSON();
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Instead of hard delete, set status to inactive
    await user.update({ status: 'inactive' });
    return { message: 'User deactivated successfully' };
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(changePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Update password (will be hashed by beforeUpdate hook)
    await user.update({ password: changePasswordDto.newPassword });
    return { message: 'Password changed successfully' };
  }

  async updateRole(id: number, role: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update({ role });
    return user.toJSON();
  }

  async updateStatus(id: number, status: string) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await user.update({ status });
    return user.toJSON();
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
      totalUsers,
      activeUsers,
      adminUsers,
      brokerUsers,
      roleDistribution,
    };
  }
}
