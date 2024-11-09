import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationRepository } from './entities/notification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.schema';
import { ServicesModule } from 'src/common/services/services.module';
import { UsersModule } from '../users/users.module';
import { BroadcastModule } from './broadcast/broadcast.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ServicesModule,
    UsersModule,
    BroadcastModule,
  ],
  exports: [NotificationsService],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
})
export class NotificationsModule {}
