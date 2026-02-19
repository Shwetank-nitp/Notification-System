import NotifyEngine from '../../../modules/notification-engine/action/class/NotifyEngine';
import IAction from '../../../modules/notification-engine/action/interface/IAction';
import MailStrategy from '../../../modules/notification-engine/strategy/class/MailStrategy';
import { ChannelName } from '../../../types/ChannelName';
import { CredentialName } from '../../../types/CredentialName';
import INotification from '../../notification/interface/INotification';
import IChannel from '../../user/interface/IChannel';
import ICredential from '../../user/interface/ICredential';
import IUser from '../../user/interface/IUser';
import IObserver from '../interface/IObserver';

class Observer implements IObserver {
  private static readonly notifyStrategies: Map<ChannelName, IAction> = new Map();
  constructor(readonly user: IUser) {}

  static register(channelName: ChannelName, action: IAction) {
    this.notifyStrategies.set(channelName, action);
  }

  async do(notification: INotification, channels: IChannel[]) {
    for (const channel of channels) {
      const channelName = channel.getChannelName();
      const strategy = Observer.notifyStrategies.get(channelName);

      if (!strategy) {
        throw new Error(
          `[No Strategy Implementation Found] there is not such strategy implementation for channel name ${channelName}`
        );
      }

      await strategy?.update(notification, channel);
    }
  }

  getCredential(credName: CredentialName): ICredential {
    return this.user.getCredential(credName);
  }
}

Observer.register('Email', new NotifyEngine(new MailStrategy()));

export default Observer;
