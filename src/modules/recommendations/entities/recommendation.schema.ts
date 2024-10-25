/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IRecommendation } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Recommendation extends Document implements IRecommendation {
  createdAt?: Date;
  updatedAt?: Date;
  @Prop({
    type: String,
    default: '',
  })
  description: string;

  @Prop({
    type: {
      publicId: {
        type: String,
        default: '',
      },
      imageValue: {
        type: String,
        default: '',
      },
    },
  })
  image: { publicId: string; imageValue: string };
}

export type RecommendationDocument = Recommendation & Document;
export const RecommendationSchema =
  SchemaFactory.createForClass(Recommendation);
