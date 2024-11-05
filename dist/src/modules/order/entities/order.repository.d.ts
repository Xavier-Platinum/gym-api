import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { OrderDocument } from './order.schema';
export declare class OrderRepository extends EntityRepository<IModel<OrderDocument>> {
    constructor(model: Model<IModel<OrderDocument>>);
}
