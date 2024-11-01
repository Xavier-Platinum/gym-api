import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(configService.get<any>('SERVICE_ACCOUNT_KEY')),
      ),
    });
  }

  async sendNotification(
    tokens: string[],
    notification: admin.messaging.MessagingPayload,
  ) {
    return admin.messaging().sendToDevice(tokens, notification);
  }

  async subscribeToTopic(fcmToken: string, topic: string) {
    return admin.messaging().subscribeToTopic([fcmToken], topic);
  }

  async unsubscribeFromTopic(fcmToken: string, topic: string) {
    return admin.messaging().unsubscribeFromTopic([fcmToken], topic);
  }
}
