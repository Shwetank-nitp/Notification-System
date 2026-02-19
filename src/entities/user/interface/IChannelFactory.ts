import IChannel from './IChannel';
import ICredential from './ICredential';

export default interface IChannelFactory {
  getChannel(credential: ICredential, other?: any): IChannel;
}
