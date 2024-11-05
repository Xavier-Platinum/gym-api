import { Document, Schema as MongooseSchema } from 'mongoose';
import { IOrder } from '../interfaces';
export declare class Order extends Document implements IOrder {
    userId: MongooseSchema.Types.ObjectId;
    items: MongooseSchema.Types.ObjectId[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
}
export type OrderDocument = Order & Document;
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
