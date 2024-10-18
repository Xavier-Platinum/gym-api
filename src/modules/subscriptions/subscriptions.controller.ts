import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() payload: CreateSubscriptionDto) {
    return this.subscriptionsService.create(payload);
  }

  @Get()
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
  findOne(@Param('id') id: any) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() payload: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.subscriptionsService.remove(id);
  }
}
