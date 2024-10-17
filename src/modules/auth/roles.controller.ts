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
import { Roles } from './decorators/auth.decorator';
import { ROLES } from './interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(ROLES.SuperAdmin)
  create(@Body() payload: CreateRoleDto) {
    return this.rolesService.create(payload);
  }

  @Get()
  @Roles(ROLES.SuperAdmin)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin)
  findOne(@Param('id') id: any) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLES.SuperAdmin)
  update(@Param('id') id: any, @Body() payload: UpdateRoleDto) {
    return this.rolesService.update(id, payload);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  remove(@Param('id') id: any) {
    return this.rolesService.remove(id);
  }
}
