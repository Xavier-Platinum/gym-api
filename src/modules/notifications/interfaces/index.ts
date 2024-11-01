import { Schema } from 'mongoose';

export interface INotification {
  readonly _id: Schema.Types.ObjectId | any;
  userId: Schema.Types.ObjectId | any;
  title: string;
  body: string;
  type: 'general' | 'individual' | 'in_app';
  category: 'promotion' | 'alert' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  status: 'unread' | 'read';
  deliveryStatus: 'pending' | 'delivered' | 'failed';
  retryCount: number;
  scheduledAt?: Date;
  isArchived: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
