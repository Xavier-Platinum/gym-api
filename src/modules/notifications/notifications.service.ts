/* eslint-disable @typescript-eslint/no-unused-vars */
import { chunk } from 'lodash';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  BroadcastCreateNotificationDto,
  CreateNotificationDto,
} from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './entities/notification.repository';
import * as admin from 'firebase-admin';
import { Notification } from './entities/notification.schema';
import { FirebaseService } from 'src/common/services/firebase/firebase.service';
import { UserRepository } from '../users/entities/user.repository';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly firebaseService: FirebaseService,
    private readonly userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {
    // admin.initializeApp({
    //   credential: admin.credential.applicationDefault(),
    // });
  }

  private readonly BATCH_SIZE = 500;

  @OnEvent('sendNotification')
  async sendNotification(payload: CreateNotificationDto) {
    try {
      const userSubscription = await this.userRepository.byQuery({
        _id: payload?.userId,
      });
      if (!userSubscription || !userSubscription.deviceToken) {
        throw new HttpException('User not subscribed', HttpStatus.BAD_REQUEST);
      }
      const notification = await this.notificationRepository.create(payload);
      await this.firebaseService.sendNotification([userSubscription.fcmToken], {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        // priority: payload.priority,
      });
      return {
        statusCode: 201,
        message: 'Notification created successfully',
        data: notification,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new HttpException(error?.message, 400);
    }
  }

  @OnEvent('sendBroadcast')
  async handleBroadcastEvent(notification: BroadcastCreateNotificationDto) {
    try {
      const allUsers = await this.userRepository.byQuery({}, [
        'deviceToken',
        '_id',
      ]);
      const validTokens = allUsers
        .map((user) => user.deviceToken)
        .filter((token) => token && token.trim().length > 0);

      if (validTokens.length === 0) {
        throw new HttpException(
          'No valid device tokens found',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Split device tokens into manageable batches
      const tokenBatches = chunk(validTokens, this.BATCH_SIZE);

      // Send each batch in sequence
      for (const batch of tokenBatches) {
        await this.firebaseService.sendNotification(batch, {
          notification: {
            title: notification.title,
            body: notification.body,
          },
        });
        console.log(`Sent batch with ${batch.length} notifications.`);
      }

      console.log(
        `Broadcast notifications sent to ${validTokens.length} users.`,
      );
    } catch (error) {
      console.error('Error sending broadcast notifications:', error);
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @OnEvent('BroadcastNotification')
  async BroadcastSendBroadcast(payload: CreateNotificationDto) {
    await this.createBroadcastNotification(payload);
  }

  // Create and schedule a notification
  async create(
    payload: CreateNotificationDto,
  ): Promise<Notification | Error | any> {
    try {
      const userSubscription = await this.userRepository.byQuery({
        _id: payload?.userId,
      });
      if (!userSubscription || !userSubscription.deviceToken) {
        throw new HttpException('User not subscribed', HttpStatus.BAD_REQUEST);
      }
      const notification = await this.notificationRepository.create(payload);
      await this.firebaseService.sendNotification([userSubscription.fcmToken], {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        // priority: payload.priority,
      });
      return {
        statusCode: 201,
        message: 'Notification created successfully',
        data: notification,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new HttpException(error?.message, 400);
    }
  }

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.notificationRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Notifications found successfully',
      data,
    };
  }

  async subscribeUser(userId: string, fcmToken: string) {
    try {
      const existingSubscription = await this.userRepository.byQuery({
        _id: userId,
      });

      if (existingSubscription || !existingSubscription?.deviceToken) {
        throw new HttpException('User already subscribed', 400);
      }

      await this.userRepository.findAndUpdate(
        { _id: userId },
        {
          $set: {
            deviceToken: fcmToken,
          },
        },
      );

      return {
        statusCode: 200,
        message: 'User subscribed successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  async unsubscribeUser(userId: string) {
    try {
      const existingSubscription = await this.userRepository.byQuery({
        _id: userId,
      });

      if (!existingSubscription) {
        throw new HttpException('User not subscribed', 400);
      }

      await this.userRepository.findAndUpdate(
        { _id: userId },
        {
          $set: {
            deviceToken: '',
          },
        },
      );

      return {
        statusCode: 200,
        message: 'User subscribed successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  async createBroadcastNotification(
    notificationData: BroadcastCreateNotificationDto,
  ) {
    try {
      notificationData.type = 'general';
      const allUsers = await this.userRepository.byQuery({}, [
        'deviceToken',
        '_id',
      ]);

      // Create individual notifications for each user
      allUsers.map(async (user) => {
        await this.notificationRepository.create({
          userId: user._id,
          title: notificationData.title,
          body: notificationData.body,
          type: notificationData.type,
          // status: false,
          // createdAt: new Date(),
        });
      });

      // Emit an event to trigger the batch FCM push notifications
      this.eventEmitter.emit('sendBroadcast', notificationData);

      return {
        statusCode: 201,
        message: 'Broadcast notification created and saved to each user',
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error?.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retry sending a failed push notification
  async retryPushNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.notificationRepository.byQuery({
        _id: notificationId,
      });
      if (!notification) {
        throw new Error('Notification not found');
      }

      if (
        notification.type === 'push' &&
        notification.deliveryStatus === 'failed'
      ) {
        const message = {
          token: 'USER_DEVICE_TOKEN', // Retrieve user token
          notification: {
            title: notification.title,
            body: notification.body,
          },
        };

        try {
          await this.firebaseService.sendNotification([message.token], {
            notification: {
              ...message.notification,
            },
          });
          notification.deliveryStatus = 'delivered';
        } catch (error) {
          notification.retryCount += 1;
          if (notification.retryCount >= 3) {
            notification.deliveryStatus = 'failed';
          }
        }

        await notification.save();
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  async sendNotificationToUser(userId: string, notificationData: any) {
    try {
      const userSubscription = await this.userRepository.byQuery({
        _id: userId,
      });
      if (!userSubscription) {
        throw new HttpException('User not subscribed', HttpStatus.BAD_REQUEST);
      }
      await this.firebaseService.sendNotification(
        [userSubscription.fcmToken],
        notificationData,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  // Send push notification using Firebase Cloud Messaging (FCM)
  async sendPushNotification(
    userToken: string,
    title: string,
    body: string,
  ): Promise<void> {
    const message = {
      token: userToken,
      notification: {
        title,
        body,
      },
    };

    try {
      await this.firebaseService.sendNotification([message.token], {
        notification: {
          ...message.notification,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  // Retrieve a user's notifications
  async getUserNotifications(userId: any): Promise<any> {
    try {
      const data = await this.notificationRepository.byQuery({
        userId,
        isArchived: false,
      });

      return {
        statusCode: 200,
        message: 'User notifications',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  // Update a notification (e.g., mark as read, archive)
  async update(
    notificationId: any,
    payload: UpdateNotificationDto,
  ): Promise<any> {
    try {
      await this.notificationRepository.findAndUpdate(
        { _id: notificationId },
        { $set: { ...payload } },
      );

      return {
        statusCode: 200,
        message: 'Updated successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }

  async findOne(id: any) {
    try {
      const data = await this.notificationRepository.byQuery(
        { _id: id },
        null,
        null,
        [
          {
            path: 'userId',
            select: '',
          },
        ],
      );

      if (!data) throw new HttpException('No notification', 400);

      await this.notificationRepository.findAndUpdate(
        { _id: id },
        {
          $set: {
            status: 'read',
          },
        },
      );

      data.status = 'read';

      return {
        statusCode: 200,
        message: 'Single notification',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      // throw new InternalServerErrorException();
      throw new HttpException(error?.message, 400);
    }
  }
}
