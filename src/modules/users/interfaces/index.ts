import { Schema } from 'mongoose';

export interface ISubscription {
  subscriptionId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  renewals: IRenewal[];
  status: 'active' | 'expired' | 'cancelled' | 'pending';
}

export interface IRenewal {
  renewalDate: Date;
  renewalAmount: number;
  renewalStatus: 'success' | 'failed';
}

export interface IActivityLog {
  activityType: 'workout' | 'class' | 'other';
  duration: number;
  caloriesBurned: number;
  activityDate: Date;
}

export interface IUser {
  readonly _id?: Schema.Types.ObjectId | any;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  state: string;
  address: string;
  status?: string;
  statusReason?: string;
  roles: IUserRole[];
  subscriptions: ISubscription[];
  activityLogs: IActivityLog[];
  aboutMe: Map<string, string>;
  isDeleted: boolean;
  ProfilePicture: string;
  profilePictureMetaData: object;
  googleId: string;
  deviceToken: string;
  confirmed: boolean;
  secretToken: string;
  deletedAt: Date;
  readonly createdAt?: Schema.Types.Date;
  readonly updatedAt?: Schema.Types.Date;
}

export interface IUserRole {
  roleId: Schema.Types.ObjectId;
  customPermissions: string[];
}
