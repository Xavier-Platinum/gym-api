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
exports.RecommendationsController = void 0;
const common_1 = require("@nestjs/common");
const recommendations_service_1 = require("./recommendations.service");
const create_recommendation_dto_1 = require("./dto/create-recommendation.dto");
const update_recommendation_dto_1 = require("./dto/update-recommendation.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const interfaces_1 = require("../auth/interfaces");
const roles_guard_1 = require("../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let RecommendationsController = class RecommendationsController {
    constructor(recommendationsService) {
        this.recommendationsService = recommendationsService;
    }
    create(createRecommendationDto, image) {
        return this.recommendationsService.create(createRecommendationDto, image);
    }
    async findAll(payload) {
        const { page, limit, sort, ...others } = payload;
        return await this.recommendationsService.findAll({
            page: page,
            limit: limit,
            sort: sort,
            conditions: { ...others },
        });
    }
    findOne(id) {
        return this.recommendationsService.findOne(+id);
    }
    async update(id, payload, image) {
        return await this.recommendationsService.update(id, payload, image);
    }
    remove(id) {
        return this.recommendationsService.remove(+id);
    }
};
exports.RecommendationsController = RecommendationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recommendation_dto_1.CreateRecommendationDto, Object]),
    __metadata("design:returntype", void 0)
], RecommendationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin, interfaces_1.ROLES.User, interfaces_1.ROLES.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecommendationsController.prototype, "findOne", null);
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
    __metadata("design:paramtypes", [Object, update_recommendation_dto_1.UpdateRecommendationDto, Object]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)(interfaces_1.ROLES.SuperAdmin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecommendationsController.prototype, "remove", null);
exports.RecommendationsController = RecommendationsController = __decorate([
    (0, common_1.Controller)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [recommendations_service_1.RecommendationsService])
], RecommendationsController);
