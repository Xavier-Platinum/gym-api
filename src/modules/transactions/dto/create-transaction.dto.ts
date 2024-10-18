export class CreateTransactionDto {
  userId: any;
  orderId: any;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  paymentGateway: 'Stripe' | 'PayPal' | 'Bank';
}

export class PaginateTransactionDto {
  page?: number;
  limit?: number;
  sort?: string;
  conditions?: object | any;
}
