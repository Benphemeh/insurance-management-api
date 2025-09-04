import { Injectable } from '@nestjs/common';
import { CustomersService } from '../modules/customers/customers.service';

@Injectable()
export class DashboardService {
  constructor(private customersService: CustomersService) {}

  async getDashboardStats() {
    const customerStats = await this.customersService.getCustomerStats();

    return {
      customers: customerStats,
      summary: {
        totalCustomers: customerStats.totalCustomers,
        activeCustomers: customerStats.activeCustomers,
        newCustomersThisMonth: customerStats.newThisMonth,
        inactiveCustomers: customerStats.inactiveCustomers,
      },
      message: "There are no dashboards to display.",
    };
  }

  async getWelcomeMessage() {
    return {
      message: "There are no dashboards to display.",
      timestamp: new Date().toISOString(),
    };
  }
}
