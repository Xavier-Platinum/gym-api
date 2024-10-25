import { Schema } from 'mongoose';

export interface IOrder {
  readonly _id?: Schema.Types.ObjectId | any;
  userId: Schema.Types.ObjectId;
  items: Array<Schema.Types.ObjectId>;
  totalAmount: number;
  status: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
