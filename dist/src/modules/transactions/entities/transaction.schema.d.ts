import { Document, Schema as MongooseSchema } from 'mongoose';
import { ITransaction } from '../interfaces';
export declare class Transaction extends Document implements ITransaction {
    userId: MongooseSchema.Types.ObjectId;
    orderId: MongooseSchema.Types.ObjectId;
    amount: number;
    transactionDate: Date;
    paymentMethod: string;
    paymentGateway: 'Stripe' | 'Paystack' | 'Flutterwave';
    transactionRef: string;
    transaction_id: string;
    status: string;
    retryAttempts: number;
    paymentMetadata: any;
    isRefunded: boolean;
    webhookVerified: boolean;
    refundedAt?: Date;
}
export type TransactionDocument = Transaction & Document;
export declare const TransactionSchema: MongooseSchema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction> & Transaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
