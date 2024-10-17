/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto, CreateRoleDto } from './dto/create-auth.dto';
import { UpdateAuthDto, UpdateRoleDto } from './dto/update-auth.dto';
import { ObjectId } from 'mongoose';
import { RoleRepository } from './entities/auth.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RoleRepository) {}
  async create(payload: CreateRoleDto) {
    try {
      const isExist = await this.rolesRepository.exists({ name: payload.name });

      if (isExist) {
        throw new BadRequestException('Role already exists');
      }

      const role = await this.rolesRepository.create(payload);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Role created successfully',
        data: role,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const roles = await this.rolesRepository.all({});

      if (!roles || !roles.length) {
        throw new NotFoundException('No roles found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Roles found successfully',
        data: roles,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: any) {
    try {
      const role = await this.rolesRepository.byQuery(
        { _id: id },
        null,
        null,
        null,
        '-createdAt',
      );

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Role found successfully',
        data: role,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: any, payload: UpdateRoleDto) {
    try {
      const isExist = await this.rolesRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Role not found');
      }

      const updatedRole = await this.rolesRepository.update(
        { _id: id },
        {
          $set: { permissions: payload.permissions },
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Role updated successfully',
        data: updatedRole,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: any) {
    try {
      const isExist = await this.rolesRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Role not found');
      }

      await this.rolesRepository.delete({ _id: id });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
