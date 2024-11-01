import { Schema } from 'mongoose';

export class CreateNotificationDto {
  userId: Schema.Types.ObjectId;
  title: string;
  body: string;
  type: 'general' | 'individual' | 'in_app';
  category?: 'promotion' | 'alert' | 'reminder';
  priority?: 'low' | 'medium' | 'high';
  scheduledAt?: Date;
}

export class BroadcastCreateNotificationDto {
  userId?: Schema.Types.ObjectId;
  title: string;
  body: string;
  type?: 'general' | 'individual' | 'in_app';
  category?: 'promotion' | 'alert' | 'reminder';
  priority?: 'low' | 'medium' | 'high';
  scheduledAt?: Date;
}
