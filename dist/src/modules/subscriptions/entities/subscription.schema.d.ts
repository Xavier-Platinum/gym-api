import { Document, Schema as MongooseSchema } from 'mongoose';
import { IAddOn, IRenewalSettings, ISubscription } from '../interfaces';
export declare class Subscription extends Document implements ISubscription {
    image: {
        publicId: string;
        imageValue: string;
    };
    type: string;
    name: string;
    description: string;
    price: number;
    durationInMonths: number;
    renewalSettings: IRenewalSettings;
    isRecurring: boolean;
    services: string[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type SubscriptionDocument = Subscription & Document;
export declare const SubscriptionSchema: MongooseSchema<Subscription, import("mongoose").Model<Subscription, any, any, any, Document<unknown, any, Subscription> & Subscription & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscription, Document<unknown, {}, import("mongoose").FlatRecord<Subscription>> & import("mongoose").FlatRecord<Subscription> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare class Addon extends Document implements IAddOn {
    image: {
        publicId: string;
        imageValue: string;
    };
    name: string;
    description: string;
    price: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type AddonDocument = Addon & Document;
export declare const AddonSchema: MongooseSchema<Addon, import("mongoose").Model<Addon, any, any, any, Document<unknown, any, Addon> & Addon & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Addon, Document<unknown, {}, import("mongoose").FlatRecord<Addon>> & import("mongoose").FlatRecord<Addon> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
