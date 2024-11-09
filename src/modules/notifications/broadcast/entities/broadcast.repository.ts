import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BroadcastDocument, Broadcast } from './broadcast.schema';

@Injectable()
export class BroadcastRepository extends EntityRepository<
  IModel<BroadcastDocument>
> {
  constructor(
    @InjectModel(Broadcast.name) model: Model<IModel<BroadcastDocument>>,
  ) {
    super(model);
  }
}
