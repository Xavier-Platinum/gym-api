import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResendOtpDto, ValidateUserDto, VerifyOtpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    create(createAuthDto: CreateAuthDto): Promise<string>;
    register(payload: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    registerSuperAdmin(payload: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    getProtected(req: any): Promise<{
        message: string;
        user: any;
    }>;
    validateUser(payload: ValidateUserDto): Promise<any>;
    login(payload: ValidateUserDto | any): Promise<any>;
    forgotPassword(payload: {
        email: string;
    } | any): Promise<any>;
    verifyToken(payload: {
        token: string;
    } | any, req: Request): Promise<any>;
    resetPassword(payload: {
        password: string;
    } | any, req: Request): Promise<any>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {};
    }>;
    resendOtp(payload: ResendOtpDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {};
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    findAll(): Promise<string>;
    findOne(id: any): Promise<string>;
    update(id: any, updateAuthDto: UpdateAuthDto): Promise<string>;
    remove(id: any): Promise<string>;
}
