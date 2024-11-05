"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_service_1 = require("./subscriptions.service");
const subscriptions_controller_1 = require("./subscriptions.controller");
const subscriptions_gateway_1 = require("./subscriptions.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const subscription_schema_1 = require("./entities/subscription.schema");
const subscription_repository_1 = require("./entities/subscription.repository");
const services_module_1 = require("../../common/services/services.module");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
const addons_controller_1 = require("./controllers/addons/addons.controller");
const addons_service_1 = require("./services/addons/addons.service");
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: subscription_schema_1.Addon.name, schema: subscription_schema_1.AddonSchema },
            ]),
            services_module_1.ServicesModule,
        ],
        controllers: [subscriptions_controller_1.SubscriptionsController, addons_controller_1.AddonsController],
        providers: [
            subscriptions_service_1.SubscriptionsService,
            subscriptions_gateway_1.SubscriptionsGateway,
            subscription_repository_1.SubscriptionRepository,
            cloudinary_service_1.CloudinaryService,
            addons_service_1.AddonsService,
            subscription_repository_1.AddonRepository,
        ],
        exports: [
            subscriptions_service_1.SubscriptionsService,
            subscription_repository_1.SubscriptionRepository,
            cloudinary_service_1.CloudinaryService,
            subscription_repository_1.AddonRepository,
        ],
    })
], SubscriptionsModule);
