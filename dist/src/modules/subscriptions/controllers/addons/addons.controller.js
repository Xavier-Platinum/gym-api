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
exports.AddonsController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../../auth/decorators/auth.decorator");
const interfaces_1 = require("../../../auth/interfaces");
const roles_guard_1 = require("../../../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const addons_service_1 = require("../../services/addons/addons.service");
const create_subscription_dto_1 = require("../../dto/create-subscription.dto");
const update_subscription_dto_1 = require("../../dto/update-subscription.dto");
let AddonsController = class AddonsController {
    constructor(addonService) {
        this.addonService = addonService;
    }
    create(payload, image) {
        console.log(payload);
        return this.addonService.create(payload, image);
    }
    findAll(payload) {
        const { page, limit, sort, ...others } = payload;
        return this.addonService.findAll({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { ...others },
        });
    }
    findOne(id) {
        return this.addonService.findOne(id);
    }
    update(id, payload, image) {
        return this.addonService.update(id, payload, image);
    }
    remove(id) {
        return this.addonService.remove(id);
    }
};
exports.AddonsController = AddonsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscription_dto_1.CreateAddonDto, Object]),
    __metadata("design:returntype", void 0)
], AddonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_subscription_dto_1.UpdateAddonDto, Object]),
    __metadata("design:returntype", void 0)
], AddonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddonsController.prototype, "remove", null);
exports.AddonsController = AddonsController = __decorate([
    (0, common_1.Controller)('addons'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [addons_service_1.AddonsService])
], AddonsController);
