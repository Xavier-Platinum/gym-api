/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from '../interface';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackService implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async initiatePayment(
    amount: number,
    user: any,
    transactionRef: string,
  ): Promise<any> {
    const url = 'https://api.paystack.co/transaction/initialize';
    const payload = {
      reference: transactionRef,
      amount: amount * 100,
      email: user?.email,
      redirect_url: `http://localhost:8080/transactions/verify?transactionRef=${transactionRef}&gateway=Paystack`,
    };

    const response = await lastValueFrom(
      this.httpService.post(url, payload, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
        },
      }),
    );

    console.log(response.data);

    return {
      gateway: 'Paystack',
      transactionRef,
      status: 'pending',
      metadata: { ...response.data },
    };
  }

  async verifyPayment(transactionRef: string): Promise<any> {
    const url = `https://api.paystack.co/transaction/verify/${transactionRef}`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
        },
      }),
    );

    // console.log(response.data);

    return {
      transactionRef,
      status:
        response.data.data.status === 'abandoned'
          ? 'failed'
          : response.data.data.status,
      metadata: {},
    };
  }
}
