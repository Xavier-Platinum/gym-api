import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Addon,
  AddonDocument,
  Subscription,
  SubscriptionDocument,
} from './subscription.schema';

@Injectable()
export class SubscriptionRepository extends EntityRepository<
  IModel<SubscriptionDocument>
> {
  constructor(
    @InjectModel(Subscription.name) model: Model<IModel<SubscriptionDocument>>,
  ) {
    super(model);
  }
}

@Injectable()
export class AddonRepository extends EntityRepository<IModel<AddonDocument>> {
  constructor(@InjectModel(Addon.name) model: Model<IModel<AddonDocument>>) {
    super(model);
  }
}
