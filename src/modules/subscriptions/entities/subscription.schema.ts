/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IRenewalSettings, ISubscription } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Subscription extends Document implements ISubscription {
  @Prop({ required: false })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  durationInMonths: number;

  @Prop({ type: Object, required: false })
  renewalSettings: IRenewalSettings;

  @Prop({ required: false, default: [] })
  isRecurring: boolean;

  @Prop({ type: [String] })
  services: string[];

  @Prop({ required: false, default: false })
  isArchived: boolean;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export type SubscriptionDocument = Subscription & Document;
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
