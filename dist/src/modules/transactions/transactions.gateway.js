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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
let TransactionsGateway = class TransactionsGateway {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    create(createTransactionDto) {
        return this.transactionsService.create(createTransactionDto);
    }
    findAll() {
        return this.transactionsService.findAll({});
    }
    findOne(id) {
        return this.transactionsService.findOne(id);
    }
    update(updateTransactionDto) {
        return this.transactionsService.update(updateTransactionDto.id, updateTransactionDto);
    }
    remove(id) {
        return this.transactionsService.remove(id);
    }
};
exports.TransactionsGateway = TransactionsGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('createTransaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllTransactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneTransaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateTransaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeTransaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TransactionsGateway.prototype, "remove", null);
exports.TransactionsGateway = TransactionsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsGateway);
