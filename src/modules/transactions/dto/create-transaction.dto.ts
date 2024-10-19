import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  userId?: any;

  @IsMongoId()
  @IsNotEmpty()
  orderId: any;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(['credit_card', 'paypal', 'bank_transfer'])
  @IsNotEmpty()
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';

  @IsEnum(['Stripe', 'Paystack', 'Flutterwave'])
  @IsNotEmpty()
  paymentGateway: 'Stripe' | 'Paystack' | 'Flutterwave';
}

export class PaginateTransactionDto {
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
