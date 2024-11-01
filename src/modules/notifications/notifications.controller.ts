import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post()
  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  async create(@Body() payload: CreateNotificationDto) {
    return await this.notificationService.create(payload);
  }

  @Post('/subscribe')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async subscribe(
    @Body('userId') userId: string,
    @Body('fcmToken') fcmToken: string,
  ) {
    return await this.notificationService.subscribeUser(userId, fcmToken);
    return { message: 'User subscribed successfully' };
  }

  @Delete('/unsubscribe/:userId')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async unsubscribe(@Param('userId') userId: string) {
    return await this.notificationService.unsubscribeUser(userId);
    return { message: 'User unsubscribed successfully' };
  }

  @Post('/user/:userId')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
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
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async broadcast(@Body('notification') notification: any) {
    return await this.notificationService.broadcastNotification(notification);
    return { message: 'Broadcast sent to all users' };
  }

  @Put(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async update(@Param('id') id: any, @Body() payload: UpdateNotificationDto) {
    return await this.notificationService.update(id, payload);
  }

  @Get('/user/:userId')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async getUserNotifications(@Param('userId') userId: any) {
    return await this.notificationService.getUserNotifications(userId);
  }

  @Post(':id/retry')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async retryPushNotification(@Param('id') id: any) {
    return await this.notificationService.retryPushNotification(id);
  }
}
