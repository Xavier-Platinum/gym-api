/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRepository } from './entities/notification.repository';
import * as admin from 'firebase-admin';
import { Notification } from './entities/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  // Create and schedule a notification
  async create(payload: CreateNotificationDto): Promise<Notification | Error> {
    const notification = await this.notificationRepository.create(payload);
    return await notification.save();
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

  // Retry sending a failed push notification
  async retryPushNotification(notificationId: string): Promise<void> {
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
        await admin.messaging().send(message);
        notification.deliveryStatus = 'delivered';
      } catch (error) {
        notification.retryCount += 1;
        if (notification.retryCount >= 3) {
          notification.deliveryStatus = 'failed';
        }
      }

      await notification.save();
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
      await admin.messaging().send(message);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Retrieve a user's notifications
  async getUserNotifications(userId: any): Promise<Notification[]> {
    return await this.notificationRepository.byQuery({
      userId,
      isArchived: false,
    });
  }

  // Update a notification (e.g., mark as read, archive)
  async update(
    notificationId: any,
    payload: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationRepository.update(
      { _id: notificationId },
      { payload },
    );
  }
}
