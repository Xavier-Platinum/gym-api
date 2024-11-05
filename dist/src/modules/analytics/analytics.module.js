"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const analytics_service_1 = require("./analytics.service");
const analytics_controller_1 = require("./analytics.controller");
const analytics_gateway_1 = require("./analytics.gateway");
const users_module_1 = require("../users/users.module");
const transactions_module_1 = require("../transactions/transactions.module");
const order_module_1 = require("../order/order.module");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
const cache_service_1 = require("../cache/cache.service");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            transactions_module_1.TransactionsModule,
            order_module_1.OrderModule,
            subscriptions_module_1.SubscriptionsModule,
            cache_manager_1.CacheModule.register({ ttl: 600 }),
        ],
        exports: [analytics_service_1.AnalyticsService],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService, analytics_gateway_1.AnalyticsGateway, cache_service_1.CacheService],
    })
], AnalyticsModule);
