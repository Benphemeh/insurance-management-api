import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'src/core';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    return this.customerModel.create({
      ...createCustomerDto,
      createdBy: userId,
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;
    const whereClause = search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phoneNumber: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: customers, count } = await this.customerModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: number) {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: Partial<CreateCustomerDto>) {
    const customer = await this.findOne(id);
    return customer.update(updateCustomerDto);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    await customer.update({ status: 'inactive' });
    return { message: 'Customer deactivated successfully' };
  }

  async getCustomerStats() {
    const totalCustomers = await this.customerModel.count();
    const activeCustomers = await this.customerModel.count({
      where: { status: 'active' },
    });
    const newThisMonth = await this.customerModel.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      newThisMonth,
    };
  }
}
