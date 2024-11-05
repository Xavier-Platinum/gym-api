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
exports.FlutterwaveService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
let FlutterwaveService = class FlutterwaveService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async initiatePayment(amount, user, transactionRef) {
        console.log('initiating flutterwave payment');
        try {
            const url = 'https://api.flutterwave.com/v3/payments';
            const redirectUrl = `${this.configService.get('APP_BASE_URL')}/transactions/verify?transactionRef=${transactionRef}&gateway=Flutterwave`;
            const payload = {
                tx_ref: transactionRef,
                amount: amount,
                currency: 'NGN',
                redirect_url: `http://localhost:8080/transactions/verify?transactionRef=${transactionRef}&gateway=Flutterwave`,
                customer: {
                    email: user?.email,
                    id: user?.id,
                    name: user?.fullName,
                    phone_number: user?.phoneNumber,
                },
            };
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
                },
            }));
            console.log('flutterwave response', response.data);
            return {
                gateway: 'Flutterwave',
                transactionRef,
                status: 'pending',
                metadata: { ...response.data.data },
            };
        }
        catch (error) {
            console.error('Flutter error', error.response.data);
        }
    }
    async verifyPayment(transactionRef) {
        try {
            const url = `https://api.flutterwave.com/v3/transactions/${transactionRef}/verify`;
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('FLUTTERWAVE_SECRET_KEY')}`,
                },
            }));
            console.log('flutterwave response', response.data);
            return {
                transactionRef,
                status: 'completed',
                metadata: {},
            };
        }
        catch (error) {
            console.error('Flutter error', error.response.data);
        }
    }
};
exports.FlutterwaveService = FlutterwaveService;
exports.FlutterwaveService = FlutterwaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], FlutterwaveService);
