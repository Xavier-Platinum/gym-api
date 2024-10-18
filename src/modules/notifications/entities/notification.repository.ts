import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationRepository extends EntityRepository<
  IModel<NotificationDocument>
> {
  constructor(
    @InjectModel(Notification.name) model: Model<IModel<NotificationDocument>>,
  ) {
    super(model);
  }
}
