import {
  IsEnum,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  // IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Schema } from 'mongoose';

// class OrderItemDto {
//   @IsMongoId()
//   readonly subscriptionId: Schema.Types.ObjectId;

//   @IsArray()
//   @IsMongoId({ each: true })
//   readonly addons: Schema.Types.ObjectId[];

//   @IsNumber()
//   readonly price: number;

//   @IsNumber()
//   readonly durationInMonths: number;

//   @IsBoolean()
//   readonly isRecurring: boolean;
// }

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Schema.Types.ObjectId)
  items: Schema.Types.ObjectId[];

  totalAmount: number;

  @IsEnum(['credit_card', 'paypal', 'bank_transfer'])
  @IsNotEmpty()
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
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
