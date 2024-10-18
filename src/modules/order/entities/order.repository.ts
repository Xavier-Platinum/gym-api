import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument, Order } from './order.schema';

@Injectable()
export class OrderRepository extends EntityRepository<IModel<OrderDocument>> {
  constructor(@InjectModel(Order.name) model: Model<IModel<OrderDocument>>) {
    super(model);
  }
}
