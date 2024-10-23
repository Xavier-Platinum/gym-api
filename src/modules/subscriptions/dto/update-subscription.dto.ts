import { PartialType } from '@nestjs/mapped-types';
import {
  CreateSubscriptionDto,
  CreateAddonDto,
} from './create-subscription.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  name?: string;
  description?: string;
  price?: number;
  durationInMonths?: number;
  isRecurring?: boolean;
  //   renewalSettings?: {
  //     renewBeforeDays?: number;
  //     maxRetryCount?: number;
  //     retryIntervalInDays?: number;
  //   };
  services?: string[];
  isArchived?: boolean;
}

export class UpdateAddonDto extends PartialType(CreateAddonDto) {}
