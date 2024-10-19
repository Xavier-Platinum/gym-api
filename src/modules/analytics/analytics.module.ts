import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsGateway } from './analytics.gateway';
import { UsersModule } from '../users/users.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { OrderModule } from '../order/order.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    UsersModule,
    TransactionsModule,
    OrderModule,
    SubscriptionsModule,
    CacheModule.register({ ttl: 600 }),
    // ServicesModule,
  ],
  exports: [AnalyticsService],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsGateway, CacheService],
})
export class AnalyticsModule {}
