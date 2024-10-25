import { IsOptional, IsNumber, IsString, IsObject } from 'class-validator';

export class CreateRecommendationDto {
  [key: string]: any;
}
export class PaginateRecoDto {
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
