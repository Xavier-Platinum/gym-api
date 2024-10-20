import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ObjectId } from 'mongoose';

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

export class PaginateUserDto {
  page?: number;
  limit?: number;
  sort?: string;
  conditions?: object | any;
}
