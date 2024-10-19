import { Injectable } from '@nestjs/common';
import { FlutterwaveService } from './services/flutterwave.payment.service';
import { PaystackService } from './services/paystack.payment.service';

@Injectable()
export class PaymentGatewayFactory {
  constructor(
    private flutterwaveService: FlutterwaveService,
    private paystackService: PaystackService,
  ) {}

  getGateway(gateway: string) {
    switch (gateway) {
      case 'Flutterwave':
        return this.flutterwaveService;
      case 'Paystack':
        return this.paystackService;
      default:
        throw new Error('Unsupported payment gateway');
    }
  }
}
