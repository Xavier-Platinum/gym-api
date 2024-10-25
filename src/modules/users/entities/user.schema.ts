/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  IActivityLog,
  IRenewal,
  IUser,
  IUserPackage,
  IUserRole,
} from '../interfaces';

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class UserPackage extends Document implements IUserPackage {
  @Prop({ type: Number })
  duration: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Subscription' })
  subscription: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Boolean, default: false })
  isAutoRenew: boolean;

  @Prop({
    type: [
      {
        renewalDate: Date,
        renewalAmount: Number,
        renewalStatus: {
          type: String,
          enum: ['active', 'expired', 'cancelled', 'pending'],
          default: 'pending',
        },
      },
    ],
  })
  renewals: IRenewal[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Addon' })
  addons: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: String,
    enum: [
      'abandoned',
      'failed',
      'ongoing',
      'pending',
      'processing',
      'queued',
      'reversed',
      'success',
    ],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date })
  deletedAt: Date;
}

export type UserPackageDocument = UserPackage & Document;
export const UserPackageSchema = SchemaFactory.createForClass(UserPackage);

@Schema({
  timestamps: true,
  toObject: { getters: true, virtuals: true, versionKey: false },
  toJSON: { getters: true, virtuals: true, versionKey: false },
})
export class User extends Document implements IUser {
  @Prop({ type: String, default: 'nill' })
  deviceToken: string;

  @Prop({ type: String, default: '' })
  state: string;

  @Prop({ type: String, default: '' })
  address: string;

  @Prop({ type: String, default: '' })
  ProfilePicture: string;

  @Prop({ type: Object, default: {} })
  profilePictureMetaData: any;

  @Prop({ type: String, default: '' })
  googleId: string;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ type: String, default: '' })
  secretToken: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: false })
  authToken: string;

  @Prop({
    type: [
      {
        roleId: { type: MongooseSchema.Types.ObjectId, ref: 'Role' },
        customPermissions: { type: [String], default: [] },
      },
    ],
  })
  roles: IUserRole[];

  // @Prop({
  //   type: [
  //     {
  //       subscriptionId: {
  //         type: MongooseSchema.Types.ObjectId,
  //         ref: 'Subscription',
  //       },
  //       startDate: { type: Date, required: true },
  //       endDate: { type: Date, required: true },
  //       isAutoRenew: { type: Boolean, default: false },
  //       renewals: [
  //         {
  //           renewalDate: { type: Date, required: true },
  //           renewalAmount: { type: Number, required: true },
  //           renewalStatus: {
  //             type: String,
  //             enum: ['success', 'failed'],
  //             required: true,
  //           },
  //         },
  //       ],
  //       status: {
  //         type: String,
  //         enum: ['active', 'expired', 'cancelled', 'pending'],
  //         // required: true,
  //         default: 'pending',
  //       },
  //     },
  //   ],
  // })
  // subscriptions: ISubscription[];

  @Prop({
    type: [
      {
        activityType: {
          type: String,
          enum: ['workout', 'class', 'other'],
          required: true,
        },
        duration: { type: Number, required: true },
        caloriesBurned: { type: Number, required: true },
        activityDate: { type: Date, required: true },
      },
    ],
  })
  activityLogs: IActivityLog[];

  @Prop({
    enum: ['active', 'pending', 'suspended', 'banned', 'unsuspended'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Map, of: String, default: {} })
  aboutMe: Map<string, string>;

  @Prop({ type: String, default: '' })
  statusReason: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  createdAt: MongooseSchema.Types.Date;

  @Prop({ type: Date })
  updatedAt: MongooseSchema.Types.Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Add the comparePassword method to the schema's methods
UserSchema.methods.comparePassword = function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Hash password before saving the document
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password before updating the document
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as Partial<UserDocument>;
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});

// Hash password before updating the document
UserSchema.pre('findOneAndReplace', async function (next) {
  const update = this.getUpdate() as Partial<UserDocument>;
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});
