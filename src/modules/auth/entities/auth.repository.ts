import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './auth.schema';

@Injectable()
export class RoleRepository extends EntityRepository<IModel<RoleDocument>> {
  constructor(@InjectModel(Role.name) model: Model<IModel<RoleDocument>>) {
    super(model);
  }
}
