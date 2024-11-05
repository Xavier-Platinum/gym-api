import { CreateOrderDto, PaginateDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './entities/order.repository';
import { Order } from './entities/order.schema';
import { AddonRepository, SubscriptionRepository } from '../subscriptions/entities/subscription.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class OrderService {
    private readonly orderRepository;
    private readonly subscription;
    private readonly addons;
    private eventEmitter;
    constructor(orderRepository: OrderRepository, subscription: SubscriptionRepository, addons: AddonRepository, eventEmitter: EventEmitter2);
    verifyTransaction(payload: any): Promise<void>;
    create(payload: CreateOrderDto): Promise<any>;
    getAnalytics(query: object, pagination: object): Promise<any>;
    private validateSubscriptionsExist;
    findById(id: string): Promise<Order | any>;
    private buildOrQuery;
    findAll(payload: PaginateDto): Promise<Order[] | any>;
    update(id: string, payload: UpdateOrderDto): Promise<Order>;
    private calculateTotalAmount;
}
