import { Schema } from 'mongoose';

export interface IRecommendation {
  readonly _id?: Schema.Types.ObjectId | any;
  description: string;
  image: {
    publicId: string;
    imageValue: string;
  };
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
