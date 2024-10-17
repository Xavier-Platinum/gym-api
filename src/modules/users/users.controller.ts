import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateStatusDto,
  UserStatusEnum,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/auth.decorator';
import { RolesGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Roles('SuperAdmin', 'User')
  @Post('/register')
  async register(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Post('/:id/:status')
  @Roles('SuperAdmin')
  async updateUserStatus(
    @Param() param: UpdateStatusDto,
    @Body() payload: { status: string; reason?: string },
  ) {
    if (param.status === UserStatusEnum.SUSPEND && !payload.reason) {
      throw new BadRequestException('Reason is required for suspendion');
    } else if (param.status === UserStatusEnum.BAN && !payload.reason) {
      throw new BadRequestException('Reason is required for ban');
    }
    return await this.usersService.userStatusChange(param.id, payload);
  }

  @Get()
  @Roles('SuperAdmin')
  async findAll(@Param() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.usersService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @Roles('SuperAdmin', 'User')
  async findOne(@Param('id') id: ObjectId) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('SuperAdmin', 'User')
  async update(@Param('id') id: ObjectId, @Body() payload: UpdateUserDto) {
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SuperAdmin', 'User')
  async remove(@Param('id') id: ObjectId) {
    return await this.usersService.remove(id);
  }
}
