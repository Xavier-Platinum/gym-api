import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsGateway } from './subscriptions.gateway';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsGateway],
})
export class SubscriptionsModule {}
