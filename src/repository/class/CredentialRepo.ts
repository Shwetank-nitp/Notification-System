import mongoose, { ClientSession } from 'mongoose';
import ICredentialRepo from '../interface/ICredentialRepo';
import ICredentialFillingStrategy from '../strategy/interface/ICredentialFillingStrategy';
import { CredentialName } from '../../types/CredentialName';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';

export default class CredentialRepo<T extends ICredentialDocument>
  implements ICredentialRepo<T>
{
  constructor(private readonly strategy: ICredentialFillingStrategy<T>) {}

  async addCredentials(
    _user: mongoose.Types.ObjectId,
    credential: string,
    isOpt: boolean,
    session?: ClientSession
  ): Promise<T> {
    return await this.strategy.addCredentials(_user, credential, isOpt, session);
  }

  async revokePermission(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T> {
    return await this.strategy.revokePermission(_user, session);
  }

  async deleteDocument(_user: mongoose.Types.ObjectId): Promise<void> {
    return await this.strategy.deleteDocument(_user);
  }

  async getCredentials(_user: mongoose.Types.ObjectId): Promise<T | null> {
    return await this.strategy.getCredentials(_user);
  }

  async updateCredential(
    _user: mongoose.Types.ObjectId,
    credential: string,
    session?: ClientSession
  ): Promise<T> {
    return await this.strategy.updateCredential(_user, credential, session);
  }

  async enableCredential(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T> {
    return await this.strategy.enableCredential(_user, session);
  }

  getCredentialType(): CredentialName {
    return this.strategy.getCredentialType();
  }
}
