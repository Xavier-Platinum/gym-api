import { HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/common/services/email/email.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { UserRepository } from '../users/entities/user.repository';
import { RoleRepository } from './entities/auth.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private readonly emailService;
    private configService;
    private readonly uploadService;
    private readonly userRepository;
    private readonly rolesRepository;
    constructor(userService: UsersService, jwtService: JwtService, emailService: EmailService, configService: ConfigService, uploadService: CloudinaryService, userRepository: UserRepository, rolesRepository: RoleRepository);
    private otps;
    generateOtp(): string;
    sendOtp(email: string): Promise<any>;
    verifyOtp(otp: string): Promise<boolean>;
    register(payload: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    resendOtp(email: string): Promise<string>;
    validateOAuthLogin(email: string, fullName: string, googleId: any, ProfilePicture: any, phoneNumber: string, firstName?: string, profilePictureMetaData?: any, lastName?: string, accessToken?: any, refreshToken?: any): Promise<any>;
    create(payload: CreateAuthDto): Promise<string>;
    validateUser(email: string, password: string, deviceToken: string): Promise<any>;
    login(user: any, deviceToken: string): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            access_token: string;
            user: any;
        };
    }>;
    private generateToken;
    forgotPassword(email: string): Promise<any>;
    verifyToken(token: string, payload: any): Promise<any>;
    resetPassword(token: string, payload: any): Promise<any>;
    changePassword(userId: any, oldPassword: string, newPassword: string): Promise<any>;
    findAll(): Promise<string>;
    findOne(id: any): Promise<string>;
    update(id: any, payload: UpdateAuthDto): Promise<string>;
    remove(id: any): Promise<string>;
}
