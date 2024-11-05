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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const subscription_repository_1 = require("../../../subscriptions/entities/subscription.repository");
const user_repository_1 = require("../../entities/user.repository");
const event_emitter_1 = require("@nestjs/event-emitter");
let PackagesService = class PackagesService {
    constructor(subscriptionRepository, addonsRepository, userPackageRepository, eventEmitter) {
        this.subscriptionRepository = subscriptionRepository;
        this.addonsRepository = addonsRepository;
        this.userPackageRepository = userPackageRepository;
        this.eventEmitter = eventEmitter;
    }
    async updatePackageStatus(payload) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 30);
        await this.userPackageRepository.findAndUpdate({ _id: payload.package }, {
            $set: {
                status: payload?.status,
                isActive: payload?.status === 'success' ? true : false,
                startDate: startDate,
                endDate: endDate,
            },
        });
    }
    async create(payload, user) {
        try {
            payload.paymentGateway = 'Paystack';
            payload.paymentMethod = 'bank_transfer';
            console.log('Here');
            await this.validateSubscriptionsExist(payload.item);
            const totalAmount = await this.calculateTotalAmount(payload.item);
            const ids = await this.saveUserPackages(payload.item, user);
            const orderData = {
                userId: user,
                items: [ids],
                totalAmount: payload?.totalAmount,
                paymentMethod: payload.paymentMethod,
                paymentGateway: payload?.paymentGateway,
            };
            const order = await this.eventEmitter.emitAsync('order.create', orderData);
            await this.userPackageRepository.update({ _id: ids }, {
                $set: {
                    paymentMetaData: order[0].data.url,
                },
            });
            return order[0];
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, error?.getStatus());
            }
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async getAnalytics(query, pagination) {
        const data = await this.userPackageRepository.paginate({
            ...pagination,
            conditions: { ...query, isActive: true },
        });
        return {
            statusCode: 200,
            message: 'Subscribers found successfully',
            data,
        };
    }
    async allSubscribers(query, pagination) {
        const data = await this.userPackageRepository.paginate({
            ...pagination,
            conditions: { ...query, isActive: true },
        });
        return {
            statusCode: 200,
            message: 'Subscribers found successfully',
            data,
        };
    }
    async validateSubscriptionsExist(items) {
        const [subscriptions, addons] = await Promise.all([
            this.subscriptionRepository.all({
                conditions: { _id: { $in: items.subscription } },
            }),
            items.addons.length
                ? this.addonsRepository.all({
                    conditions: { _id: { $in: items.addons } },
                })
                : [],
        ]);
        if (subscriptions.length !== items.subscription.length) {
            throw new common_1.NotFoundException('One or more subscriptions do not exist');
        }
        if (items.addons.length && addons.length !== items.addons.length) {
            throw new common_1.NotFoundException('One or more addons do not exist');
        }
    }
    async calculateTotalAmount(items) {
        let totalAmount = 0;
        for (const item of items.subscription) {
            const subscription = await this.subscriptionRepository.byQuery({
                _id: item,
            });
            totalAmount += subscription.price;
            if (items.addons && items.addons.length > 0) {
                for (const addonId of items.addons) {
                    const addon = await this.addonsRepository.byQuery({ _id: addonId });
                    totalAmount += addon.price;
                }
            }
        }
        return totalAmount;
    }
    async saveUserPackages(items, user) {
        const userPackage = await this.userPackageRepository.create({
            ...items,
            user,
        });
        return userPackage._id;
    }
    async getUserSubscriptions(user) {
        try {
            const data = await this.userPackageRepository.all({
                conditions: { user },
                sort: '-createdAt',
                populate: [
                    {
                        path: 'subscription',
                        select: '-createdAt -updatedAt',
                    },
                    {
                        path: 'addons',
                        select: '-createdAt -updatedAt',
                    },
                ],
                projections: '-user',
            });
            if (!data || !data.length) {
                throw new common_1.NotFoundException('No subscriptions found');
            }
            return {
                statusCode: 200,
                message: 'User subscriptions retrieved successfully',
                data: data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.PackagesService = PackagesService;
__decorate([
    (0, event_emitter_1.OnEvent)('order.verified'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PackagesService.prototype, "updatePackageStatus", null);
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_repository_1.SubscriptionRepository,
        subscription_repository_1.AddonRepository,
        user_repository_1.UserPackageRepository,
        event_emitter_1.EventEmitter2])
], PackagesService);
