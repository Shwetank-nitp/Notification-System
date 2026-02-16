import { ChannelName } from '../../../types/ChannelName';
import IChannel from '../interface/IChannel';
import IUser from '../interface/IUser';

class User implements IUser {
  private readonly credentials: Map<ChannelName, IChannel>;
  constructor(
    private readonly userId: string,
    private readonly clientId: string,
    private readonly creds: IChannel[]
  ) {
    this.credentials = new Map();

    for (const cred of creds) {
      this.credentials.set(cred.getChannelName(), cred);
    }
  }

  getClientId(): string {
    return this.clientId;
  }
  getId(): string {
    return this.userId;
  }
  getCredential(channelName: ChannelName): IChannel {
    const channel = this.credentials.get(channelName);

    if (!channel) {
      throw new Error(
        `[Unauthorized] User does not have granted access to send notifications via channel: ${channelName}`
      );
    }

    return channel;
  }
}

export default User;
