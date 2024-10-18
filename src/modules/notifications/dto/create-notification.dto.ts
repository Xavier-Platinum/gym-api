import { Schema } from 'mongoose';

export class CreateNotificationDto {
  userId: Schema.Types.ObjectId;
  title: string;
  body: string;
  type: 'in_app' | 'push' | 'email';
  category: 'promotion' | 'alert' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  scheduledAt?: Date;
}
