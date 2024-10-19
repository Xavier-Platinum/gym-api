import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async create(@Body() payload: CreateOrderDto, @Req() req: { user: any }) {
    payload.userId = req.user._id;
    return await this.orderService.create(payload);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.orderService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get('/my-orders')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async findUserOrders(@Query() payload: any, @Req() req: { user: any }) {
    const { page, limit, sort, ...others } = payload;
    const id = req.user._id as any;
    console.log(id);
    return await this.orderService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { userId: id, ...others },
    });
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async findById(@Param('id') id: any) {
    return await this.orderService.findById(id);
  }

  @Put(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async update(@Param('id') id: any, @Body() payload: UpdateOrderDto) {
    return await this.orderService.update(id, payload);
  }
}
