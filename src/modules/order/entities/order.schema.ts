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
    type: [
      {
        subscriptionId: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Subscription',
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  })
  items: { subscriptionId: string; quantity: number }[];

  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  @Prop({
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'failed' | 'cancelled';

  @Prop({
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    default: 'credit_card',
  })
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
