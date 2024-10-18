import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
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

  @Put(':id')
  async update(@Param('id') id: any, @Body() payload: UpdateNotificationDto) {
    return await this.notificationService.update(id, payload);
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: any) {
    return await this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/retry')
  async retryPushNotification(@Param('id') id: any) {
    return await this.notificationService.retryPushNotification(id);
  }
}
