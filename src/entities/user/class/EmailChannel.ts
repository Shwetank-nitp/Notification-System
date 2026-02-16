import { ChannelName } from '../../../types/ChannelName';
import IChannel from '../interface/IChannel';

export default class EmailChannel implements IChannel {
  constructor(
    readonly emailTo: string,
    readonly emailFrom: string,
    readonly bcc: string
  ) {}

  getChannelName(): ChannelName {
    return 'Email';
  }
}
