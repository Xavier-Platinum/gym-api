import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PackagesService } from '../users/services/packages/packages.service';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly subscribers: PackagesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async getAnalytics(
    @Query('filter') filter: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = '-createdAt',
  ) {
    const analytics = await this.analyticsService.getAnalytics(filter, {
      page,
      limit,
      sort,
    });
    return {
      statusCode: 200,
      message: 'Analytics fetched successfully',
      data: analytics,
    };
  }

  @Get('/subscribers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async getAllSubscribers(
    @Query('filter') filter: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = '-createdAt',
  ) {
    const analytics = await this.subscribers.allSubscribers(filter, {
      page,
      limit,
      sort,
    });
    return {
      statusCode: 200,
      message: 'Analytics fetched successfully',
      data: analytics,
    };
  }
}
