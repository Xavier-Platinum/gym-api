import { Schema } from 'mongoose';

export interface ITransaction {
  readonly _id?: Schema.Types.ObjectId | any;
  userId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  amount: number;
  transactionDate: Date;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  paymentGateway: 'Stripe' | 'PayPal' | 'Bank';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  retryAttempts: number;
  isRefunded: boolean;
  refundedAt?: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
