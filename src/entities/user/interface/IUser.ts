import { CredentialName } from '../../../types/CredentialName';
import ICredential from './ICredential';

interface IUser {
  getId(): string;
  getClientName(): string;
  getCredential(credentialName: CredentialName): ICredential;
}

export default IUser;
