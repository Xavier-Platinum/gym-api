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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const transaction_repository_1 = require("./entities/transaction.repository");
const gateway_factory_1 = require("../payments/gateway.factory");
const user_repository_1 = require("../users/entities/user.repository");
const order_repository_1 = require("../order/entities/order.repository");
const event_emitter_1 = require("@nestjs/event-emitter");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, paymentGatewayFactory, userRepository, order, eventEmitter) {
        this.transactionRepository = transactionRepository;
        this.paymentGatewayFactory = paymentGatewayFactory;
        this.userRepository = userRepository;
        this.order = order;
        this.eventEmitter = eventEmitter;
    }
    async OrderTransaction(payload) {
        try {
            return await this.create(payload);
        }
        catch (error) {
            return {
                success: false,
                message: error?.message,
            };
            throw new Error(error);
        }
    }
    async create(payload) {
        try {
            const isExists = await this.transactionRepository.exists({
                orderId: payload.orderId,
            });
            if (isExists) {
                throw new common_1.HttpException('Transaction already exists', 409);
            }
            const user = await this.userRepository.byID(payload.userId);
            const transactionRef = await this.generateTransactionRef();
            const paymentGateway = this.paymentGatewayFactory.getGateway(payload?.paymentGateway);
            const paymentResponse = await paymentGateway.initiatePayment(payload?.amount, user, transactionRef);
            const transactions = await this.transactionRepository.create({
                ...payload,
                transactionRef,
                status: paymentResponse?.status,
                paymentMetadata: paymentResponse.metadata,
            });
            this.eventEmitter.emit('BroadcastNotification', {
                title: 'Transactions Notification',
                body: JSON.stringify({
                    message: 'You made a new transaction.',
                    data: {
                        _id: transactions?._id,
                        status: transactions?.status,
                        amount: transactions?.amount,
                    },
                }),
            });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Transaction initiated successfully',
                data: { url: paymentResponse.metadata.data.authorization_url },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error?.message, error?.getStatus());
            }
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async generateTransactionRef() {
        return 'TXN-' + Date.now();
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
        const data = await this.transactionRepository.paginate({
            ...pagination,
            conditions: { ...query },
        });
        return {
            statusCode: 200,
            message: 'Transactions found successfully',
            data,
        };
    }
    async findAll(payload) {
        try {
            payload.conditions = this.buildOrQuery(payload.conditions);
            const data = await this.transactionRepository.paginate({
                ...payload,
                populate: [
                    {
                        path: 'userId',
                        model: 'User',
                        select: '-createdAt -updatedAt',
                    },
                    {
                        path: 'orderId',
                        model: 'Order',
                        select: '-createdAt -updatedAt',
                        populate: [
                            {
                                path: 'userId',
                                select: '',
                            },
                            {
                                path: 'items',
                                select: '',
                                populate: [
                                    {
                                        path: 'subscription',
                                        select: '',
                                    },
                                    {
                                        path: 'addons',
                                        select: '',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (!data || !data.data.length) {
                throw new common_1.NotFoundException('No transactions found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Transactions found successfully',
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
            const sub = await this.transactionRepository.byQuery({
                _id: id,
            }, null, null, [
                {
                    path: 'userId',
                    model: 'User',
                    select: '-createdAt -updatedAt',
                },
                {
                    path: 'orderId',
                    model: 'Order',
                    select: '-createdAt -updatedAt',
                    populate: [
                        {
                            path: 'userId',
                            select: '',
                        },
                        {
                            path: 'items',
                            select: '',
                            populate: [
                                {
                                    path: 'subscription',
                                    select: '',
                                },
                                {
                                    path: 'addons',
                                    select: '',
                                },
                            ],
                        },
                    ],
                },
            ], '-createdAt');
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
            if (error instanceof Error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async history(userId) {
        try {
            const sub = await this.transactionRepository.byQuery({
                userId: userId,
            }, null, null, [
                {
                    path: 'userId',
                    model: 'User',
                    select: '-createdAt -updatedAt',
                },
                {
                    path: 'orderId',
                    model: 'Order',
                    select: '-createdAt -updatedAt',
                    populate: [
                        {
                            path: 'userId',
                            select: '',
                        },
                        {
                            path: 'items',
                            select: '',
                            populate: [
                                {
                                    path: 'subscription',
                                    select: '',
                                },
                                {
                                    path: 'addons',
                                    select: '',
                                },
                            ],
                        },
                    ],
                },
            ], '-createdAt');
            if (!sub) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Subscription history',
                data: sub,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async verifyTransaction(transactionRef, gateway, webhook, transaction_id) {
        const isExist = await this.transactionRepository.byQuery({
            transactionRef: transactionRef,
        });
        if (!isExist) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (isExist?.status === 'success') {
            throw new common_1.HttpException('Transaction has already been verified successful.', 409);
        }
        const paymentGateway = this.paymentGatewayFactory.getGateway(gateway);
        const verificationResponse = await paymentGateway.verifyPayment(transaction_id || transactionRef);
        const data = await this.transactionRepository.update({ transactionRef: transactionRef }, {
            status: verificationResponse.status,
            webhookVerified: webhook,
            paymentMetadata: verificationResponse.metadata,
            paymentMethod: verificationResponse.paymentMethod,
        });
        this.eventEmitter.emit('transaction.verified', {
            orderId: data?.orderId,
            status: verificationResponse.status,
            paymentMethod: verificationResponse.paymentMethod,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Transaction verified successfully',
            data: {},
        };
    }
    async update(id, payload) {
        try {
            const isExist = await this.transactionRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            const update = await this.transactionRepository.findAndUpdate({ _id: id }, {
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
            const isExist = await this.transactionRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            await this.transactionRepository.update({ _id: id }, {
                isArchived: true,
            });
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
exports.TransactionsService = TransactionsService;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsService.prototype, "OrderTransaction", null);
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_1.TransactionRepository,
        gateway_factory_1.PaymentGatewayFactory,
        user_repository_1.UserRepository,
        order_repository_1.OrderRepository,
        event_emitter_1.EventEmitter2])
], TransactionsService);
