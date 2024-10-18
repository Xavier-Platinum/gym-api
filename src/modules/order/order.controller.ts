import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() payload: CreateOrderDto) {
    return await this.orderService.create(payload);
  }

  @Get(':id')
  async findById(@Param('id') id: any) {
    return await this.orderService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: any, @Body() payload: UpdateOrderDto) {
    return await this.orderService.update(id, payload);
  }
}
