import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class TransactionRepository extends EntityRepository<
  IModel<TransactionDocument>
> {
  constructor(
    @InjectModel(Transaction.name) model: Model<IModel<TransactionDocument>>,
  ) {
    super(model);
  }
}
