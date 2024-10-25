import { Schema } from 'mongoose';

export interface ITransaction {
  readonly _id?: Schema.Types.ObjectId | any;
  userId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  amount: number;
  transactionDate: Date;
  transactionRef: string;
  paymentMethod: string;
  paymentGateway: 'Stripe' | 'Paystack' | 'Flutterwave';
  status: string;
  retryAttempts: number;
  isRefunded: boolean;
  paymentMetadata: any;
  refundedAt?: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
