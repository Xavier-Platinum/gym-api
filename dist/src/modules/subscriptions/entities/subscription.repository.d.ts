import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { AddonDocument, SubscriptionDocument } from './subscription.schema';
export declare class SubscriptionRepository extends EntityRepository<IModel<SubscriptionDocument>> {
    constructor(model: Model<IModel<SubscriptionDocument>>);
}
export declare class AddonRepository extends EntityRepository<IModel<AddonDocument>> {
    constructor(model: Model<IModel<AddonDocument>>);
}
