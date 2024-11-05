import { Schema } from 'mongoose';
export declare class CreateOrderDto {
    userId: any;
    items: Schema.Types.ObjectId[];
    totalAmount: number;
    paymentMethod: string;
    paymentGateway?: 'Stripe' | 'Paystack' | 'Flutterwave';
}
export declare class PaginateDto {
    page?: number;
    limit?: number;
    sort?: string;
    conditions?: object | any;
}
