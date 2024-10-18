import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTransactionDto,
  PaginateTransactionDto,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './entities/transaction.repository';
import { FilterQuery } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  async create(payload: CreateTransactionDto) {
    try {
      // TODO: check duplicate by OrderId
      // const isExists = await this.transactionRepository.exists({
      //   name: payload.name,
      // });

      // if (isExists) {
      //   throw new HttpException('Subscription already exists', 409);
      // }

      await this.transactionRepository.create({ ...payload });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subscription created successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private buildOrQuery(
    conditions: Partial<Record<string, any>>,
  ): FilterQuery<any> {
    const orConditions = [];

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        orConditions.push({ [key]: value });
      }
    }

    return orConditions.length > 0 ? { $or: orConditions } : {};
  }

  async findAll(payload: PaginateTransactionDto) {
    try {
      payload.conditions = this.buildOrQuery(payload.conditions);

      const data = await this.transactionRepository.paginate({
        ...payload,
        populate: [
          {
            path: 'userId',
            model: 'User',
            select: '-createdAt -updatedAt',
          },
          {
            path: 'orderId',
            model: 'Order',
            select: '-createdAt -updatedAt',
          },
        ],
      });

      if (!data || data.data.length) {
        throw new NotFoundException('No subscriptions found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscriptions found successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: any) {
    try {
      const sub = await this.transactionRepository.byQuery(
        {
          _id: id,
        },
        null,
        null,
        [
          {
            path: 'userId',
            model: 'User',
            select: '-createdAt -updatedAt',
          },
          {
            path: 'orderId',
            model: 'Order',
            select: '-createdAt -updatedAt',
          },
        ],
        '-createdAt',
      );

      if (!sub) {
        throw new NotFoundException('Subscription not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription found successfully',
        data: sub,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: any, payload: UpdateTransactionDto) {
    try {
      const isExist = await this.transactionRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      const update = await this.transactionRepository.update(
        { _id: id },
        {
          payload,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription updated successfully',
        data: update,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: any) {
    try {
      const isExist = await this.transactionRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Subscription not found');
      }

      await this.transactionRepository.update(
        { _id: id },
        {
          isArchived: true,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Subscription deleted successfully',
        data: {},
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
