import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { UserDocument, UserPackageDocument } from './user.schema';
export declare class UserRepository extends EntityRepository<IModel<UserDocument>> {
    constructor(model: Model<IModel<UserDocument>>);
}
export declare class UserPackageRepository extends EntityRepository<IModel<UserPackageDocument>> {
    constructor(model: Model<IModel<UserPackageDocument>>);
}
