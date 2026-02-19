import mongoose, { Model } from 'mongoose';
import ICredentialDocument from './interface/ICredentialModel';

const emailCredSchema = new mongoose.Schema<ICredentialDocument>(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true,
    },

    credential: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    optIn: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EmailCred: Model<ICredentialDocument> = mongoose.model(
  'EmailCred',
  emailCredSchema
);

export default EmailCred;
