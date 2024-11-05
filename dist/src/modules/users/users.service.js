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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./entities/user.repository");
const email_service_1 = require("../../common/services/email/email.service");
const auth_repository_1 = require("../auth/entities/auth.repository");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
let UsersService = class UsersService {
    constructor(userRepository, emailService, rolesRepository, uploadService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.rolesRepository = rolesRepository;
        this.uploadService = uploadService;
    }
    async updateOtp(email, payload) {
        console.log('Updating ', email, payload);
        await this.userRepository.update({ email: email }, {
            ...payload,
        });
    }
    async create(payload) {
        try {
            const isExist = await this.userRepository.exists({
                $or: [
                    { email: payload?.email },
                    { fullName: payload?.fullName },
                    { phoneNumber: payload?.phoneNumber },
                ],
            });
            if (isExist) {
                throw new common_1.BadRequestException('User already exists');
            }
            const role = await this.rolesRepository.byQuery({ name: 'User' });
            const attachments = [];
            const user = await this.userRepository.create({
                ...payload,
                roles: [
                    {
                        roleId: role.id,
                        customPermissions: [],
                    },
                ],
            });
            await this.emailService.sendMail(payload?.email, 'Registration successful', 'Your account has been registered successfully', '<h1>Your account has been registered successfully.</h1>');
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'User created successfully',
                data: user,
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
    buildOrQuery(conditions) {
        const orConditions = [];
        for (const [key, value] of Object.entries(conditions)) {
            if (value !== undefined) {
                orConditions.push({ [key]: value });
            }
        }
        return orConditions.length > 0 ? { $or: orConditions } : {};
    }
    async updateProfilePicture(userId, file) {
        const user = await this.userRepository.byID(userId);
        if (user?.profilePictureMetaData?.publicId) {
            await this.uploadService.deleteImage(user?.profilePictureMetaData?.publicId);
        }
        const uploadResult = await this.uploadService.uploadImage(file, 'profile_pictures');
        await this.userRepository.update({ _id: userId }, {
            ProfilePicture: uploadResult.secure_url,
            profilePictureMetaData: {
                publicId: uploadResult.public_id,
            },
        });
        return {
            message: 'Profile picture updated successfully',
            url: uploadResult.secure_url,
        };
    }
    async getAnalytics(query, pagination) {
        const data = await this.userRepository.paginate({
            ...pagination,
            conditions: { ...query },
        });
        return {
            statusCode: 200,
            message: 'Users found successfully',
            data,
        };
    }
    async findAllAdmins(payload) {
        try {
            payload.conditions.isDeleted = false;
            payload.conditions.isSuperAdmin = false;
            const role = await this.rolesRepository.byQuery({ name: 'Admin' });
            payload.conditions = this.buildOrQuery(payload.conditions);
            payload.conditions['roles.roleId'] = role._id;
            console.log(payload);
            const users = await this.userRepository.paginate({
                ...payload,
                populate: [
                    {
                        path: 'roles.roleId',
                        model: 'Role',
                    },
                ],
            });
            if (!users || !users.data.length) {
                throw new common_1.NotFoundException('No users found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Admin Users found successfully',
                data: users,
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
    async findAll(payload) {
        try {
            payload.conditions.isDeleted = false;
            payload.conditions.isSuperAdmin = false;
            const role = await this.rolesRepository.byQuery({ name: 'User' });
            payload.conditions = this.buildOrQuery(payload.conditions);
            payload.conditions['roles.roleId'] = role._id;
            console.log(payload);
            const users = await this.userRepository.paginate({
                ...payload,
                populate: [
                    {
                        path: 'roles.roleId',
                        model: 'Role',
                    },
                ],
            });
            if (!users || !users.data.length) {
                throw new common_1.NotFoundException('No users found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Users found successfully',
                data: users,
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
    async findUserByEmail(email) {
        try {
            const user = await this.userRepository.byQuery({ email: email }, null, null, [
                {
                    path: 'roles.roleId',
                    model: 'Role',
                },
            ], '-createdAt');
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findUserByToken(authToken) {
        try {
            const user = await this.userRepository.byQuery({ authToken: authToken }, null, null, [
                {
                    path: 'roles.roleId',
                    model: 'Role',
                },
            ], '-createdAt');
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
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
            console.log(id);
            const user = await this.userRepository.byQuery({ _id: id }, null, null, [
                {
                    path: 'roles.roleId',
                    model: 'Role',
                },
            ], '-createdAt');
            console.log('USER>>>> ', user);
            if (!user || user instanceof Error) {
                throw new common_1.NotFoundException('User not found');
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User found successfully',
                data: user,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async update(id, payload) {
        try {
            const isExist = await this.userRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('User not found');
            }
            const updatedUser = await this.userRepository.findAndUpdate(id, {
                ...payload,
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User updated successfully',
                data: updatedUser,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async createSuperAdmin(payload) {
        try {
            console.log(payload);
            const isUserExists = await this.userRepository.exists({
                role: 'SuperAdmin',
            });
            if (isUserExists) {
                throw new common_1.HttpException('Superadmin already exists', 409);
            }
            const role = await this.rolesRepository.byQuery({ name: 'SuperAdmin' });
            const superAdmin = {
                email: payload.email,
                password: payload.password,
                fullName: payload.fullName,
                roles: [
                    {
                        roleId: role.id,
                        customPermissions: [],
                    },
                ],
                phoneNumber: payload.phoneNumber,
                confirmed: true,
                status: 'active',
            };
            const data = await this.userRepository.create(superAdmin);
            return {
                statusCode: 201,
                message: 'Superadmin created successfully',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error?.message, error?.statusCode);
        }
    }
    async createSystemAdmin(payload) {
        try {
            const isUserExists = await this.userRepository.exists({
                $and: [{ role: 'Admin' }, { email: payload.email }],
            });
            if (isUserExists) {
                throw new common_1.HttpException('Admin already exists', 409);
            }
            const role = await this.rolesRepository.byQuery({ name: 'Admin' });
            const superAdmin = {
                email: payload.email,
                password: payload.password,
                fullName: payload.fullName,
                roles: [
                    {
                        roleId: role.id,
                        customPermissions: [],
                    },
                ],
                phoneNumber: payload.phoneNumber,
                confirmed: true,
                status: 'active',
                state: payload.state,
                address: payload.address,
            };
            const data = await this.userRepository.create(superAdmin);
            return {
                statusCode: 201,
                message: 'Admin created successfully',
                data,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error?.message, error?.statusCode);
        }
    }
    async findByEmail(email, password) {
        try {
            const user = await this.userRepository.byQuery({ email: email }, ['+password'], null, [
                {
                    path: 'roles.roleId',
                    model: 'Role',
                },
            ]);
            if (!user || !(await user.comparePassword(password))) {
                throw new common_1.BadRequestException('Invalid email or password');
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error?.message, error?.statusCode);
        }
    }
    async userStatusChange(id, payload) {
        try {
            const isExist = await this.userRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.userRepository.update(id, {
                $set: { status: payload.status, statusReason: payload?.reason },
            });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                message: 'User ' + ' ' + payload.status + ' ' + ' updated successfully',
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
            const isExist = await this.userRepository.exists({ _id: id });
            if (!isExist) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.userRepository.update({ _id: id }, { isDeleted: true, deletedAt: new Date() });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                message: 'User deleted successfully',
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
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        email_service_1.EmailService,
        auth_repository_1.RoleRepository,
        cloudinary_service_1.CloudinaryService])
], UsersService);
