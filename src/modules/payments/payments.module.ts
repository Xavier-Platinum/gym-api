import { forwardRef, Module } from '@nestjs/common';
import { PaymentGatewayFactory } from './gateway.factory';
import { FlutterwaveService } from './services/flutterwave.payment.service';
import { PaystackService } from './services/paystack.payment.service';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from '../transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule, forwardRef(() => TransactionsModule)],
  providers: [FlutterwaveService, PaystackService, PaymentGatewayFactory],
  exports: [PaymentGatewayFactory],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
