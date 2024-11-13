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
    const pkg = await this.userPackageRepository.byID(payload?.package);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + pkg.duration);

    await this.userPackageRepository.findAndUpdate(
      { _id: payload.package },
      {
        $set: {
          status: payload?.status,
          isActive: payload?.status === 'success' ? true : false,
          startDate: startDate,
          endDate: endDate,
        },
      },
    );
  }

  async create(
    payload: CreateSubscribeDto,
    user: Schema.Types.ObjectId,
  ): Promise<any> {
    try {
      payload.paymentGateway = 'Paystack';
      payload.paymentMethod = 'bank_transfer';
      // if (payload.paymentGateway !== 'Paystack') {
      //   throw new HttpException(
      //     'Only Paystack payment gateway is supported',
      //     400,
      //   );
      // }

      if (payload?.item?.duration > 12) {
        throw new HttpException('Duration should not exceed 12 months', 400);
      }

      if (payload?.item?.duration < 1) {
        throw new HttpException(
          'Duration should not be less than 1 month',
          400,
        );
      }

      payload.item.duration = payload.item.duration * 30;

      console.log('Here');

      // const isExist = await this.userPackageRepository.exists({
      //   user: user,
      // });

      // if (isExist) {
      //   const isSubscribed = await this.userPackageRepository.byQuery({
      //     user: user,
      //   });
      //   if (isSubscribed.status === 'pending') {
      //     const order: any = await this.eventEmitter.emitAsync('order.verify', {
      //       _id: isSubscribed?._id,
      //     });

      //     return {
      //       statusCode: HttpStatus.PAYMENT_REQUIRED,
      //       message: 'You have a pending order please proceed to payment',
      //       data: { url: order?.paymentMetaData },
      //     };
      //   }
      // }

      // Validate that all subscriptions exist
      await this.validateSubscriptionsExist(payload.item);

      const totalAmount = await this.calculateTotalAmount(payload.item);

      const ids = await this.saveUserPackages(payload.item, user);

      const orderData = {
        userId: user,
        items: [ids],
        totalAmount: payload?.totalAmount,
        paymentMethod: payload.paymentMethod,
        paymentGateway: payload?.paymentGateway,
      };

      const order: any = await this.eventEmitter.emitAsync(
        'order.create',
        orderData,
      );

      await this.userPackageRepository.update(
        { _id: ids },
        {
          $set: {
            paymentMetaData: order[0].data.url,
          },
        },
      );

      return order[0];
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, error?.getStatus());
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.userPackageRepository.paginate({
      ...pagination,
      conditions: { ...query, isActive: true },
    });

    return {
      statusCode: 200,
      message: 'Subscribers found successfully',
      data,
    };
  }

  async allSubscribers(query: object, pagination: object): Promise<any> {
    const data = await this.userPackageRepository.paginate({
      ...pagination,
      conditions: { ...query, isActive: true },
    });

    return {
      statusCode: 200,
      message: 'Subscribers found successfully',
      data,
    };
  }

  private async validateSubscriptionsExist(items: {
    subscription: Schema.Types.ObjectId[];
    addons: Schema.Types.ObjectId[];
    price?: number;
    duration: number;
    isAutoRenew: boolean;
  }): Promise<void> {
    const [subscriptions, addons] = await Promise.all([
      this.subscriptionRepository.all({
        conditions: { _id: { $in: items.subscription } },
      }),
      items.addons.length
        ? this.addonsRepository.all({
            conditions: { _id: { $in: items.addons } },
          })
        : [], // Fetch addons only if addonIds exist
    ]);

    if (subscriptions.length !== items.subscription.length) {
      throw new NotFoundException('One or more subscriptions do not exist');
    }

    if (items.addons.length && addons.length !== items.addons.length) {
      throw new NotFoundException('One or more addons do not exist');
    }
  }

  private async calculateTotalAmount(items: {
    subscription: Schema.Types.ObjectId[];
    addons: Schema.Types.ObjectId[];
    price?: number;
    duration: number;
    // startDate: Date;
    isAutoRenew: boolean;
  }): Promise<number> {
    let totalAmount = 0;

    for (const item of items.subscription) {
      const subscription = await this.subscriptionRepository.byQuery({
        _id: item,
      });

      totalAmount += subscription.price;

      if (items.addons && items.addons.length > 0) {
        for (const addonId of items.addons) {
          const addon = await this.addonsRepository.byQuery({ _id: addonId });
          totalAmount += addon.price;
        }
      }
    }

    return totalAmount;
  }

  private async saveUserPackages(
    items: {
      subscription: Schema.Types.ObjectId[];
      addons: Schema.Types.ObjectId[];
      price?: number;
      duration: number;
      // startDate: Date;
      isAutoRenew: boolean;
    },
    user: Schema.Types.ObjectId,
  ): Promise<string> {
    // for (const item of items) {
    //     console.log(item);
    // }
    const userPackage = await this.userPackageRepository.create({
      ...items,
      user,
    });
    return userPackage._id;
  }

  async getUserSubscriptions(user: Schema.Types.ObjectId) {
    try {
      const data = await this.userPackageRepository.all({
        conditions: { user },
        sort: '-createdAt',
        populate: [
          // {
          //   path: 'user',
          //   select: '-createdAt -updatedAt',
          // },
          {
            path: 'subscription',
            select: '-createdAt -updatedAt',
          },
          {
            path: 'addons',
            select: '-createdAt -updatedAt',
          },
        ],
        projections: '-user',
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
