import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateRecommendationDto,
  PaginateRecoDto,
} from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { RecommendationRepository } from './entities/recommendation.repository';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { FilterQuery } from 'mongoose';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly recommendationsRepository: RecommendationRepository,
    private readonly uploadService: CloudinaryService,
  ) {}
  async create(payload: CreateRecommendationDto, image: Express.Multer.File) {
    try {
      const response = await this.uploadService.uploadImage(
        image,
        'recommendations',
      );

      payload.image = {
        publicId: response.public_id,
        imageValue: response.secure_url,
      };

      const data = await this.recommendationsRepository.create({ ...payload });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Recommendation created successfully',
        data: data,
      };
    } catch (error) {
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

  async findAll(payload: PaginateRecoDto) {
    try {
      payload.conditions = this.buildOrQuery(payload.conditions);

      const data = await this.recommendationsRepository.paginate({
        ...payload,
        // populate: [],
      });

      if (!data || !data.data.length) {
        throw new NotFoundException('No recommendations found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Recommendations found successfully',
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
      const sub = await this.recommendationsRepository.byQuery(
        {
          _id: id,
        },
        null,
        null,
        [],
        '-createdAt',
      );

      if (!sub) {
        throw new NotFoundException('Recommendation not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Recommendation found successfully',
        data: sub,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(
    id: any,
    payload: UpdateRecommendationDto,
    image: Express.Multer.File,
  ) {
    try {
      const isExist = await this.recommendationsRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Recommendation not found');
      }

      if (image) {
        // Deleting old image
        if (isExist?.image && isExist?.image?.publicId) {
          await this.uploadService.deleteImage(isExist?.image?.publicId);
        }

        // Upload new image
        const response = await this.uploadService.uploadImage(
          image,
          'recommendations',
        );

        payload.image = {
          publicId: response.public_id,
          imageValue: response.secure_url,
        };
      }

      const update = await this.recommendationsRepository.findAndUpdate(
        { _id: id },
        {
          payload,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Recommendation updated successfully',
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
      const isExist = await this.recommendationsRepository.byID(id, null, null);

      if (!isExist) {
        throw new NotFoundException('Recommendation not found');
      }

      await Promise.all([
        await this.recommendationsRepository.update(
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
        message: 'Recommendation deleted successfully',
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
