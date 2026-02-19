import { CredentialName } from '../../../types/CredentialName';

export default interface ICredential {
  getCredential(): string;
  getCredentialName(): CredentialName;
}
