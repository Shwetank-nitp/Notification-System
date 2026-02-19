import ICredential from '../../entities/user/interface/ICredential';
import IUser from '../../entities/user/interface/IUser';
import { ChannelName } from '../../types/ChannelName';

export default interface IUserService {
  getUser(userId: string, clientName: string): Promise<IUser | null>;
  delUser(userId: string, clientName: string): Promise<void>;
  addUser(user: IUser): Promise<IUser>;

  appendSub(
    userId: string,
    clientName: string,
    credential: ICredential
  ): Promise<IUser>;
  removeSub(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser>;
  offChannel(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser>;
  onChannel(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser>;
}
