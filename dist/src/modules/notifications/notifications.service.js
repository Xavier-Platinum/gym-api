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
exports.NotificationsService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const create_notification_dto_1 = require("./dto/create-notification.dto");
const notification_repository_1 = require("./entities/notification.repository");
const firebase_service_1 = require("../../common/services/firebase/firebase.service");
const user_repository_1 = require("../users/entities/user.repository");
const event_emitter_1 = require("@nestjs/event-emitter");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, firebaseService, userRepository, eventEmitter) {
        this.notificationRepository = notificationRepository;
        this.firebaseService = firebaseService;
        this.userRepository = userRepository;
        this.eventEmitter = eventEmitter;
        this.BATCH_SIZE = 500;
    }
    async sendNotification(payload) {
        try {
            const userSubscription = await this.userRepository.byQuery({
                _id: payload?.userId,
            });
            if (!userSubscription || !userSubscription.deviceToken) {
                throw new common_1.HttpException('User not subscribed', common_1.HttpStatus.BAD_REQUEST);
            }
            const notification = await this.notificationRepository.create(payload);
            await this.firebaseService.sendNotification([userSubscription.fcmToken], {
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
            });
            return {
                statusCode: 201,
                message: 'Notification created successfully',
                data: notification,
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async handleBroadcastEvent(notification) {
        try {
            const allUsers = await this.userRepository.byQuery({}, [
                'deviceToken',
                '_id',
            ]);
            const validTokens = allUsers
                .map((user) => user.deviceToken)
                .filter((token) => token && token.trim().length > 0);
            if (validTokens.length === 0) {
                throw new common_1.HttpException('No valid device tokens found', common_1.HttpStatus.BAD_REQUEST);
            }
            const tokenBatches = (0, lodash_1.chunk)(validTokens, this.BATCH_SIZE);
            for (const batch of tokenBatches) {
                await this.firebaseService.sendNotification(batch, {
                    notification: {
                        title: notification.title,
                        body: notification.body,
                    },
                });
                console.log(`Sent batch with ${batch.length} notifications.`);
            }
            console.log(`Broadcast notifications sent to ${validTokens.length} users.`);
        }
        catch (error) {
            console.error('Error sending broadcast notifications:', error);
            throw new common_1.HttpException(error?.message || 'Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async BroadcastSendBroadcast(payload) {
        await this.createBroadcastNotification(payload);
    }
    async create(payload) {
        try {
            const userSubscription = await this.userRepository.byQuery({
                _id: payload?.userId,
            });
            if (!userSubscription || !userSubscription.deviceToken) {
                throw new common_1.HttpException('User not subscribed', common_1.HttpStatus.BAD_REQUEST);
            }
            const notification = await this.notificationRepository.create(payload);
            await this.firebaseService.sendNotification([userSubscription.fcmToken], {
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
            });
            return {
                statusCode: 201,
                message: 'Notification created successfully',
                data: notification,
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async getAnalytics(query, pagination) {
        const data = await this.notificationRepository.paginate({
            ...pagination,
            conditions: { ...query },
        });
        return {
            statusCode: 200,
            message: 'Notifications found successfully',
            data,
        };
    }
    async subscribeUser(userId, fcmToken) {
        try {
            const existingSubscription = await this.userRepository.byQuery({
                _id: userId,
            });
            if (existingSubscription || !existingSubscription?.deviceToken) {
                throw new common_1.HttpException('User already subscribed', 400);
            }
            await this.userRepository.findAndUpdate({ _id: userId }, {
                $set: {
                    deviceToken: fcmToken,
                },
            });
            return {
                statusCode: 200,
                message: 'User subscribed successfully',
                data: {},
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async unsubscribeUser(userId) {
        try {
            const existingSubscription = await this.userRepository.byQuery({
                _id: userId,
            });
            if (!existingSubscription) {
                throw new common_1.HttpException('User not subscribed', 400);
            }
            await this.userRepository.findAndUpdate({ _id: userId }, {
                $set: {
                    deviceToken: '',
                },
            });
            return {
                statusCode: 200,
                message: 'User subscribed successfully',
                data: {},
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async createBroadcastNotification(notificationData) {
        try {
            notificationData.type = 'general';
            const allUsers = await this.userRepository.byQuery({}, [
                'deviceToken',
                '_id',
            ]);
            allUsers.map(async (user) => {
                await this.notificationRepository.create({
                    userId: user._id,
                    title: notificationData.title,
                    body: notificationData.body,
                    type: notificationData.type,
                });
            });
            this.eventEmitter.emit('sendBroadcast', notificationData);
            return {
                statusCode: 201,
                message: 'Broadcast notification created and saved to each user',
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error?.message || 'Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async retryPushNotification(notificationId) {
        try {
            const notification = await this.notificationRepository.byQuery({
                _id: notificationId,
            });
            if (!notification) {
                throw new Error('Notification not found');
            }
            if (notification.type === 'push' &&
                notification.deliveryStatus === 'failed') {
                const message = {
                    token: 'USER_DEVICE_TOKEN',
                    notification: {
                        title: notification.title,
                        body: notification.body,
                    },
                };
                try {
                    await this.firebaseService.sendNotification([message.token], {
                        notification: {
                            ...message.notification,
                        },
                    });
                    notification.deliveryStatus = 'delivered';
                }
                catch (error) {
                    notification.retryCount += 1;
                    if (notification.retryCount >= 3) {
                        notification.deliveryStatus = 'failed';
                    }
                }
                await notification.save();
            }
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async sendNotificationToUser(userId, notificationData) {
        try {
            const userSubscription = await this.userRepository.byQuery({
                _id: userId,
            });
            if (!userSubscription) {
                throw new common_1.HttpException('User not subscribed', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.firebaseService.sendNotification([userSubscription.fcmToken], notificationData);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async sendPushNotification(userToken, title, body) {
        const message = {
            token: userToken,
            notification: {
                title,
                body,
            },
        };
        try {
            await this.firebaseService.sendNotification([message.token], {
                notification: {
                    ...message.notification,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async getUserNotifications(userId) {
        try {
            const data = await this.notificationRepository.byQuery({
                userId,
                isArchived: false,
            });
            return {
                statusCode: 200,
                message: 'User notifications',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async update(notificationId, payload) {
        try {
            await this.notificationRepository.findAndUpdate({ _id: notificationId }, { $set: { ...payload } });
            return {
                statusCode: 200,
                message: 'Updated successfully',
                data: null,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
    async findOne(id) {
        try {
            const data = await this.notificationRepository.byQuery({ _id: id }, null, null, [
                {
                    path: 'userId',
                    select: '',
                },
            ]);
            if (!data)
                throw new common_1.HttpException('No notification', 400);
            await this.notificationRepository.findAndUpdate({ _id: id }, {
                $set: {
                    status: 'read',
                },
            });
            data.status = 'read';
            return {
                statusCode: 200,
                message: 'Single notification',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, 400);
            }
            throw new common_1.HttpException(error?.message, 400);
        }
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, event_emitter_1.OnEvent)('sendNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "sendNotification", null);
__decorate([
    (0, event_emitter_1.OnEvent)('sendBroadcast'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.BroadcastCreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "handleBroadcastEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)('BroadcastNotification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "BroadcastSendBroadcast", null);
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        firebase_service_1.FirebaseService,
        user_repository_1.UserRepository,
        event_emitter_1.EventEmitter2])
], NotificationsService);
