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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("../transactions/transactions.service");
let PaymentsController = class PaymentsController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async handleFlutterwave(body) {
        const { data: { tx_ref, transaction_id }, } = body;
        await this.transactionService.verifyTransaction(tx_ref, 'Flutterwave', true, transaction_id);
        return { status: 'ok' };
    }
    async handlePaystack(body) {
        const { data: { reference, transaction_id }, } = body;
        await this.transactionService.verifyTransaction(reference, 'Paystack', true, transaction_id);
        return { status: 'ok' };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('/flutterwave'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleFlutterwave", null);
__decorate([
    (0, common_1.Post)('/paystack'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handlePaystack", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], PaymentsController);
