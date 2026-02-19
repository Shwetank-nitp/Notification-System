import { Document } from 'mongoose';
import { CredentialName } from '../../../types/CredentialName';

export interface IUserModel {
  userId: string;
  clientName: string;
  subs: CredentialName[];
}

export interface IUserDocument extends IUserModel, Document {}
