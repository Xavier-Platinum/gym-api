import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.schema';
import { OrderRepository } from './entities/order.repository';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    SubscriptionsModule,
  ],
  exports: [OrderService, OrderRepository],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
