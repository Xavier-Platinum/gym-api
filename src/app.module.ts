import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './common/utils/utils.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ServicesModule } from './common/services/services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
    // HttpModule.register({
    //   timeout: 5000,
    //   maxRedirects: 5,
    // }),
    UtilsModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    SubscriptionsModule,
    ServicesModule,
    NotificationsModule,
    OrderModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
