import { IsEnum, IsNotEmpty, IsArray, ValidateNested, IsMongoId, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  subscriptionId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

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
