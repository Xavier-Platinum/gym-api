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
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
let PaystackService = class PaystackService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async initiatePayment(amount, user, transactionRef) {
        const url = 'https://api.paystack.co/transaction/initialize';
        const payload = {
            reference: transactionRef,
            amount: amount * 100,
            email: user?.email,
            redirect_url: `http://localhost:8080/transactions/verify?transactionRef=${transactionRef}&gateway=Paystack`,
        };
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, payload, {
            headers: {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
            },
        }));
        console.log(response.data);
        return {
            gateway: 'Paystack',
            transactionRef,
            status: 'pending',
            metadata: { ...response.data },
        };
    }
    async verifyPayment(transactionRef) {
        const url = `https://api.paystack.co/transaction/verify/${transactionRef}`;
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
            },
        }));
        console.log(response.data);
        return {
            transactionRef,
            status: response.data.data.status === 'abandoned'
                ? 'failed'
                : response.data.data.status,
            metadata: {},
            paymentMethod: response?.data.data.channel,
        };
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PaystackService);
