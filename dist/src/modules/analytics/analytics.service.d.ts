import { CacheService } from '../cache/cache.service';
import { UsersService } from '../users/users.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { OrderService } from '../order/order.service';
import { PackagesService } from '../users/services/packages/packages.service';
export declare class AnalyticsService {
    private readonly usersService;
    private readonly transactionsService;
    private readonly ordersService;
    private readonly subscriptionsService;
    private readonly subscribers;
    private readonly cacheService;
    constructor(usersService: UsersService, transactionsService: TransactionsService, ordersService: OrderService, subscriptionsService: SubscriptionsService, subscribers: PackagesService, cacheService: CacheService);
    private buildOrQuery;
    getAnalytics(filter?: {}, pagination?: {
        page: number;
        limit: number;
        sort: string;
    }): Promise<any>;
}
