import { FlutterwaveService } from './services/flutterwave.payment.service';
import { PaystackService } from './services/paystack.payment.service';
export declare class PaymentGatewayFactory {
    private flutterwaveService;
    private paystackService;
    constructor(flutterwaveService: FlutterwaveService, paystackService: PaystackService);
    getGateway(gateway: string): FlutterwaveService | PaystackService;
}
