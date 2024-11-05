"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const utils_module_1 = require("./common/utils/utils.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const services_module_1 = require("./common/services/services.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const order_module_1 = require("./modules/order/order.module");
const payments_module_1 = require("./modules/payments/payments.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const axios_1 = require("@nestjs/axios");
const event_emitter_1 = require("@nestjs/event-emitter");
const recommendations_module_1 = require("./modules/recommendations/recommendations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URL'),
                }),
            }),
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            utils_module_1.UtilsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            transactions_module_1.TransactionsModule,
            subscriptions_module_1.SubscriptionsModule,
            services_module_1.ServicesModule,
            notifications_module_1.NotificationsModule,
            order_module_1.OrderModule,
            payments_module_1.PaymentsModule,
            analytics_module_1.AnalyticsModule,
            recommendations_module_1.RecommendationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
