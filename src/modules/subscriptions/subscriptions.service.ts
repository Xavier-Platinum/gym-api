import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSubscriptionDto,
  PaginateSubsDto,
} from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionRepository } from './entities/subscription.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}
  async create(payload: CreateSubscriptionDto) {
    try {
      const isExists = await this.subscriptionRepository.exists({
        name: payload.name,
      });

      if (isExists) {
        throw new HttpException('Subscription already exists', 409);
      }

      await this.subscriptionRepository.create({ ...payload });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subscription created successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
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

  async findAll(payload: PaginateSubsDto) {
    try {
      payload.conditions = this.buildOrQuery(payload.conditions);

      const data = await this.subscriptionRepository.paginate({
        ...payload,
        // populate: [],
      });

      console.log(data);

      if (!data || !data.data.length) {
        throw new NotFoundException('No subscriptions found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscriptions found successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: any) {
    try {
      const sub = await this.subscriptionRepository.byQuery(
        {
          _id: id,
        },
        null,
        null,
        [],
        '-createdAt',
      );

      if (!sub) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription found successfully',
        data: sub,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: any, payload: UpdateSubscriptionDto) {
    try {
      const isExist = await this.subscriptionRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      const update = await this.subscriptionRepository.update(
        { _id: id },
        {
          payload,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription updated successfully',
        data: update,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: any) {
    try {
      const isExist = await this.subscriptionRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      await this.subscriptionRepository.update(
        { _id: id },
        {
          isArchived: true,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription deleted successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
