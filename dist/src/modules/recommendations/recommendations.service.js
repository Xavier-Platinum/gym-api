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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const recommendation_repository_1 = require("./entities/recommendation.repository");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
let RecommendationsService = class RecommendationsService {
    constructor(recommendationsRepository, uploadService) {
        this.recommendationsRepository = recommendationsRepository;
        this.uploadService = uploadService;
    }
    async create(payload, image) {
        try {
            const response = await this.uploadService.uploadImage(image, 'recommendations');
            payload.image = {
                publicId: response.public_id,
                imageValue: response.secure_url,
            };
            const data = await this.recommendationsRepository.create({ ...payload });
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Recommendation created successfully',
                data: data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.HttpException(error.message, error?.getStatus());
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    buildOrQuery(conditions) {
        const orConditions = [];
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined) {
                orConditions.push({ [key]: value });
            }
        }
        return orConditions.length > 0 ? { $or: orConditions } : {};
    }
    async findAll(payload) {
        try {
            payload.conditions = this.buildOrQuery(payload.conditions);
            const data = await this.recommendationsRepository.paginate({
                ...payload,
            });
            if (!data || !data.data.length) {
                throw new common_1.NotFoundException('No recommendations found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Recommendations found successfully',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id) {
        try {
            const sub = await this.recommendationsRepository.byQuery({
                _id: id,
            }, null, null, [], '-createdAt');
            if (!sub) {
                throw new common_1.NotFoundException('Recommendation not found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Recommendation found successfully',
                data: sub,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, payload, image) {
        try {
            const isExist = await this.recommendationsRepository.byID(id, null, null);
            if (!isExist) {
                throw new common_1.NotFoundException('Recommendation not found');
            }
            if (image) {
                if (isExist?.image && isExist?.image?.publicId) {
                    await this.uploadService.deleteImage(isExist?.image?.publicId);
                }
                const response = await this.uploadService.uploadImage(image, 'recommendations');
                payload.image = {
                    publicId: response.public_id,
                    imageValue: response.secure_url,
                };
            }
            const update = await this.recommendationsRepository.findAndUpdate({ _id: id }, {
                $set: { ...payload },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Recommendation updated successfully',
                data: update,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async remove(id) {
        try {
            const isExist = await this.recommendationsRepository.byID(id, null, null);
            if (!isExist) {
                throw new common_1.NotFoundException('Recommendation not found');
            }
            await Promise.all([
                await this.recommendationsRepository.update({ _id: id }, {
                    isArchived: true,
                }),
                isExist?.image?.publicId &&
                    (await this.uploadService.deleteImage(isExist?.image?.publicId)),
            ]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Recommendation deleted successfully',
                data: {},
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [recommendation_repository_1.RecommendationRepository,
        cloudinary_service_1.CloudinaryService])
], RecommendationsService);
