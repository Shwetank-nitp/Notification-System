import mongoose, { ClientSession } from 'mongoose';
import { CredentialName } from '../../types/CredentialName';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';

export default interface ICredentialRepo<T extends ICredentialDocument> {
  addCredentials(
    _user: mongoose.Types.ObjectId,
    credential: string,
    isOpt: boolean,
    session?: ClientSession
  ): Promise<T>;

  revokePermission(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T>;
  deleteDocument(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<void>;

  getCredentials(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T | null>;

  updateCredential(
    _user: mongoose.Types.ObjectId,
    credential: string,
    session?: ClientSession
  ): Promise<T>;

  enableCredential(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T>;

  getCredentialType(): CredentialName;
}
