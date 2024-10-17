import { Schema } from 'mongoose';

export interface IRole {
  readonly _id?: Schema.Types.ObjectId | any;
  name: string;
  permissions: string[];
  isCustom: boolean;
  assignedTo: Schema.Types.ObjectId[];
  readonly createdAt?: Schema.Types.Date;
  readonly updatedAt?: Schema.Types.Date;
}

export enum ROLES {
  SuperAdmin = 'SuperAdmin',
  StoreManager = 'storemanager',
  Operator = 'operator',
  User = 'User',
}
