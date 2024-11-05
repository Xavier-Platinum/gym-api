import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from '../interface';
import { ConfigService } from '@nestjs/config';
export declare class FlutterwaveService implements PaymentGateway {
    private readonly httpService;
    private configService;
    constructor(httpService: HttpService, configService: ConfigService);
    initiatePayment(amount: number, user: any, transactionRef: string): Promise<any>;
    verifyPayment(transactionRef: string): Promise<any>;
}
