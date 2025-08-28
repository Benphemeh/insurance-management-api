"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const core_1 = require("../core");
let CustomersService = class CustomersService {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async create(createCustomerDto, userId) {
        return this.customerModel.create(Object.assign(Object.assign({}, createCustomerDto), { createdBy: userId }));
    }
    async findAll(page = 1, limit = 10, search) {
        const offset = (page - 1) * limit;
        const whereClause = search
            ? {
                [sequelize_2.Op.or]: [
                    { firstName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { lastName: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { email: { [sequelize_2.Op.iLike]: `%${search}%` } },
                    { phoneNumber: { [sequelize_2.Op.iLike]: `%${search}%` } },
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
    async findOne(id) {
        const customer = await this.customerModel.findByPk(id);
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        const customer = await this.findOne(id);
        return customer.update(updateCustomerDto);
    }
    async remove(id) {
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
                    [sequelize_2.Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
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
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(core_1.Customer)),
    __metadata("design:paramtypes", [Object])
], CustomersService);
//# sourceMappingURL=customers.service.js.map