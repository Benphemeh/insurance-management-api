import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from 'src/core';
export declare class CustomersService {
    private customerModel;
    constructor(customerModel: typeof Customer);
    create(createCustomerDto: CreateCustomerDto, userId: number): Promise<Customer>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        customers: Customer[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    findOne(id: number): Promise<Customer>;
    update(id: number, updateCustomerDto: Partial<CreateCustomerDto>): Promise<Customer>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getCustomerStats(): Promise<{
        totalCustomers: number;
        activeCustomers: number;
        inactiveCustomers: number;
        newThisMonth: number;
    }>;
}
