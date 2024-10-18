/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ITransaction } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Transaction extends Document implements ITransaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Order',
    default: null,
  })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Date, default: null })
  transactionDate: Date;

  @Prop({
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    default: 'credit_card',
  })
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';

  @Prop({
    enum: ['Stripe', 'PayPal', 'Bank'],
    default: 'Stripe',
  })
  paymentGateway: 'Stripe' | 'PayPal' | 'Bank';

  @Prop({
    enum: ['completed', 'pending', 'failed', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  @Prop({ type: Number, default: 0 })
  retryAttempts: number;

  @Prop({ type: Boolean, default: false })
  isRefunded: boolean;

  @Prop({ type: Date, default: null })
  refundedAt?: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
