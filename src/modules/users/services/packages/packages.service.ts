/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Schema } from 'mongoose';
import {
  AddonRepository,
  SubscriptionRepository,
} from 'src/modules/subscriptions/entities/subscription.repository';
import {
  CreateSubscribeDto,
  SubscribeItemDto,
} from '../../dto/create-user.dto';
import { UserPackageRepository } from '../../entities/user.repository';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PackagesService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly addonsRepository: AddonRepository,
    private readonly userPackageRepository: UserPackageRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('order.verified')
  async updatePackageStatus(payload: any): Promise<void> {
    await this.userPackageRepository.findAndUpdate(
      { _id: payload.package },
      {
        $set: { status: payload?.status },
      },
    );
  }

  async create(
    payload: CreateSubscribeDto,
    user: Schema.Types.ObjectId,
  ): Promise<any> {
    try {
      if (payload.paymentGateway !== 'Paystack') {
        throw new HttpException(
          'Only Paystack payment gateway is supported',
          400,
        );
      }

      if (payload?.items.length > 1) {
        throw new HttpException(
          'Only one subscription per package allowed',
          400,
        );
      }

      const isSubscribed = await this.userPackageRepository.exists({
        user: user,
      });

      console.log(isSubscribed);

      if (isSubscribed) {
        throw new HttpException('User already has a subscription', 400);
      }

      // Validate that all subscriptions exist
      await this.validateSubscriptionsExist(payload.items);

      const totalAmount = await this.calculateTotalAmount(payload.items);

      const ids = await this.saveUserPackages(payload.items, user);

      const orderData = {
        userId: user,
        items: ids,
        totalAmount: totalAmount || payload?.totalAmount,
        paymentMethod: payload.paymentMethod,
        paymentGateway: payload?.paymentGateway,
      };

      const order: any = await this.eventEmitter.emitAsync(
        'order.create',
        orderData,
      );

      return order[0];
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, error?.getStatus());
      }
      throw new InternalServerErrorException(error);
    }
  }

  private async validateSubscriptionsExist(
    items: Array<{
      subscription: Schema.Types.ObjectId;
      addons: Schema.Types.ObjectId[];
      price?: number;
      endDate: Date;
      startDate: Date;
      isAutoRenew: boolean;
    }>,
  ): Promise<void> {
    const subscriptionIds = items.map((item) => item.subscription);
    const addonIds = items
      .filter((item) => item.addons && item.addons.length > 0)
      .flatMap((item) => item.addons);

    const [subscriptions, addons] = await Promise.all([
      this.subscriptionRepository.all({
        conditions: { _id: { $in: subscriptionIds } },
      }),
      addonIds.length
        ? this.addonsRepository.all({ conditions: { _id: { $in: addonIds } } })
        : [], // Fetch addons only if addonIds exist
    ]);

    if (subscriptions.length !== subscriptionIds.length) {
      throw new NotFoundException('One or more subscriptions do not exist');
    }

    if (addonIds.length && addons.length !== addonIds.length) {
      throw new NotFoundException('One or more addons do not exist');
    }
  }

  private async calculateTotalAmount(
    items: Array<{
      subscription: Schema.Types.ObjectId;
      addons: Schema.Types.ObjectId[];
      price?: number;
      endDate: Date;
      startDate: Date;
      isAutoRenew: boolean;
    }>,
  ): Promise<number> {
    let totalAmount = 0;

    for (const item of items) {
      const subscription = await this.subscriptionRepository.byQuery({
        _id: item.subscription,
      });

      totalAmount += subscription.price;

      if (item.addons && item.addons.length > 0) {
        for (const addonId of item.addons) {
          const addon = await this.addonsRepository.byQuery({ _id: addonId });
          totalAmount += addon.price;
        }
      }
    }

    return totalAmount;
  }

  private async saveUserPackages(
    items: Array<{
      subscription: Schema.Types.ObjectId;
      addons: Schema.Types.ObjectId[];
      price?: number;
      endDate: Date;
      startDate: Date;
      isAutoRenew: boolean;
    }>,
    user: Schema.Types.ObjectId,
  ): Promise<string[]> {
    // for (const item of items) {
    //     console.log(item);
    // }
    const packageIds = await Promise.all(
      items.map(async (item) => {
        const userPackage = await this.userPackageRepository.create({
          ...item,
          user,
        });
        return userPackage._id;
      }),
    );
    return packageIds;
  }

  async getUserSubscriptions(user: Schema.Types.ObjectId) {
    try {
      const data = await this.userPackageRepository.all({
        conditions: { user },
        sort: '-createdAt',
        populate: [
          {
            path: 'user',
            select: '-createdAt -updatedAt',
          },
          {
            path: 'subscription',
            select: '-createdAt -updatedAt',
          },
          {
            path: 'addons',
            select: '-createdAt -updatedAt',
          },
        ],
      });

      if (!data || !data.length) {
        throw new NotFoundException('No subscriptions found');
      }

      return {
        statusCode: 200,
        message: 'User subscriptions retrieved successfully',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
