import { Schema } from 'mongoose';

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

// dtos/subscription.dto.ts
export class CreateSubscriptionDto {
  name: string;
  description: string;
  price: number;
  durationInMonths: number;
  isRecurring: boolean;
  services: string[];
}

export class UpdateSubscriptionDto {
  name?: string;
  description?: string;
  price?: number;
  durationInMonths?: number;
  isRecurring?: boolean;
  services?: string[];
}
