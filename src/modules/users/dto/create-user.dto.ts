/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ObjectId, Schema } from 'mongoose';

export enum UserStatusEnum {
  SUSPEND = 'suspend',
  BAN = 'ban',
  UNBAN = 'unban',
  UNSUSPEND = 'unsuspended',
}

export class CreateUserDto {
  @IsString()
  @Length(11)
  phoneNumber: string;

  @IsString()
  @Length(2, 50)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  address?: string;

  readonly googleId?: string;

  readonly ProfilePicture?: string;

  readonly accessToken?: string;

  readonly refreshToken?: string;
}

export class UpdateStatusDto {
  @IsMongoId()
  id: ObjectId;

  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}

export class SubscribeItemDto {
  @IsArray()
  @IsMongoId({ each: true })
  readonly subscription: [Schema.Types.ObjectId];

  @IsArray()
  @IsMongoId({ each: true })
  readonly addons: Schema.Types.ObjectId[];

  // @IsDate()
  // @Type(() => Date)
  // readonly endDate: Date;

  @IsNumber()
  @Type(() => Number)
  duration: number;

  @IsBoolean()
  @Type(() => Boolean)
  readonly isAutoRenew: boolean;
}

export class CreateSubscribeDto {
  // @IsMongoId()
  // // @IsNotEmpty()
  // user?: any;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SubscribeItemDto)
  item: SubscribeItemDto;

  totalAmount?: number;

  // @IsEnum(['credit_card', 'paypal', 'bank_transfer'])
  // @IsNotEmpty()
  paymentMethod?: 'credit_card' | 'paypal' | 'bank_transfer';

  // @IsEnum(['Stripe', 'Paystack', 'Flutterwave'])
  // @IsNotEmpty()
  paymentGateway?: 'Stripe' | 'Paystack' | 'Flutterwave';
}

export class PaginateDto {
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

export class PaginateUserDto {
  page?: number;
  limit?: number;
  sort?: string;
  conditions?: object | any;
}
