import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserPackage,
  UserPackageDocument,
} from './user.schema';

@Injectable()
export class UserRepository extends EntityRepository<IModel<UserDocument>> {
  constructor(@InjectModel(User.name) model: Model<IModel<UserDocument>>) {
    super(model);
  }
}

@Injectable()
export class UserPackageRepository extends EntityRepository<
  IModel<UserPackageDocument>
> {
  constructor(
    @InjectModel(UserPackage.name) model: Model<IModel<UserPackageDocument>>,
  ) {
    super(model);
  }
}
