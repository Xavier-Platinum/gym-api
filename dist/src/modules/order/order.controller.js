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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const update_order_dto_1 = require("./dto/update-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const interfaces_1 = require("../auth/interfaces");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async create(payload, req) {
        payload.userId = req.user._id;
        throw new common_1.NotImplementedException();
    }
    async findAll(payload) {
        const { page, limit, sort, ...others } = payload;
        return await this.orderService.findAll({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { ...others },
        });
    }
    async findUserOrders(payload, req) {
        const { page, limit, sort, ...others } = payload;
        const id = req.user._id;
        console.log(id);
        return await this.orderService.findAll({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { userId: id, ...others },
        });
    }
    async findById(id) {
        return await this.orderService.findById(id);
    }
    async update(id, payload) {
        return await this.orderService.update(id, payload);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/my-orders'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findUserOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
