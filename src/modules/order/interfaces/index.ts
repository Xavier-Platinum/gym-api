import { Schema } from 'mongoose';

export interface IOrder {
  readonly _id?: Schema.Types.ObjectId | any;
  userId: Schema.Types.ObjectId;
  items: Array<{
    subscriptionId: string;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
