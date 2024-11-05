import { ObjectId, Schema } from 'mongoose';
export declare enum UserStatusEnum {
    SUSPEND = "suspend",
    BAN = "ban",
    UNBAN = "unban",
    UNSUSPEND = "unsuspended"
}
export declare class CreateUserDto {
    phoneNumber: string;
    fullName: string;
    email: string;
    password: string;
    role?: string;
    state?: string;
    address?: string;
    readonly googleId?: string;
    readonly ProfilePicture?: string;
    readonly accessToken?: string;
    readonly refreshToken?: string;
}
export declare class UpdateStatusDto {
    id: ObjectId;
    status: UserStatusEnum;
}
export declare class SubscribeItemDto {
    readonly subscription: [Schema.Types.ObjectId];
    readonly addons: Schema.Types.ObjectId[];
    readonly duration: number;
    readonly isAutoRenew: boolean;
}
export declare class CreateSubscribeDto {
    item: SubscribeItemDto;
    totalAmount?: number;
    paymentMethod?: 'credit_card' | 'paypal' | 'bank_transfer';
    paymentGateway?: 'Stripe' | 'Paystack' | 'Flutterwave';
}
export declare class PaginateDto {
    page?: number;
    limit?: number;
    sort?: string;
    conditions?: object | any;
}
export declare class PaginateUserDto {
    page?: number;
    limit?: number;
    sort?: string;
    conditions?: object | any;
}
