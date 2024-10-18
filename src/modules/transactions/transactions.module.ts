import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.schema';
import { TransactionRepository } from './entities/transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  exports: [TransactionsService, TransactionsGateway, TransactionRepository],
  providers: [TransactionsGateway, TransactionsService, TransactionRepository],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
