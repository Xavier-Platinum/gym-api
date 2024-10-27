import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  async create(
    @Body() payload: CreateSubscriptionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(payload);
    return await this.subscriptionsService.create(payload, image);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.subscriptionsService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async findOne(@Param('id') id: any) {
    return await this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  async update(
    @Param('id') id: any,
    @Body() payload: UpdateSubscriptionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.subscriptionsService.update(id, payload, image);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  async remove(@Param('id') id: any) {
    return await this.subscriptionsService.remove(id);
  }
}
