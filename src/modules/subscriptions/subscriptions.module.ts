import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsGateway } from './subscriptions.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Addon,
  AddonSchema,
  Subscription,
  SubscriptionSchema,
} from './entities/subscription.schema';
import {
  AddonRepository,
  SubscriptionRepository,
} from './entities/subscription.repository';
import { ServicesModule } from 'src/common/services/services.module';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { AddonsController } from './controllers/addons/addons.controller';
import { AddonsService } from './services/addons/addons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Addon.name, schema: AddonSchema },
    ]),
    ServicesModule,
  ],
  controllers: [SubscriptionsController, AddonsController],
  providers: [
    SubscriptionsService,
    SubscriptionsGateway,
    SubscriptionRepository,
    CloudinaryService,
    AddonsService,
    AddonRepository,
  ],
  exports: [
    SubscriptionsService,
    SubscriptionRepository,
    CloudinaryService,
    AddonRepository,
  ],
})
export class SubscriptionsModule {}
