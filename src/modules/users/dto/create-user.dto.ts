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
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(2, 50)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
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
