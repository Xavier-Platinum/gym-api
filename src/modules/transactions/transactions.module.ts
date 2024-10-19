import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsGateway } from './transactions.gateway';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.schema';
import { TransactionRepository } from './entities/transaction.repository';
import { PaymentsModule } from '../payments/payments.module';
import { UsersModule } from '../users/users.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
    forwardRef(() => PaymentsModule),
    UsersModule,
    OrderModule,
  ],
  exports: [TransactionsService, TransactionsGateway, TransactionRepository],
  providers: [TransactionsGateway, TransactionsService, TransactionRepository],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
