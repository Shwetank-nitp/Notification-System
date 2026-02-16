import { ChannelName } from '../../../types/ChannelName';
import IChannel from './IChannel';

interface IUser {
  getId(): string;
  getClientId(): string;
  getCredential(channelName: ChannelName): IChannel;
}

export default IUser;
