import { myEmail } from '../../..';
import IChannel from '../interface/IChannel';
import IChannelFactory from '../interface/IChannelFactory';
import ICredential from '../interface/ICredential';
import EmailChannel from './EmailChannel';

export default class ChannelFactory implements IChannelFactory {
  getChannel(cred: ICredential, other?: any): IChannel {
    if (cred.getCredentialName() === 'Email') {
      return new EmailChannel(cred.getCredential(), myEmail, other);
    } else {
      throw new Error(
        '[Implementation Error] No such implemented of channel:' +
          cred.getCredentialName()
      );
    }
  }
}
