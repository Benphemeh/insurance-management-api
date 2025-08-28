import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<import("../core").Customer>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        customers: import("../core").Customer[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    getStats(): Promise<{
        totalCustomers: number;
        activeCustomers: number;
        inactiveCustomers: number;
        newThisMonth: number;
    }>;
    findOne(id: string): Promise<import("../core").Customer>;
    update(id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<import("../core").Customer>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
