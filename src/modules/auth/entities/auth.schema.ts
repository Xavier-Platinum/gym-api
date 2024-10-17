/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IRole } from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class Role extends Document implements IRole {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String] })
  permissions: string[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  assignedTo: MongooseSchema.Types.ObjectId[];

  @Prop({ default: false })
  isCustom: boolean;

  @Prop({ type: Date })
  createdAt: MongooseSchema.Types.Date;

  @Prop({ type: Date })
  updatedAt: MongooseSchema.Types.Date;
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
