import { CredentialName } from '../../types/CredentialName';
import ICredentialRepo from '../interface/ICredentialRepo';
import { ICredentialRepoFactory } from '../interface/ICredentialRepoFactory';
import CredentialRepo from './CredentialRepo';
import EmailFillingStrategy from '../strategy/class/EmailFillingStrategy';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';

const strategyMap: Map<
  CredentialName,
  ICredentialRepo<ICredentialDocument>
> = new Map();

strategyMap.set('Email', new EmailFillingStrategy());

export class CredentialRepoFactory implements ICredentialRepoFactory {
  getRepository(type: CredentialName): ICredentialRepo<ICredentialDocument> {
    const strategy = strategyMap.get(type);

    if (!strategy) {
      throw new Error(`No strategy found for credential type: ${type}`);
    }

    return new CredentialRepo(strategy);
  }
}
