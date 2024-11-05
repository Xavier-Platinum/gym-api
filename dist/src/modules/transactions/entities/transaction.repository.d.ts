import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { TransactionDocument } from './transaction.schema';
export declare class TransactionRepository extends EntityRepository<IModel<TransactionDocument>> {
    constructor(model: Model<IModel<TransactionDocument>>);
}
