import { Schema } from 'mongoose';

export interface IBroadcast {
  readonly _id?: Schema.Types.ObjectId | any;
  adminId: Schema.Types.ObjectId;
  title: string;
  message: string;
  targetAudience: 'all' | 'premium' | 'specific_users';
  userIds?: Schema.Types.ObjectId[];
  type: 'system' | 'promotion' | 'announcement';
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  deliveryStatus: 'pending' | 'delivered' | 'failed';
  readStatus: { userId: Schema.Types.ObjectId; read: boolean; readAt?: Date }[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
