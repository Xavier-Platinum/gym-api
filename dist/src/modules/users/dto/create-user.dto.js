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
exports.PaginateUserDto = exports.PaginateDto = exports.CreateSubscribeDto = exports.SubscribeItemDto = exports.UpdateStatusDto = exports.CreateUserDto = exports.UserStatusEnum = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["SUSPEND"] = "suspend";
    UserStatusEnum["BAN"] = "ban";
    UserStatusEnum["UNBAN"] = "unban";
    UserStatusEnum["UNSUSPEND"] = "unsuspended";
})(UserStatusEnum || (exports.UserStatusEnum = UserStatusEnum = {}));
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(11),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 50),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
class UpdateStatusDto {
}
exports.UpdateStatusDto = UpdateStatusDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], UpdateStatusDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(UserStatusEnum),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
class SubscribeItemDto {
}
exports.SubscribeItemDto = SubscribeItemDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], SubscribeItemDto.prototype, "subscription", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], SubscribeItemDto.prototype, "addons", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SubscribeItemDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], SubscribeItemDto.prototype, "isAutoRenew", void 0);
class CreateSubscribeDto {
}
exports.CreateSubscribeDto = CreateSubscribeDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubscribeItemDto),
    __metadata("design:type", SubscribeItemDto)
], CreateSubscribeDto.prototype, "item", void 0);
class PaginateDto {
}
exports.PaginateDto = PaginateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginateDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginateDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginateDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PaginateDto.prototype, "conditions", void 0);
class PaginateUserDto {
}
exports.PaginateUserDto = PaginateUserDto;
