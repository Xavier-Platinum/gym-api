import { Document, Schema as MongooseSchema } from 'mongoose';
import { IRecommendation } from '../interfaces';
export declare class Recommendation extends Document implements IRecommendation {
    createdAt?: Date;
    updatedAt?: Date;
    description: string;
    image: {
        publicId: string;
        imageValue: string;
    };
}
export type RecommendationDocument = Recommendation & Document;
export declare const RecommendationSchema: MongooseSchema<Recommendation, import("mongoose").Model<Recommendation, any, any, any, Document<unknown, any, Recommendation> & Recommendation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Recommendation, Document<unknown, {}, import("mongoose").FlatRecord<Recommendation>> & import("mongoose").FlatRecord<Recommendation> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
