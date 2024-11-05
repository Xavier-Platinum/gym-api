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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../../common/services/email/email.service");
const config_1 = require("@nestjs/config");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
const moment_1 = __importDefault(require("moment"));
const user_repository_1 = require("../users/entities/user.repository");
const auth_repository_1 = require("./entities/auth.repository");
let AuthService = class AuthService {
    constructor(userService, jwtService, emailService, configService, uploadService, userRepository, rolesRepository) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.configService = configService;
        this.uploadService = uploadService;
        this.userRepository = userRepository;
        this.rolesRepository = rolesRepository;
        this.otps = new Map();
    }
    generateOtp() {
        const now = new Date();
        const otp = (now.getTime() % 1000000).toString().padStart(6, '0');
        return otp;
    }
    async sendOtp(email) {
        const otp = this.generateOtp();
        const expiration = (0, moment_1.default)().add(10, 'minutes').toDate();
        this.otps.set(otp, { otp, expiration, email });
        await this.userService.updateOtp(email, { secretToken: otp.toString() });
        console.log(`Sending OTP ${otp} to email: ${email}`);
        return otp;
    }
    async verifyOtp(otp) {
        const record = this.otps.get(otp);
        if (!record) {
            throw new common_1.BadRequestException('No OTP was sent to this email.');
        }
        const { otp: savedOtp, expiration, email: savedEmail } = record;
        if ((0, moment_1.default)().isAfter(expiration)) {
            this.otps.delete(savedOtp);
            throw new common_1.BadRequestException('OTP has expired.');
        }
        if (savedOtp !== otp) {
            throw new common_1.BadRequestException('Invalid OTP.');
        }
        await this.userService.updateOtp(savedEmail, {
            secretToken: 'null',
            status: 'active',
            confirmed: true,
        });
        await this.emailService.sendMail(savedEmail, 'Verification successful', 'Your account has been verified successfully', `<div>
        <h1>Your account has been verified successfully.</h1>
      </div>`);
        this.otps.delete(savedOtp);
        return true;
    }
    async register(payload) {
        try {
            const isExist = await this.userRepository.exists({
                $or: [
                    { email: payload?.email },
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
            const otp = await this.sendOtp(payload?.email);
            await this.emailService.sendMail(payload?.email, 'Registration successful', 'Your account has been registered successfully', `<div>
          <h1>Your account has been registered successfully.</h1>
          <p>To verify your email, please use the token below</p>
          <span>${otp}</span>
        </div>`);
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: 'User created successfully, please verify account with token sent to your email',
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
    async resendOtp(email) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        if (user?.confirmed) {
            throw new common_1.BadRequestException('User has already confirmed their email.');
        }
        const record = this.otps.get(email);
        if (record && (0, moment_1.default)().isBefore(record.expiration)) {
            throw new common_1.BadRequestException('You can only request a new OTP after the previous one expires.');
        }
        return await this.sendOtp(email);
    }
    async validateOAuthLogin(email, fullName, googleId, ProfilePicture, phoneNumber, firstName, profilePictureMetaData, lastName, accessToken, refreshToken) {
        try {
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                const newUser = await this.userService.create({
                    email,
                    fullName,
                    googleId,
                    ProfilePicture,
                    phoneNumber,
                    password: '',
                });
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: 'Successfully signed up',
                    data: {
                        accessToken: this.jwtService.sign({
                            email: newUser?.data?.email,
                            sub: newUser?.data?._id,
                            role: newUser?.data?.roles,
                        }, {
                            secret: this.configService.get('JWT_SECRET'),
                        }),
                        user,
                    },
                };
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Successfully signed in',
                data: {
                    accessToken: this.jwtService.sign({
                        email: user.email,
                        sub: user._id,
                        role: user.roles,
                    }, {
                        secret: this.configService.get('JWT_SECRET'),
                    }),
                    user,
                },
            };
        }
        catch (err) {
            throw new common_1.BadRequestException('Failed to validate OAuth login');
        }
    }
    async create(payload) {
        try {
            return 'This action adds a new auth';
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async validateUser(email, password, deviceToken) {
        try {
            const user = await this.userService.findByEmail(email, password);
            if (user) {
                return await this.login(user, deviceToken);
            }
            throw new common_1.UnauthorizedException();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw new common_1.BadRequestException(error?.message);
            }
            else {
                throw new common_1.HttpException(error?.message, error?.statusCode);
            }
        }
    }
    async login(user, deviceToken) {
        const payload = {
            email: user.email,
            sub: user._id,
            role: user.roles,
        };
        user.password = '';
        await this.userRepository.findAndUpdate({ email: user?.email }, {
            $set: {
                deviceToken: deviceToken,
            },
        });
        return {
            status: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: {
                access_token: this.jwtService.sign(payload, {
                    secret: this.configService.get('JWT_SECRET'),
                }),
                user: user,
            },
        };
    }
    generateToken() {
        const token = Math.floor(100000 + Math.random() * 900000);
        return token.toString();
    }
    async forgotPassword(email) {
        try {
            if (!email) {
                throw new common_1.HttpException('Email is required', 400);
            }
            const user = await this.userService.findUserByEmail(email);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const authToken = this.generateToken();
            const token = this.jwtService.sign({ email: user.email, sub: user.id }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '10m',
            });
            await this.userService.update(user?._id, { authToken });
            await this.emailService.sendMail(user?.email, 'Reset Password', 'You requested to reset your password use this token to reset your password token: ' +
                authToken, `<h1>You requested to reset your password.</h1><p>Use this token to reset your password: <strong>${authToken}</strong></p>`);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Otp has been sent to your email to reset your password',
                data: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async verifyToken(token, payload) {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (!decoded) {
                throw new common_1.HttpException('Token verification failed or expired', 400);
            }
            const user = await this.userService.findUserByToken(payload.token);
            if (!user || user.authToken === 'null') {
                throw new common_1.NotFoundException('Verification failed, please try again');
            }
            const newToken = this.jwtService.sign({ email: user.email, sub: user.id }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '3h',
            });
            await this.userRepository.findAndUpdate(user?._id, {
                $set: { authToken: 'null' },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Verification successful',
                data: newToken,
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
    async resetPassword(token, payload) {
        try {
            if (!token) {
                throw new common_1.HttpException('auth-token header is required', 400);
            }
            if (payload.password) {
                throw new common_1.HttpException('password is required', 400);
            }
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (!decoded) {
                throw new common_1.HttpException('Session expired please try again', 400);
            }
            const user = await this.userRepository.byQuery({ email: decoded?.email });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.userRepository.findAndUpdate(user._id, {
                $set: { password: payload.password },
            });
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Password reset successfully',
            };
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await this.userService.findOne(userId);
            if (!user || !(await user.data.comparePassword(oldPassword))) {
                throw new common_1.UnauthorizedException('Old password is incorrect');
            }
            await this.userService.update(userId, { password: newPassword });
            return {
                statusCode: common_1.HttpStatus.NO_CONTENT,
                message: 'Password changed successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async findAll() {
        return `This action returns all auth`;
    }
    async findOne(id) {
        return `This action returns a #${id} auth`;
    }
    async update(id, payload) {
        return `This action updates a #${id} auth`;
    }
    async remove(id) {
        return `This action removes a #${id} auth`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        config_1.ConfigService,
        cloudinary_service_1.CloudinaryService,
        user_repository_1.UserRepository,
        auth_repository_1.RoleRepository])
], AuthService);
