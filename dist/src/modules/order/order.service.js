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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const create_order_dto_1 = require("./dto/create-order.dto");
const order_repository_1 = require("./entities/order.repository");
const subscription_repository_1 = require("../subscriptions/entities/subscription.repository");
const event_emitter_1 = require("@nestjs/event-emitter");
let OrderService = class OrderService {
    constructor(orderRepository, subscription, addons, eventEmitter) {
        this.orderRepository = orderRepository;
        this.subscription = subscription;
        this.addons = addons;
        this.eventEmitter = eventEmitter;
    }
    async verifyTransaction(payload) {
        console.log('Transaction verified', payload);
        const data = await this.orderRepository.findAndUpdate({ _id: payload.orderId }, {
            $set: {
                status: payload?.status,
                paymentMethod: payload?.paymentMethod,
            },
        });
        console.log(data);
        this.eventEmitter.emit('order.verified', {
            package: data.items[0],
            status: data.status,
        });
    }
    async create(payload) {
        try {
            const newOrder = await this.orderRepository.create({
                ...payload,
            });
            const transaction = await this.eventEmitter.emitAsync('transaction.create', {
                userId: payload.userId,
                orderId: newOrder.id,
                amount: payload.totalAmount,
                paymentMethod: payload.paymentMethod,
                paymentGateway: payload.paymentGateway,
            });
            return transaction[0];
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                error,
            };
        }
    }
    async getAnalytics(query, pagination) {
        const data = await this.orderRepository.paginate({
            ...pagination,
            conditions: { ...query },
        });
        return {
            statusCode: 200,
            message: 'Orders found successfully',
            data,
        };
    }
    async validateSubscriptionsExist(items) {
        const subscriptionIds = items.map((item) => item.subscriptionId);
        const addonIds = items
            .filter((item) => item.addons && item.addons.length > 0)
            .flatMap((item) => item.addons);
        const [subscriptions, addons] = await Promise.all([
            this.subscription.byQuery({ _id: { $in: subscriptionIds } }),
            addonIds.length ? this.addons.byQuery({ _id: { $in: addonIds } }) : [],
        ]);
        if (subscriptions.length !== subscriptionIds.length) {
            throw new common_1.NotFoundException('One or more subscriptions do not exist');
        }
        if (addonIds.length && addons.length !== addonIds.length) {
            throw new common_1.NotFoundException('One or more addons do not exist');
        }
    }
    async findById(id) {
        const order = await this.orderRepository.byQuery({ _id: id });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return {
            statusCode: 200,
            message: 'Order found successfully',
            data: order,
        };
    }
    buildOrQuery(conditions) {
        const orConditions = [];
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined) {
                orConditions.push({ [key]: value });
            }
        }
        return orConditions.length > 0 ? { $or: orConditions } : {};
    }
    async findAll(payload) {
        payload.conditions = this.buildOrQuery(payload.conditions);
        const data = await this.orderRepository.paginate({
            ...payload,
            populate: [
                {
                    path: 'userId',
                    model: 'User',
                    select: '-createdAt -updatedAt -password',
                },
                {
                    path: 'items',
                    model: 'UserPackage',
                    select: '-createdAt -updatedAt',
                },
            ],
        });
        if (!data || !data.data.length) {
            throw new common_1.NotFoundException('No orders found');
        }
        return {
            statusCode: 200,
            message: 'Orders found successfully',
            data: data,
        };
    }
    async update(id, payload) {
        return await this.orderRepository.update({ _id: id }, { payload });
    }
    async calculateTotalAmount(items) {
        let totalAmount = 0;
        for (const item of items) {
            const subscription = await this.subscription.byQuery({
                _id: item.subscriptionId,
            });
            totalAmount += subscription.price;
            if (item.addons && item.addons.length > 0) {
                for (const addonId of item.addons) {
                    const addon = await this.addons.byQuery({ _id: addonId });
                    totalAmount += addon.price;
                }
            }
        }
        return totalAmount;
    }
};
exports.OrderService = OrderService;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.verified'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderService.prototype, "verifyTransaction", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderService.prototype, "create", null);
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository,
        subscription_repository_1.SubscriptionRepository,
        subscription_repository_1.AddonRepository,
        event_emitter_1.EventEmitter2])
], OrderService);
