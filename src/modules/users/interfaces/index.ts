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
  fullname: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  status?: string;
  statusReason?: string;
  roles: IUserRole[];
  subscriptions: ISubscription[];
  activityLogs: IActivityLog[];
  aboutMe: Map<string, string>;
  isDeleted: boolean;
  deletedAt: Date;
  readonly createdAt?: Schema.Types.Date;
  readonly updatedAt?: Schema.Types.Date;
}

export interface IUserRole {
  roleId: Schema.Types.ObjectId;
  customPermissions: string[];
}
