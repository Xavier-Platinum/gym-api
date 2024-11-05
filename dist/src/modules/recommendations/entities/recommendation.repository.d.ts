import { EntityRepository, Model as IModel } from 'src/common';
import { Model } from 'mongoose';
import { RecommendationDocument } from './recommendation.schema';
export declare class RecommendationRepository extends EntityRepository<IModel<RecommendationDocument>> {
    constructor(model: Model<IModel<RecommendationDocument>>);
}
