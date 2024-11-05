"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_factory_1 = require("./gateway.factory");
const flutterwave_payment_service_1 = require("./services/flutterwave.payment.service");
const paystack_payment_service_1 = require("./services/paystack.payment.service");
const payments_controller_1 = require("./payments.controller");
const axios_1 = require("@nestjs/axios");
const transactions_module_1 = require("../transactions/transactions.module");
const config_1 = require("@nestjs/config");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, axios_1.HttpModule, (0, common_1.forwardRef)(() => transactions_module_1.TransactionsModule)],
        providers: [flutterwave_payment_service_1.FlutterwaveService, paystack_payment_service_1.PaystackService, gateway_factory_1.PaymentGatewayFactory],
        exports: [gateway_factory_1.PaymentGatewayFactory],
        controllers: [payments_controller_1.PaymentsController],
    })
], PaymentsModule);
