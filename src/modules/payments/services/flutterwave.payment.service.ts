/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PaymentGateway } from '../interface';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwaveService implements PaymentGateway {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async initiatePayment(
    amount: number,
    user: any,
    transactionRef: string,
  ): Promise<any> {
    console.log('initiating flutterwave payment');
    try {
      const url = 'https://api.flutterwave.com/v3/payments';
      const redirectUrl = `${this.configService.get<string>('APP_BASE_URL')}/transactions/verify?transactionRef=${transactionRef}&gateway=Flutterwave`;

      const payload = {
        tx_ref: transactionRef,
        amount: amount,
        currency: 'NGN',
        redirect_url: `http://localhost:8080/transactions/verify?transactionRef=${transactionRef}&gateway=Flutterwave`,
        customer: {
          email: user?.email,
          id: user?.id,
          name: user?.fullName,
          phone_number: user?.phoneNumber,
        },
      };

      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')}`,
          },
        }),
      );
      console.log('flutterwave response', response.data);

      return {
        gateway: 'Flutterwave',
        transactionRef,
        status: 'pending',
        metadata: { ...response.data.data },
      };
    } catch (error) {
      console.error('Flutter error', error.response.data);
    }
  }

  async verifyPayment(transactionRef: string): Promise<any> {
    try {
      const url = `https://api.flutterwave.com/v3/transactions/${transactionRef}/verify`;
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('FLUTTERWAVE_SECRET_KEY')}`,
          },
        }),
      );
      console.log('flutterwave response', response.data);
      return {
        transactionRef,
        status: 'completed',
        metadata: {},
      };
    } catch (error) {
      console.error('Flutter error', error.response.data);
    }
  }
}
