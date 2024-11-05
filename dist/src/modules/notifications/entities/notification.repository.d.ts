import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { NotificationDocument } from './notification.schema';
export declare class NotificationRepository extends EntityRepository<IModel<NotificationDocument>> {
    constructor(model: Model<IModel<NotificationDocument>>);
}
