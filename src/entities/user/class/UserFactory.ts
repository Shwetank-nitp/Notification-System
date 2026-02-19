import ICredential from '../interface/ICredential';
import IUser from '../interface/IUser';
import IUserFactory from '../interface/IUserFactory';
import SimpleUser from './SimpleUser';

export default class UserFactory implements IUserFactory {
  getUser(userId: string, clientName: string, credentials: ICredential[]): IUser {
    return new SimpleUser(userId, clientName, credentials);
  }
}
