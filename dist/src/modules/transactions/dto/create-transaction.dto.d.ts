export declare class CreateTransactionDto {
    userId?: any;
    orderId: any;
    amount: number;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
    paymentGateway: 'Stripe' | 'Paystack' | 'Flutterwave';
}
export declare class PaginateTransactionDto {
    page?: number;
    limit?: number;
    sort?: string;
    conditions?: object | any;
}
