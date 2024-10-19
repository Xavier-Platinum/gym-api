import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';

@Controller('webhook')
export class PaymentsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post('/flutterwave')
  async handleFlutterwave(@Body() body: any) {
    const {
      data: { tx_ref, transaction_id },
    } = body;
    await this.transactionService.verifyTransaction(
      tx_ref,
      'Flutterwave',
      true,
      transaction_id,
    );
    return { status: 'ok' };
  }

  @Post('/paystack')
  async handlePaystack(@Body() body) {
    const {
      data: { reference, transaction_id },
    } = body;
    await this.transactionService.verifyTransaction(
      reference,
      'Paystack',
      true,
      transaction_id,
    );
    return { status: 'ok' };
  }
}
