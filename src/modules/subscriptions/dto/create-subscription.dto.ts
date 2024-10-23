import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class RenewalSettingsDto {
  @IsNumber()
  @Type(() => Number)
  renewBeforeDays: number;

  @IsNumber()
  @Type(() => Number)
  maxRetryCount: number;

  @IsNumber()
  @Type(() => Number)
  retryIntervalInDays: number;
}

class ImageDto {
  @IsString()
  publicId: string;

  @IsString()
  imageValue: string;
}

export class CreateSubscriptionDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  durationInMonths: number;

  @IsBoolean()
  @Type(() => Boolean)
  isRecurring: boolean;

  @ValidateNested()
  @Type(() => RenewalSettingsDto)
  renewalSettings: RenewalSettingsDto;

  @IsArray()
  @IsString({ each: true })
  services: string[];
}

export class PaginateSubsDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsObject()
  conditions?: object | any;
}

export class CreateAddonDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;
}
