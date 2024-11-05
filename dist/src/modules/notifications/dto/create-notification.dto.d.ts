import { Schema } from 'mongoose';
export declare class CreateNotificationDto {
    userId: Schema.Types.ObjectId;
    title: string;
    body: string;
    type: 'general' | 'individual' | 'in_app';
    category?: 'promotion' | 'alert' | 'reminder';
    priority?: 'low' | 'medium' | 'high';
    scheduledAt?: Date;
}
export declare class BroadcastCreateNotificationDto {
    userId?: Schema.Types.ObjectId;
    title: string;
    body: string;
    type?: 'general' | 'individual' | 'in_app';
    category?: 'promotion' | 'alert' | 'reminder';
    priority?: 'low' | 'medium' | 'high';
    scheduledAt?: Date;
}
