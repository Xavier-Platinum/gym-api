/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IBroadcast } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Broadcast extends Document implements IBroadcast {
  readStatus: {
    userId: MongooseSchema.Types.ObjectId;
    read: boolean;
    readAt?: Date;
  }[];

  @Prop({ type: String })
  resourceUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  adminId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: null })
  userIds: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  message: string;

  @Prop({
    enum: ['system', 'promotion', 'announcement'],
    default: 'system',
  })
  type: 'system' | 'promotion' | 'announcement';

  @Prop({
    enum: ['all', 'premium', 'specific_users'],
    default: 'all',
  })
  targetAudience: 'all' | 'premium' | 'specific_users';

  @Prop({
    enum: ['low', 'medium', 'high'],
    default: 'low',
  })
  priority: 'low' | 'medium' | 'high';

  @Prop({
    enum: ['draft', 'delivered', 'failed'],
    default: 'draft',
  })
  status: 'draft' | 'scheduled' | 'sent';

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

export type BroadcastDocument = Broadcast & Document;
export const BroadcastSchema = SchemaFactory.createForClass(Broadcast);
