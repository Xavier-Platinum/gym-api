import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, PaginateDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './entities/order.repository';
import { Order } from './entities/order.schema';
import { SubscriptionRepository } from '../subscriptions/entities/subscription.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly subscription: SubscriptionRepository,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    // Validate that all subscriptions exist
    await this.validateSubscriptionsExist(createOrderDto.items);

    const totalAmount = await this.calculateTotalAmount(createOrderDto.items);
    const newOrder = await this.orderRepository.create({
      ...createOrderDto,
      totalAmount,
    });

    return {
      statusCode: 201,
      message: 'Order created successfully',
      data: newOrder,
    };
  }

  private async validateSubscriptionsExist(
    items: Array<{ subscriptionId: string; quantity: number }>,
  ) {
    const subscriptionIds = items.map((item) => item.subscriptionId);

    // Fetch all subscriptions that match the given IDs
    const subscriptions = await this.subscription.byQuery({
      _id: { $in: subscriptionIds },
    });

    // Check if any subscription IDs are missing
    if (subscriptions.length !== subscriptionIds.length) {
      throw new NotFoundException('One or more subscriptions do not exist');
    }
  }

  async findById(id: string): Promise<Order | any> {
    const order = await this.orderRepository.byQuery({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Order found successfully',
      data: order,
    };
  }

  private buildOrQuery(
    conditions: Partial<Record<string, any>>,
  ): FilterQuery<any> {
    const orConditions = [];

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        orConditions.push({ [key]: value });
      }
    }

    return orConditions.length > 0 ? { $or: orConditions } : {};
  }

  async findAll(payload: PaginateDto): Promise<Order[] | any> {
    payload.conditions = this.buildOrQuery(payload.conditions);

    const data = await this.orderRepository.paginate({
      ...payload,
      populate: [
        {
          path: 'userId',
          model: 'User',
          select: '-createdAt -updatedAt -password',
        },
        {
          path: 'items.subscriptionId',
          model: 'Subscription',
          select: '-createdAt -updatedAt',
        },
      ],
    });

    if (!data || !data.data.length) {
      throw new NotFoundException('No orders found');
    }

    return {
      statusCode: 200,
      message: payload.conditions['$or'][0]['userId']
        ? 'My Orders'
        : 'Orders found successfully',
      data: data.data,
    };
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
