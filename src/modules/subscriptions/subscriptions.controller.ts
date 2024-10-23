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
  create(
    @Body() payload: CreateSubscriptionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(payload);
    return this.subscriptionsService.create(payload, image);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return this.subscriptionsService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin)
  findOne(@Param('id') id: any) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  update(
    @Param('id') id: any,
    @Body() payload: UpdateSubscriptionDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.subscriptionsService.update(id, payload, image);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  remove(@Param('id') id: any) {
    return this.subscriptionsService.remove(id);
  }
}
