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
exports.PaymentGatewayFactory = void 0;
const common_1 = require("@nestjs/common");
const flutterwave_payment_service_1 = require("./services/flutterwave.payment.service");
const paystack_payment_service_1 = require("./services/paystack.payment.service");
let PaymentGatewayFactory = class PaymentGatewayFactory {
    constructor(flutterwaveService, paystackService) {
        this.flutterwaveService = flutterwaveService;
        this.paystackService = paystackService;
    }
    getGateway(gateway) {
        switch (gateway) {
            case 'Flutterwave':
                return this.flutterwaveService;
            case 'Paystack':
                return this.paystackService;
            default:
                throw new Error('Unsupported payment gateway');
        }
    }
};
exports.PaymentGatewayFactory = PaymentGatewayFactory;
exports.PaymentGatewayFactory = PaymentGatewayFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [flutterwave_payment_service_1.FlutterwaveService,
        paystack_payment_service_1.PaystackService])
], PaymentGatewayFactory);
