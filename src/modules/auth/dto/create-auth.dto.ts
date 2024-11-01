/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsMongoId,
  IsArray,
  Length,
} from 'class-validator';

export class CreateAuthDto {}

export class ValidateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly deviceToken: string;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions: string[];
}
export class VerifyOtpDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

export class ResendOtpDto {
  @IsEmail()
  email: string;
}
