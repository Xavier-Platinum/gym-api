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
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly uploadService: CloudinaryService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(payload: CreateSubscriptionDto, image: Express.Multer.File) {
    try {
      const isExists = await this.subscriptionRepository.exists({
        name: payload.name,
      });

      if (isExists) {
        throw new HttpException('Subscription already exists', 409);
      }

      if (payload?.durationInMonths > 12) {
        throw new HttpException('Duration should not exceed 12 months', 400);
      }

      if (payload?.durationInMonths < 1) {
        throw new HttpException(
          'Duration should not be less than 1 month',
          400,
        );
      }

      if (image) {
        const response = await this.uploadService.uploadImage(
          image,
          'subscriptions',
        );

        payload.image = {
          publicId: response.public_id,
          imageValue: response.secure_url,
        };
      }

      const subscription = await this.subscriptionRepository.create({
        ...payload,
      });

      this.eventEmitter.emit('BroadcastNotification', {
        title: 'Subscriptions Notification',
        // body: JSON.stringify({
        //   message: 'New subscriptions added check it out.',
        //   data: {
        //     name: subscription.name,
        //     _id: subscription?._id,
        //     description: subscription?.description,
        //     image: subscription?.image,
        //   },
        // }),
        body: 'New subscriptions added check it out.',
        tag: 'Subscription',
        resourceId: subscription?._id,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subscription created successfully',
        data: {},
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error?.getStatus());
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

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.subscriptionRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Subscriptions found successfully',
      data,
    };
  }

  async findAll(payload: PaginateSubsDto) {
    try {
      payload.conditions = this.buildOrQuery(payload.conditions);

      const data = await this.subscriptionRepository.paginate({
        ...payload,
        // populate: [],
      });

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

  async update(
    id: any,
    payload: UpdateSubscriptionDto,
    image: Express.Multer.File,
  ) {
    try {
      const isExist = await this.subscriptionRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      if (payload?.durationInMonths > 12) {
        throw new HttpException('Duration should not exceed 12 months', 400);
      }

      if (payload?.durationInMonths < 1) {
        throw new HttpException(
          'Duration should not be less than 1 month',
          400,
        );
      }

      if (image) {
        // Deleting old image
        if (isExist?.image && isExist?.image?.publicId) {
          await this.uploadService.deleteImage(isExist?.image?.publicId);
        }

        // Upload new image
        const response = await this.uploadService.uploadImage(
          image,
          'subscriptions',
        );

        payload.image = {
          publicId: response.public_id,
          imageValue: response.secure_url,
        };
      }

      const update = await this.subscriptionRepository.findAndUpdate(
        { _id: id },
        {
          $set: { ...payload },
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
      const isExist = await this.subscriptionRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      await Promise.all([
        await this.subscriptionRepository.update(
          { _id: id },
          {
            isArchived: true,
          },
        ),
        isExist?.image?.publicId &&
          (await this.uploadService.deleteImage(isExist?.image?.publicId)),
      ]);

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
