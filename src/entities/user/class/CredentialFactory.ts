import { CredentialName } from '../../../types/CredentialName';
import ICredential from '../interface/ICredential';
import ICredentialFactory from '../interface/ICredentialFacotry';
import EmailCredential from './EmailCredential';

export default class CredentialFactory implements ICredentialFactory {
  getCredential(type: CredentialName, credential: string): ICredential {
    if (type === 'Email') {
      return new EmailCredential(credential);
    }
    throw new Error(
      `[Not Implemented]: credential of type ${type} is not implemented`
    );
  }
}
