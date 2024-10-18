/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { INotification } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Notification extends Document implements INotification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: MongooseSchema.Types.ObjectId;

  title: string;
  body: string;

  @Prop({
    enum: ['email', 'push', 'in_app'],
    default: 'email',
  })
  type: 'email' | 'push' | 'in_app';

  @Prop({
    enum: ['promotion', 'alert', 'reminder'],
    default: 'promotion',
  })
  category: 'promotion' | 'alert' | 'reminder';

  @Prop({
    enum: ['low', 'medium', 'high'],
    default: 'low',
  })
  priority: 'low' | 'medium' | 'high';

  @Prop({
    enum: ['unread', 'read'],
    default: 'unread',
  })
  status: 'unread' | 'read';

  @Prop({
    enum: ['pending', 'failed', 'delivered'],
    default: 'pending',
  })
  deliveryStatus: 'pending' | 'failed' | 'delivered';

  @Prop({ type: Number, default: 0 })
  retryCount: number;

  @Prop({ type: Date, default: null })
  scheduledAt?: Date;

  @Prop({ type: Boolean, default: false })
  isArchived: boolean;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
