import { CredentialName } from '../../../types/CredentialName';
import ICredential from '../interface/ICredential';

export default class EmailCredential implements ICredential {
  constructor(private readonly credential: string) {}

  getCredential(): string {
    return this.credential;
  }

  getCredentialName(): CredentialName {
    return 'Email';
  }
}
