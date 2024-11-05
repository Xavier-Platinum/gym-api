export declare class CreateAuthDto {
}
export declare class ValidateUserDto {
    readonly email: string;
    readonly password: string;
    readonly deviceToken: string;
}
export declare class CreateRoleDto {
    name: string;
    permissions: string[];
}
export declare class VerifyOtpDto {
    email?: string;
    otp: string;
}
export declare class ResendOtpDto {
    email: string;
}
