/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { PaymentGatewayFactory } from '../payments/gateway.factory';
import { UserRepository } from '../users/entities/user.repository';
import { OrderRepository } from '../order/entities/order.repository';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
    private readonly userRepository: UserRepository,
    private readonly order: OrderRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('transaction.create')
  async OrderTransaction(payload: CreateTransactionDto) {
    try {
      return await this.create(payload);
    } catch (error) {
      return {
        success: false,
        message: error?.message,
      };
      throw new Error(error);
    }
  }

  async create(payload: CreateTransactionDto) {
    try {
      // TODO: check duplicate by OrderId
      const isExists = await this.transactionRepository.exists({
        orderId: payload.orderId,
      });

      if (isExists) {
        throw new HttpException('Transaction already exists', 409);
      }

      const user = await this.userRepository.byID(payload.userId);

      const transactionRef = await this.generateTransactionRef();

      const paymentGateway = this.paymentGatewayFactory.getGateway(
        payload?.paymentGateway,
      );

      const paymentResponse = await paymentGateway.initiatePayment(
        payload?.amount,
        user,
        transactionRef,
      );

      await this.transactionRepository.create({
        ...payload,
        transactionRef,
        status: paymentResponse?.status,
        paymentMetadata: paymentResponse.metadata,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaction initiated successfully',
        data: { url: paymentResponse.metadata.data.authorization_url },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, error?.getStatus());
      }
      throw new InternalServerErrorException(error);
    }
  }

  private async generateTransactionRef(): Promise<string> {
    return 'TXN-' + Date.now();
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

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.transactionRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Transactions found successfully',
      data,
    };
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
        message: 'Transactions found successfully',
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
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async history(userId: any) {
    try {
      const sub = await this.transactionRepository.byQuery(
        {
          userId: userId,
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
        message: 'Subscription history',
        data: sub,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async verifyTransaction(
    transactionRef: string,
    gateway: string,
    webhook: boolean,
    transaction_id: string,
  ) {
    const isExist = await this.transactionRepository.byQuery({
      transactionRef: transactionRef,
    });

    if (!isExist) {
      throw new NotFoundException('Transaction not found');
    }

    if (isExist?.status === 'success') {
      throw new HttpException(
        'Transaction has already been verified successful.',
        409,
      );
    }

    const paymentGateway = this.paymentGatewayFactory.getGateway(gateway);
    const verificationResponse = await paymentGateway.verifyPayment(
      transaction_id || transactionRef,
    );

    const data = await this.transactionRepository.update(
      { transactionRef: transactionRef },
      {
        status: verificationResponse.status,
        webhookVerified: webhook,
        paymentMetadata: verificationResponse.metadata,
        paymentMethod: verificationResponse.paymentMethod,
      },
    );

    this.eventEmitter.emit('transaction.verified', {
      orderId: data?.orderId,
      status: verificationResponse.status,
      paymentMethod: verificationResponse.paymentMethod,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Transaction verified successfully',
      data: {},
    };
  }

  async update(id: any, payload: UpdateTransactionDto) {
    try {
      const isExist = await this.transactionRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('Transaction not found');
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
