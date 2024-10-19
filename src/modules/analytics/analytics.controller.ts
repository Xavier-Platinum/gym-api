import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
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
}
