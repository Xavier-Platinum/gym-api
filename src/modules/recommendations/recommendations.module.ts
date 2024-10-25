import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Recommendation,
  RecommendationSchema,
} from './entities/recommendation.schema';
import { ServicesModule } from 'src/common/services/services.module';
import { RecommendationRepository } from './entities/recommendation.repository';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recommendation.name, schema: RecommendationSchema },
    ]),
    ServicesModule,
  ],
  controllers: [RecommendationsController],
  providers: [
    RecommendationsService,
    RecommendationRepository,
    CloudinaryService,
  ],
  exports: [
    CloudinaryService,
    RecommendationsService,
    RecommendationRepository,
  ],
})
export class RecommendationsModule {}
