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
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.createSuperAdmin(payload);
  }

  @Post('/superadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async registerSuperAdmin(@Body() payload: CreateUserDto) {
    return await this.usersService.createSuperAdmin(payload);
  }

  @Post('/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async registerAdmin(
    @Body()
    payload: {
      email: string;
      password: string;
      fullName: string;
      phoneNumber: string;
      state: string;
      address: string;
    },
  ) {
    return await this.usersService.createSystemAdmin(payload);
  }

  @Post('/register')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async register(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async profile(@Req() req: Request) {
    const user = req.user as any;
    console.log(req.user);
    return await this.usersService.findOne(user?._id);
  }

  @Patch('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async updateProfile(
    @Req() req: Request,
    @Body()
    payload: Omit<
      UpdateUserDto,
      | 'email'
      | 'phoneNumber'
      | 'roles'
      | 'confirmed'
      | 'secretToken'
      | 'status'
      | 'statusReason'
      | 'isSuperAdmin'
      | 'isDeleted'
      | 'subscriptions'
      | 'deviceToken'
      | 'id'
      | '_id'
      | ''
    >,
  ) {
    const user = req.user as any;
    console.log(user?._id);
    return await this.usersService.update(user?._id, payload);
  }

  @Patch('/updatePassword')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async updatePassword(
    @Req() req: Request,
    @Body()
    payload: { oldPassword: string; newPassword: string },
  ) {
    const user = req.user as any;
    console.log(user?._id);
    return await this.usersService.changePassword(
      user?._id,
      payload?.oldPassword,
      payload?.newPassword,
    );
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

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: any },
  ) {
    const id = req.user._id;
    return this.usersService.updateProfilePicture(id, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.usersService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get('/admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async findAllAdmins(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.usersService.findAllAdmins({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async findOne(@Param('id') id: any) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async update(@Param('id') id: any, @Body() payload: UpdateUserDto) {
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async remove(@Param('id') id: any) {
    return await this.usersService.remove(id);
  }
}
