import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';


@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get dashboard statistics' })
  @Get('stats')
  getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Get welcome message' })
  @Get('welcome')
  getWelcomeMessage() {
    return this.dashboardService.getWelcomeMessage();
  }
}
