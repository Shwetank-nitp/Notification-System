import { CredentialName } from '../../types/CredentialName';
import ICredentialRepo from './ICredentialRepo';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';

export interface ICredentialRepoFactory {
  getRepository(type: CredentialName): ICredentialRepo<ICredentialDocument>;
}
