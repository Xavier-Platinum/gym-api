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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const auth_repository_1 = require("./entities/auth.repository");
let RolesService = class RolesService {
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async create(payload) {
        try {
            const isExist = await this.rolesRepository.exists({ name: payload.name });
            if (isExist) {
                throw new common_1.BadRequestException('Role already exists');
            }
            const role = await this.rolesRepository.create(payload);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Role created successfully',
                data: role,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll() {
        try {
            const roles = await this.rolesRepository.all({});
            if (!roles || !roles.length) {
                throw new common_1.NotFoundException('No roles found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Roles found successfully',
                data: roles,
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
            const role = await this.rolesRepository.byQuery({ _id: id }, null, null, null, '-createdAt');
            if (!role) {
                throw new common_1.NotFoundException('Role not found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Role found successfully',
                data: role,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, payload) {
        try {
            const isExist = await this.rolesRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('Role not found');
            }
            const updatedRole = await this.rolesRepository.update({ _id: id }, {
                $set: { permissions: payload.permissions },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Role updated successfully',
                data: updatedRole,
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async remove(id) {
        try {
            const isExist = await this.rolesRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('Role not found');
            }
            await this.rolesRepository.delete({ _id: id });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                message: 'Role deleted successfully',
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
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.RoleRepository])
], RolesService);
