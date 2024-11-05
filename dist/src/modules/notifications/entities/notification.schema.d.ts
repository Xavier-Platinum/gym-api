import { Document, Schema as MongooseSchema } from 'mongoose';
import { INotification } from '../interfaces';
export declare class Notification extends Document implements INotification {
    resourceUrl: string;
    userId: MongooseSchema.Types.ObjectId;
    title: string;
    body: string;
    type: 'general' | 'individual' | 'in_app';
    category: 'promotion' | 'alert' | 'reminder';
    priority: 'low' | 'medium' | 'high';
    status: 'unread' | 'read';
    deliveryStatus: 'pending' | 'failed' | 'delivered';
    retryCount: number;
    scheduledAt?: Date;
    isArchived: boolean;
}
export type NotificationDocument = Notification & Document;
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
