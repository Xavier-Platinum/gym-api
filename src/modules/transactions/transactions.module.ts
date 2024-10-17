import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';
import { TransactionsController } from './transactions.controller';

@Module({
  providers: [TransactionsGateway, TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
