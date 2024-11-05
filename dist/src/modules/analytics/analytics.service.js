"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const users_service_1 = require("../users/users.service");
const transactions_service_1 = require("../transactions/transactions.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const order_service_1 = require("../order/order.service");
const packages_service_1 = require("../users/services/packages/packages.service");
let AnalyticsService = class AnalyticsService {
    constructor(usersService, transactionsService, ordersService, subscriptionsService, subscribers, cacheService) {
        this.usersService = usersService;
        this.transactionsService = transactionsService;
        this.ordersService = ordersService;
        this.subscriptionsService = subscriptionsService;
        this.subscribers = subscribers;
        this.cacheService = cacheService;
    }
    async buildOrQuery(conditions) {
        const orConditions = [];
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined) {
                orConditions.push({ [key]: value });
            }
        }
        return orConditions.length > 0 ? { $or: orConditions } : {};
    }
    async getAnalytics(filter = {}, pagination = { page: 1, limit: 10, sort: '-createdAt' }) {
        const query = await this.buildOrQuery(filter);
        const cacheKey = `analytics:${JSON.stringify(query)}:${pagination.page}`;
        let analytics = await this.cacheService.get(cacheKey);
        if (!analytics) {
            const [users, transactions, orders, subscriptions, subscribers] = await Promise.all([
                this.usersService.getAnalytics(query, pagination),
                this.transactionsService.getAnalytics(query, pagination),
                this.ordersService.getAnalytics(query, pagination),
                this.subscriptionsService.getAnalytics(query, pagination),
                this.subscribers.getAnalytics(query, pagination),
            ]);
            analytics = {
                users: {
                    total: users?.data?.total,
                },
                transactions: {
                    total: transactions?.data?.total,
                },
                orders: {
                    total: orders?.data?.total,
                },
                subscriptions: {
                    total: subscriptions?.data?.total,
                },
                subscribers: {
                    total: subscribers?.data?.total,
                },
            };
            await this.cacheService.set(cacheKey, analytics, { ttl: 600 });
        }
        return analytics;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        transactions_service_1.TransactionsService,
        order_service_1.OrderService,
        subscriptions_service_1.SubscriptionsService,
        packages_service_1.PackagesService,
        cache_service_1.CacheService])
], AnalyticsService);
