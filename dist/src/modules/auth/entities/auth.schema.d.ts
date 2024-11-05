import { Document, Schema as MongooseSchema } from 'mongoose';
import { IRole } from '../interfaces';
export declare class Role extends Document implements IRole {
    name: string;
    permissions: string[];
    assignedTo: MongooseSchema.Types.ObjectId[];
    isCustom: boolean;
    createdAt: MongooseSchema.Types.Date;
    updatedAt: MongooseSchema.Types.Date;
}
export type RoleDocument = Role & Document;
export declare const RoleSchema: MongooseSchema<Role, import("mongoose").Model<Role, any, any, any, Document<unknown, any, Role> & Role & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Role, Document<unknown, {}, import("mongoose").FlatRecord<Role>> & import("mongoose").FlatRecord<Role> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
