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
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(ROLES.SuperAdmin)
  create(@Body() payload: CreateSubscriptionDto) {
    console.log(payload);
    return this.subscriptionsService.create(payload);
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
  @Roles(ROLES.SuperAdmin)
  update(@Param('id') id: any, @Body() payload: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, payload);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  remove(@Param('id') id: any) {
    return this.subscriptionsService.remove(id);
  }
}
