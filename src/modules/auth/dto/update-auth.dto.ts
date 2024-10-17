import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto, CreateRoleDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
