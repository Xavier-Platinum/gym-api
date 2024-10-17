import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../interfaces';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
