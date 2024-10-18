export class CreateOrderDto {
  userId: any;
  items: Array<{
    subscriptionId: string;
    quantity: number;
  }>;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}
