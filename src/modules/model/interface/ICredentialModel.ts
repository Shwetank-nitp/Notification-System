import mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface ICredentialModel {
  _user: mongoose.Types.ObjectId;
  credential: string;
  optIn: boolean;
}

export default interface ICredentialDocument extends Document, ICredentialModel {}
