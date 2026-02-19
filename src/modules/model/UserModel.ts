import mongoose, { Model } from 'mongoose';
import { IUserDocument } from './interface/IUserModel';

const userSchema = new mongoose.Schema<IUserDocument>({
  userId: {
    type: String,
    required: true,
  },

  clientName: {
    type: String,
    required: true,
  },

  subs: {
    type: [String],
    default: [],
  },
});

userSchema.index({ userId: 1, clientName: 1 }, { unique: true }); // FIX: userId and clientName indexed and unique composite fields

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>(
  'User',
  userSchema
);

export default UserModel;
