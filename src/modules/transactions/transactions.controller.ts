import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async create(
    @Body() payload: CreateTransactionDto,
    @Req() req: { user: any },
  ) {
    console.log(req.user);
    payload.userId = req.user._id;
    return await this.transactionsService.create(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.transactionsService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get('/verify')
  // @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async verify(
    @Query()
    {
      transactionRef,
      gateway,
      webhook,
      transaction_id,
    }: {
      transactionRef: string;
      gateway: 'credit_card' | 'paypal' | 'bank_transfer';
      webhook: boolean;
      transaction_id: string;
    },
  ) {
    return await this.transactionsService.verifyTransaction(
      transactionRef,
      gateway,
      webhook,
      transaction_id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async findOne(@Param('id') id: any) {
    return await this.transactionsService.findOne(id);
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async history(@Param('userId') id: any) {
    return await this.transactionsService.history(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async update(@Param('id') id: any, @Body() payload: UpdateTransactionDto) {
    return await this.transactionsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin)
  async remove(@Param('id') id: any) {
    return await this.transactionsService.remove(id);
  }
}
