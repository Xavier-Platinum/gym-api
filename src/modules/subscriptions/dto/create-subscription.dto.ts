export class CreateSubscriptionDto {
  name: string;
  description?: string;
  price: number;
  durationInMonths: number;
  isRecurring: boolean;
  renewalSettings: {
    renewBeforeDays: number;
    maxRetryCount: number;
    retryIntervalInDays: number;
  };
  services: string[];
}

export class PaginateSubsDto {
  page?: number;
  limit?: number;
  sort?: string;
  conditions?: object | any;
}
