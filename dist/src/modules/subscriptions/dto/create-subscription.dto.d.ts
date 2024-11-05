declare class RenewalSettingsDto {
    renewBeforeDays: number;
    maxRetryCount: number;
    retryIntervalInDays: number;
}
declare class ImageDto {
    publicId: string;
    imageValue: string;
}
export declare class CreateSubscriptionDto {
    name: string;
    image?: ImageDto;
    description?: string;
    price: number;
    durationInMonths?: number;
    isRecurring?: boolean;
    renewalSettings?: RenewalSettingsDto;
    services?: string[];
}
export declare class PaginateSubsDto {
    page?: number;
    limit?: number;
    sort?: string;
    conditions?: object | any;
}
export declare class CreateAddonDto {
    name: string;
    image?: ImageDto;
    description?: string;
    price: number;
}
export {};
