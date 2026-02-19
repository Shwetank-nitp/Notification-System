import ICredential from './ICredential';
import IUser from './IUser';

export default interface IUserFactory {
  getUser(userId: string, clientName: string, credentials: ICredential[]): IUser;
}
