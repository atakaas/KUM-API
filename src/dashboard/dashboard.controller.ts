import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data retrieved successfully' })
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('staff')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Get staff dashboard data' })
  @ApiResponse({ status: 200, description: 'Staff dashboard data retrieved successfully' })
  getStaffDashboard(@Request() req) {
    return this.dashboardService.getStaffDashboard(req.user.id);
  }
}
