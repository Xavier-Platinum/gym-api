import { Document, Schema as MongooseSchema } from 'mongoose';
import { IActivityLog, IRenewal, IUser, IUserPackage, IUserRole } from '../interfaces';
export declare class UserPackage extends Document implements IUserPackage {
    duration: number;
    user: MongooseSchema.Types.ObjectId;
    subscription: MongooseSchema.Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    paymentMetaData: string;
    isAutoRenew: boolean;
    isActive: boolean;
    renewals: IRenewal[];
    addons: MongooseSchema.Types.ObjectId[];
    status: string;
    deletedAt: Date;
}
export type UserPackageDocument = UserPackage & Document;
export declare const UserPackageSchema: MongooseSchema<UserPackage, import("mongoose").Model<UserPackage, any, any, any, Document<unknown, any, UserPackage> & UserPackage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserPackage, Document<unknown, {}, import("mongoose").FlatRecord<UserPackage>> & import("mongoose").FlatRecord<UserPackage> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class User extends Document implements IUser {
    deviceToken: string;
    state: string;
    address: string;
    ProfilePicture: string;
    profilePictureMetaData: any;
    googleId: string;
    confirmed: boolean;
    secretToken: string;
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    authToken: string;
    roles: IUserRole[];
    activityLogs: IActivityLog[];
    status: string;
    aboutMe: Map<string, string>;
    statusReason: string;
    isDeleted: boolean;
    isSuperAdmin: boolean;
    deletedAt: Date;
    createdAt: MongooseSchema.Types.Date;
    updatedAt: MongooseSchema.Types.Date;
}
export type UserDocument = User & Document;
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
