/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-auth.dto';
import { UpdateRoleDto } from './dto/update-auth.dto';
import { RolesService } from './roles.service';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './auth.decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('SuperAdmin')
  create(@Body() payload: CreateRoleDto) {
    return this.rolesService.create(payload);
  }

  @Get()
  @Roles('SuperAdmin')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('SuperAdmin')
  findOne(@Param('id') id: ObjectId) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles('SuperAdmin')
  update(@Param('id') id: ObjectId, @Body() payload: UpdateRoleDto) {
    return this.rolesService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SuperAdmin')
  remove(@Param('id') id: ObjectId) {
    return this.rolesService.remove(id);
  }
}
