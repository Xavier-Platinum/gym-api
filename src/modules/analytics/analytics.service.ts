import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { OrderService } from '../order/order.service';
import { FilterQuery } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly ordersService: OrderService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly cacheService: CacheService,
  ) {}

  private async buildOrQuery(
    conditions: Partial<Record<string, any>>,
  ): Promise<FilterQuery<any>> {
    const orConditions = [];

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        orConditions.push({ [key]: value });
      }
    }

    return orConditions.length > 0 ? { $or: orConditions } : {};
  }

  async getAnalytics(
    filter = {},
    pagination = { page: 1, limit: 10, sort: '-createdAt' },
  ) {
    const query = await this.buildOrQuery(filter);
    const cacheKey = `analytics:${JSON.stringify(query)}:${pagination.page}`;
    let analytics = await this.cacheService.get(cacheKey);

    if (!analytics) {
      const [users, transactions, orders, subscriptions] = await Promise.all([
        this.usersService.getAnalytics(query, pagination),
        this.transactionsService.getAnalytics(query, pagination),
        this.ordersService.getAnalytics(query, pagination),
        this.subscriptionsService.getAnalytics(query, pagination),
      ]);

      analytics = {
        users,
        transactions,
        orders,
        subscriptions,
      };

      await this.cacheService.set(cacheKey, analytics, { ttl: 600 });
    }

    return analytics;
  }
}