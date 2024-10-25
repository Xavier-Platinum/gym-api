import { Injectable } from '@nestjs/common';
import { EntityRepository, Model as IModel } from 'src/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Recommendation,
  RecommendationDocument,
} from './recommendation.schema';

@Injectable()
export class RecommendationRepository extends EntityRepository<
  IModel<RecommendationDocument>
> {
  constructor(
    @InjectModel(Recommendation.name)
    model: Model<IModel<RecommendationDocument>>,
  ) {
    super(model);
  }
}
