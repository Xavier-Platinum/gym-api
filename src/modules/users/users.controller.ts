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
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateStatusDto,
  UserStatusEnum,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Post('/register')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLES.SuperAdmin, ROLES.User)
  async register(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async profile(@Request() req: any) {
    const user = req.user;
    console.log(req.user);
    return await this.usersService.findOne(user._id);
  }

  @Post('/:id/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async findOne(@Param('id') id: any) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async update(@Param('id') id: any, @Body() payload: UpdateUserDto) {
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async remove(@Param('id') id: any) {
    return await this.usersService.remove(id);
  }
}
