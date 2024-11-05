import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
export declare class NotificationsController {
    private readonly notificationService;
    constructor(notificationService: NotificationsService);
    create(payload: CreateNotificationDto): Promise<any>;
    subscribe(userId: string, fcmToken: string): Promise<{
        statusCode: number;
        message: string;
        data: {};
    } | {
        message: string;
    }>;
    unsubscribe(userId: string): Promise<{
        statusCode: number;
        message: string;
        data: {};
    } | {
        message: string;
    }>;
    notifyUser(userId: string, notification: any): Promise<void | {
        message: string;
    }>;
    broadcast(notification: any): Promise<{
        statusCode: number;
        message: string;
    } | {
        message: string;
    }>;
    update(id: any, payload: UpdateNotificationDto): Promise<any>;
    findOne(id: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getUserNotifications(userId: any): Promise<any>;
    retryPushNotification(id: any): Promise<void>;
}
