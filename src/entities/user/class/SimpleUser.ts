import { CredentialName } from '../../../types/CredentialName';
import ICredential from '../interface/ICredential';
import IUser from '../interface/IUser';

class SimpleUser implements IUser {
  private readonly credentials: Map<CredentialName, ICredential>;
  constructor(
    private readonly userId: string,
    private readonly ClientName: string,
    //@ts-ignore
    private readonly creds: ICredential[]
  ) {
    this.credentials = new Map();

    for (const cred of creds) {
      this.credentials.set(cred.getCredentialName(), cred);
    }
  }

  getClientName(): string {
    return this.ClientName;
  }
  getId(): string {
    return this.userId;
  }
  getCredential(credentialName: CredentialName): ICredential {
    const credential = this.credentials.get(credentialName);

    if (!credential) {
      throw new Error(
        `[Unauthorized] User does not have granted access to send notifications via channel: ${credentialName}`
      );
    }

    return credential;
  }
}

export default SimpleUser;
