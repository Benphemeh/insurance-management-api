import { CustomersService } from '../customers/customers.service';
export declare class DashboardService {
    private customersService;
    constructor(customersService: CustomersService);
    getDashboardStats(): Promise<{
        customers: {
            totalCustomers: number;
            activeCustomers: number;
            inactiveCustomers: number;
            newThisMonth: number;
        };
        summary: {
            totalCustomers: number;
            activeCustomers: number;
            newCustomersThisMonth: number;
            inactiveCustomers: number;
        };
        message: string;
    }>;
    getWelcomeMessage(): Promise<{
        message: string;
        timestamp: string;
    }>;
}
