import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { AddonRepository } from '../../entities/subscription.repository';
import {
  CreateAddonDto,
  PaginateSubsDto,
} from '../../dto/create-subscription.dto';
import { FilterQuery } from 'mongoose';
import { UpdateAddonDto } from '../../dto/update-subscription.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AddonsService {
  constructor(
    private readonly uploadService: CloudinaryService,
    private readonly addonRepository: AddonRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateAddonDto, image: Express.Multer.File) {
    try {
      const isExists = await this.addonRepository.exists({
        name: payload.name,
      });

      if (isExists) {
        throw new HttpException('Addon already exists', 409);
      }

      if (image) {
        const response = await this.uploadService.uploadImage(image, 'addons');

        payload.image = {
          publicId: response.public_id,
          imageValue: response.secure_url,
        };
      }

      const addon = await this.addonRepository.create({ ...payload });

      this.eventEmitter.emit('BroadcastNotification', {
        title: 'Addons Notification',
        // body: JSON.stringify({
        //   message: 'New addon added check it out.',
        //   data: {
        //     name: addon.name,
        //     _id: addon?._id,
        //     description: addon?.description,
        //     image: addon?.image,
        //   },
        // }),
        body: 'New addon added check it out.',
        tag: 'Addon',
        resourceId: addon?._id,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Addon created successfully',
        data: {},
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error?.getStatus());
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

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.addonRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Addons found successfully',
      data,
    };
  }

  async findAll(payload: PaginateSubsDto) {
    try {
      payload.conditions = this.buildOrQuery(payload.conditions);

      const data = await this.addonRepository.paginate({
        ...payload,
        // populate: [],
      });

      if (!data || !data.data.length) {
        throw new NotFoundException('No addon found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Addons found successfully',
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
      const sub = await this.addonRepository.byQuery(
        {
          _id: id,
        },
        null,
        null,
        [],
        '-createdAt',
      );

      if (!sub) {
        throw new NotFoundException('Addon not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Addon found successfully',
        data: sub,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: any, payload: UpdateAddonDto, image: Express.Multer.File) {
    try {
      const isExist = await this.addonRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Addon not found');
      }

      if (image) {
        // Deleting old image
        if (isExist?.image && isExist?.image?.publicId) {
          await this.uploadService.deleteImage(isExist?.image?.publicId);
        }

        // Upload new image
        const response = await this.uploadService.uploadImage(image, 'addons');

        payload.image = {
          publicId: response.public_id,
          imageValue: response.secure_url,
        };
      }

      const update = await this.addonRepository.findAndUpdate(
        { _id: id },
        {
          $set: { ...payload },
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Addon updated successfully',
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
      const isExist = await this.addonRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Addon not found');
      }

      await Promise.all([
        await this.addonRepository.update(
          { _id: id },
          {
            isArchived: true,
          },
        ),
        isExist?.image?.publicId &&
          (await this.uploadService.deleteImage(isExist?.image?.publicId)),
      ]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Addon deleted successfully',
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
