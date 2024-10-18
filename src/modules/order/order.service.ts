import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './entities/order.repository';
import { Order } from './entities/order.schema';
import { SubscriptionRepository } from '../subscriptions/entities/subscription.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly subscription: SubscriptionRepository,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const totalAmount = await this.calculateTotalAmount(createOrderDto.items);
    const newOrder = await this.orderRepository.create({
      ...createOrderDto,
      totalAmount,
    });

    return newOrder;
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.byQuery({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, payload: UpdateOrderDto): Promise<Order> {
    return await this.orderRepository.update({ _id: id }, { payload });
  }

  // Calculate the total amount for the order based on subscriptions
  private async calculateTotalAmount(
    items: Array<{ subscriptionId: string; quantity: number }>,
  ): Promise<number> {
    let totalAmount = 0;
    for (const item of items) {
      // Fetch the subscription price (assuming a subscription service exists)
      const subscription = await this.subscription.byQuery({
        _id: item.subscriptionId,
      });
      totalAmount += subscription.price * item.quantity;
    }
    return totalAmount;
  }
}
