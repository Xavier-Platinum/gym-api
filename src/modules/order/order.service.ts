import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, PaginateDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './entities/order.repository';
import { Order } from './entities/order.schema';
import {
  AddonRepository,
  SubscriptionRepository,
} from '../subscriptions/entities/subscription.repository';
import { FilterQuery, Schema } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly subscription: SubscriptionRepository,
    private readonly addons: AddonRepository,
  ) {}

  @OnEvent('order.create')
  async create(payload: CreateOrderDto): Promise<any> {
    // Validate that all subscriptions exist
    // await this.validateSubscriptionsExist(payload.items);

    // const totalAmount = await this.calculateTotalAmount(payload.items);
    const newOrder = await this.orderRepository.create({
      ...payload,
    });

    return {
      statusCode: 201,
      message: 'Order created successfully',
      data: newOrder,
    };
  }

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.orderRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Orders found successfully',
      data,
    };
  }

  private async validateSubscriptionsExist(
    items: Array<{
      subscriptionId: Schema.Types.ObjectId;
      addons: Schema.Types.ObjectId[];
      price: number;
      durationInMonths: number;
      isRecurring: boolean;
    }>,
  ): Promise<void> {
    // Extract all subscription and addon IDs from the items
    const subscriptionIds = items.map((item) => item.subscriptionId);
    const addonIds = items
      .filter((item) => item.addons && item.addons.length > 0) // Filter items that have addons
      .flatMap((item) => item.addons); // Flatten the addon arrays into a single array

    // Fetch all subscriptions and addons that match the given IDs
    const [subscriptions, addons] = await Promise.all([
      this.subscription.byQuery({ _id: { $in: subscriptionIds } }),
      addonIds.length ? this.addons.byQuery({ _id: { $in: addonIds } }) : [], // Fetch addons only if addonIds exist
    ]);

    // Check if any subscription IDs are missing
    if (subscriptions.length !== subscriptionIds.length) {
      throw new NotFoundException('One or more subscriptions do not exist');
    }

    // Check if any addon IDs are missing (only if addons were provided)
    if (addonIds.length && addons.length !== addonIds.length) {
      throw new NotFoundException('One or more addons do not exist');
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
          path: 'items',
          model: 'UserPackage',
          select: '-createdAt -updatedAt',
        },
      ],
    });

    if (!data || !data.data.length) {
      throw new NotFoundException('No orders found');
    }

    return {
      statusCode: 200,
      // message: payload.conditions['$or'][0]['userId']
      //   ? 'My Orders'
      //   : 'Orders found successfully',
      message: 'Orders found successfully',
      data: data,
    };
  }

  async update(id: string, payload: UpdateOrderDto): Promise<Order> {
    return await this.orderRepository.update({ _id: id }, { payload });
  }

  // Calculate the total amount for the order based on subscriptions
  private async calculateTotalAmount(
    items: Array<{
      subscriptionId: Schema.Types.ObjectId;
      addons: Schema.Types.ObjectId[];
      price: number;
      durationInMonths: number;
      isRecurring: boolean;
    }>,
  ): Promise<number> {
    let totalAmount = 0;

    for (const item of items) {
      // Fetch the subscription price
      const subscription = await this.subscription.byQuery({
        _id: item.subscriptionId,
      });

      // Add the subscription price to the total amount
      totalAmount += subscription.price;

      if (item.addons && item.addons.length > 0) {
        // Iterate through addons and fetch their prices
        for (const addonId of item.addons) {
          const addon = await this.addons.byQuery({ _id: addonId });
          totalAmount += addon.price;
        }
      }
    }

    return totalAmount;
  }
}
