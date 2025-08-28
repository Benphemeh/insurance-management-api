import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
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
