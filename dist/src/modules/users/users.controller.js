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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const interfaces_1 = require("../auth/interfaces");
const roles_guard_1 = require("../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(payload) {
        return await this.usersService.createSuperAdmin(payload);
    }
    async registerSuperAdmin(payload) {
        return await this.usersService.createSuperAdmin(payload);
    }
    async registerAdmin(payload) {
        return await this.usersService.createSystemAdmin(payload);
    }
    async register(payload) {
        return await this.usersService.create(payload);
    }
    async profile(req) {
        const user = req.user;
        console.log(req.user);
        return await this.usersService.findOne(user?._id);
    }
    async updateUserStatus(param, payload) {
        if (param.status === create_user_dto_1.UserStatusEnum.SUSPEND && !payload.reason) {
            throw new common_1.BadRequestException('Reason is required for suspendion');
        }
        else if (param.status === create_user_dto_1.UserStatusEnum.BAN && !payload.reason) {
            throw new common_1.BadRequestException('Reason is required for ban');
        }
        return await this.usersService.userStatusChange(param.id, payload);
    }
    async uploadProfilePicture(file, req) {
        const id = req.user._id;
        return this.usersService.updateProfilePicture(id, file.path);
    }
    async findAll(payload) {
        const { page, limit, sort, ...others } = payload;
        return await this.usersService.findAll({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { ...others },
        });
    }
    async findAllAdmins(payload) {
        const { page, limit, sort, ...others } = payload;
        return await this.usersService.findAllAdmins({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { ...others },
        });
    }
    async findOne(id) {
        return await this.usersService.findOne(id);
    }
    async update(id, payload) {
        return await this.usersService.update(id, payload);
    }
    async remove(id) {
        return await this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/superadmin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerSuperAdmin", null);
__decorate([
    (0, common_1.Post)('/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "profile", null);
__decorate([
    (0, common_1.Post)('/:id/:status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.UpdateStatusDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/admins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllAdmins", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
