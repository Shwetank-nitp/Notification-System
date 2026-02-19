import { CredentialName } from '../../../types/CredentialName';
import ICredential from './ICredential';

export default interface ICredentialFactory {
  getCredential(type: CredentialName, credential: string): ICredential;
}
