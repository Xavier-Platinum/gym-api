import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
export declare class FirebaseService {
    private configService;
    constructor(configService: ConfigService);
    sendNotification(tokens: string[], notification: admin.messaging.MessagingPayload): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingDevicesResponse>;
    subscribeToTopic(fcmToken: string, topic: string): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingTopicManagementResponse>;
    unsubscribeFromTopic(fcmToken: string, topic: string): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingTopicManagementResponse>;
}
