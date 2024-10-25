/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IOrder } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Order extends Document implements IOrder {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'UserPackage',
    // default: null,
    required: true,
  })
  items: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  @Prop({
    enum: [
      'abandoned',
      'failed',
      'ongoing',
      'pending',
      'processing',
      'queued',
      'reversed',
      'success',
    ],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: String,
    default: '',
  })
  paymentMethod: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
