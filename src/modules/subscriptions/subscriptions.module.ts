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
import { ServicesModule } from 'src/common/services/services.module';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    ServicesModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsGateway,
    SubscriptionRepository,
    CloudinaryService,
  ],
  exports: [SubscriptionsService, SubscriptionRepository, CloudinaryService],
})
export class SubscriptionsModule {}
