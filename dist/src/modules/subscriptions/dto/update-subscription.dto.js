"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddonDto = exports.UpdateSubscriptionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_subscription_dto_1 = require("./create-subscription.dto");
class UpdateSubscriptionDto extends (0, mapped_types_1.PartialType)(create_subscription_dto_1.CreateSubscriptionDto) {
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
class UpdateAddonDto extends (0, mapped_types_1.PartialType)(create_subscription_dto_1.CreateAddonDto) {
}
exports.UpdateAddonDto = UpdateAddonDto;
