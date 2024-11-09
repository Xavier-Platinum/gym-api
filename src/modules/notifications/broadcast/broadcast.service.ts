import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BroadcastRepository } from './entities/broadcast.repository';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';
import { IBroadcast } from './interfaces/index';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BroadcastService {
  constructor(
    private readonly broadcastRepository: BroadcastRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async createBroadcast(
    payload: CreateBroadcastDto,
  ): Promise<IBroadcast | any> {
    const data = await this.broadcastRepository.create(payload);
    this.eventEmitter.emit('BroadcastNotification', {
      title: 'Broadcast Notification',
      // body: JSON.stringify({
      //   message: 'New addon added check it out.',
      //   data: {
      //     name: addon.name,
      //     _id: addon?._id,
      //     description: addon?.description,
      //     image: addon?.image,
      //   },
      // }),
      body: 'New broadcaat added check it out.',
      tag: 'Broadcast',
      resourceId: data?._id,
    });
    return {
      statusCode: 201,
      message: 'Broadcast created successfully',
      data: data,
    };
  }

  async getBroadcastById(id: string): Promise<IBroadcast | any> {
    try {
      const broadcast = await this.broadcastRepository.byID(id);
      if (!broadcast)
        throw new NotFoundException(`Broadcast with ID ${id} not found`);
      return {
        statusCode: 201,
        message: 'Broadcast created successfully',
        data: broadcast,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new InternalServerErrorException();
    }
  }

  async updateBroadcast(
    id: string,
    updateBroadcastDto: UpdateBroadcastDto,
  ): Promise<IBroadcast | any> {
    try {
      const updatedBroadcast = await this.broadcastRepository.findAndUpdate(
        { _id: id },
        { ...updateBroadcastDto },
      );
      if (!updatedBroadcast)
        throw new NotFoundException(`Broadcast with ID ${id} not found`);
      return {
        statusCode: 200,
        message: 'Broadcast updated successfully',
        data: updatedBroadcast,
      };
      // return updatedBroadcast;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new InternalServerErrorException();
    }
  }

  async deleteBroadcast(id: string): Promise<IBroadcast | any> {
    try {
      await this.broadcastRepository.delete({
        _id: id,
      });

      return {
        statusCode: 200,
        message: 'Broadcast deleted successfully',
        data: {},
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new InternalServerErrorException();
    }
  }

  async getAllBroadcasts(): Promise<IBroadcast[] | any> {
    try {
      const data = await this.broadcastRepository.all({});
      return {
        statusCode: 200,
        message: 'All broadcasts retrieved successfully',
        data: data,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error?.message, 400);
      }

      throw new InternalServerErrorException();
    }
  }

  // Schedule the broadcast if scheduledAt is specified
  async scheduleBroadcast(broadcast: IBroadcast): Promise<void> {
    if (broadcast.scheduledAt) {
      const delay = broadcast.scheduledAt.getTime() - Date.now();
      setTimeout(async () => {
        await this.broadcastRepository.findAndUpdate(broadcast._id.toString(), {
          status: 'sent',
        });
      }, delay);
    }
  }
}
