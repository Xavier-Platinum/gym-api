import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { RoleDocument } from './auth.schema';
export declare class RoleRepository extends EntityRepository<IModel<RoleDocument>> {
    constructor(model: Model<IModel<RoleDocument>>);
}
