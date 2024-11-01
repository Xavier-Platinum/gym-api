import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post()
  async create(@Body() payload: CreateNotificationDto) {
    return await this.notificationService.create(payload);
  }

  @Post('/subscribe')
  async subscribe(
    @Body('userId') userId: string,
    @Body('fcmToken') fcmToken: string,
  ) {
    return await this.notificationService.subscribeUser(userId, fcmToken);
    return { message: 'User subscribed successfully' };
  }

  @Delete('/unsubscribe/:userId')
  async unsubscribe(@Param('userId') userId: string) {
    return await this.notificationService.unsubscribeUser(userId);
    return { message: 'User unsubscribed successfully' };
  }

  @Post('/user/:userId')
  async notifyUser(
    @Param('userId') userId: string,
    @Body('notification') notification: any,
  ) {
    return await this.notificationService.sendNotificationToUser(
      userId,
      notification,
    );
    return { message: 'Notification sent to user' };
  }

  @Post('/broadcast')
  async broadcast(@Body('notification') notification: any) {
    return await this.notificationService.broadcastNotification(notification);
    return { message: 'Broadcast sent to all users' };
  }

  @Put(':id')
  async update(@Param('id') id: any, @Body() payload: UpdateNotificationDto) {
    return await this.notificationService.update(id, payload);
  }

  @Get('/user/:userId')
  async getUserNotifications(@Param('userId') userId: any) {
    return await this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/retry')
  async retryPushNotification(@Param('id') id: any) {
    return await this.notificationService.retryPushNotification(id);
  }
}
