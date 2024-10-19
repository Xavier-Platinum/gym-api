export interface PaymentGateway {
  initiatePayment(
    amount: number,
    userId: string,
    transactionRef: string,
  ): Promise<any>;
  verifyPayment(transactionRef: string): Promise<any>;
}
