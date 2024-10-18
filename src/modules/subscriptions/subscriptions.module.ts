import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsGateway } from './subscriptions.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionSchema,
} from './entities/subscription.schema';
import { SubscriptionRepository } from './entities/subscription.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsGateway,
    SubscriptionRepository,
  ],
  exports: [SubscriptionsService, SubscriptionRepository],
})
export class SubscriptionsModule {}
