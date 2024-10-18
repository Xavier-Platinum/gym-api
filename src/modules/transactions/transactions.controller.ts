import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() payload: CreateTransactionDto) {
    return this.transactionsService.create(payload);
  }

  @Get()
  findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return this.transactionsService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() payload: UpdateTransactionDto) {
    return this.transactionsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.transactionsService.remove(id);
  }
}
