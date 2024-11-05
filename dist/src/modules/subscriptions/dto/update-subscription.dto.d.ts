import { CreateSubscriptionDto, CreateAddonDto } from './create-subscription.dto';
declare const UpdateSubscriptionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSubscriptionDto>>;
export declare class UpdateSubscriptionDto extends UpdateSubscriptionDto_base {
    name?: string;
    description?: string;
    price?: number;
    durationInMonths?: number;
    isRecurring?: boolean;
    services?: string[];
    isArchived?: boolean;
}
declare const UpdateAddonDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAddonDto>>;
export declare class UpdateAddonDto extends UpdateAddonDto_base {
}
export {};
