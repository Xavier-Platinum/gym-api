import { Schema } from 'mongoose';
export interface IAddOn {
    _id: Schema.Types.ObjectId | any;
    name: string;
    image: {
        publicId: string;
        imageValue: string;
    };
    price: number;
    description: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISubscription {
    readonly _id: Schema.Types.ObjectId | any;
    type: string;
    name: string;
    image: {
        publicId: string;
        imageValue: string;
    };
    description: string;
    price: number;
    durationInMonths: number;
    isRecurring: boolean;
    renewalSettings: IRenewalSettings;
    services: string[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IRenewalSettings {
    renewBeforeDays: number;
    maxRetryCount: number;
    retryIntervalInDays: number;
}
export declare class CreateSubscriptionDto {
    name: string;
    description: string;
    price: number;
    durationInMonths: number;
    isRecurring: boolean;
    services: string[];
}
export declare class UpdateSubscriptionDto {
    name?: string;
    description?: string;
    price?: number;
    durationInMonths?: number;
    isRecurring?: boolean;
    services?: string[];
}
