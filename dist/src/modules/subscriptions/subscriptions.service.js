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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const subscription_repository_1 = require("./entities/subscription.repository");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionRepository, uploadService, eventEmitter) {
        this.subscriptionRepository = subscriptionRepository;
        this.uploadService = uploadService;
        this.eventEmitter = eventEmitter;
    }
    async create(payload, image) {
        try {
            const isExists = await this.subscriptionRepository.exists({
                name: payload.name,
            });
            if (isExists) {
                throw new common_1.HttpException('Subscription already exists', 409);
            }
            if (image) {
                const response = await this.uploadService.uploadImage(image, 'subscriptions');
                payload.image = {
                    publicId: response.public_id,
                    imageValue: response.secure_url,
                };
            }
            const subscription = await this.subscriptionRepository.create({
                ...payload,
            });
            this.eventEmitter.emit('BroadcastNotification', {
                title: 'Subscriptions Notification',
                body: JSON.stringify({
                    message: 'New subscriptions added check it out.',
                    data: {
                        name: subscription.name,
                        _id: subscription?._id,
                        description: subscription?.description,
                        image: subscription?.image,
                    },
                }),
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Subscription created successfully',
                data: {},
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error.message, error?.getStatus());
            }
            throw new common_1.InternalServerErrorException();
        }
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
    async getAnalytics(query, pagination) {
        const data = await this.subscriptionRepository.paginate({
            ...pagination,
            conditions: { ...query },
        });
        return {
            statusCode: 200,
            message: 'Subscriptions found successfully',
            data,
        };
    }
    async findAll(payload) {
        try {
            payload.conditions = this.buildOrQuery(payload.conditions);
            const data = await this.subscriptionRepository.paginate({
                ...payload,
            });
            if (!data || !data.data.length) {
                throw new common_1.NotFoundException('No subscriptions found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Subscriptions found successfully',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id) {
        try {
            const sub = await this.subscriptionRepository.byQuery({
                _id: id,
            }, null, null, [], '-createdAt');
            if (!sub) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Subscription found successfully',
                data: sub,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, payload, image) {
        try {
            const isExist = await this.subscriptionRepository.byID(id, null, null);
            if (!isExist) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            if (image) {
                if (isExist?.image && isExist?.image?.publicId) {
                    await this.uploadService.deleteImage(isExist?.image?.publicId);
                }
                const response = await this.uploadService.uploadImage(image, 'subscriptions');
                payload.image = {
                    publicId: response.public_id,
                    imageValue: response.secure_url,
                };
            }
            const update = await this.subscriptionRepository.findAndUpdate({ _id: id }, {
                $set: { ...payload },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Subscription updated successfully',
                data: update,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async remove(id) {
        try {
            const isExist = await this.subscriptionRepository.byID(id, null, null);
            if (!isExist) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            await Promise.all([
                await this.subscriptionRepository.update({ _id: id }, {
                    isArchived: true,
                }),
                isExist?.image?.publicId &&
                    (await this.uploadService.deleteImage(isExist?.image?.publicId)),
            ]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Subscription deleted successfully',
                data: {},
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
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_repository_1.SubscriptionRepository,
        cloudinary_service_1.CloudinaryService,
        event_emitter_1.EventEmitter2])
], SubscriptionsService);
