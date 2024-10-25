import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Roles } from '../auth/decorators/auth.decorator';
import { ROLES } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recommendations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  // @Roles(ROLES.SuperAdmin)
  create(
    @Body() createRecommendationDto: CreateRecommendationDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.recommendationsService.create(createRecommendationDto, image);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return await this.recommendationsService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  async update(
    @Param('id') id: any,
    @Body() payload: UpdateRecommendationDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.recommendationsService.update(id, payload, image);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(+id);
  }
}
