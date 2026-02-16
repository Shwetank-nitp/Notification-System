import NotifyEngine from '../../../modules/notification-engine/action/class/NotifyEngine';
import IAction from '../../../modules/notification-engine/action/interface/IAction';
import MailStrategy from '../../../modules/notification-engine/strategy/class/MailStrategy';
import WhatsappStrategy from '../../../modules/notification-engine/strategy/class/WhatsappStrategy';
import { ChannelName } from '../../../types/ChannelName';
import INotification from '../../notification/interface/INotification';
import IUser from '../../user/interface/IUser';
import IObserver from '../interface/IObserver';

class Observer implements IObserver {
  private readonly notifyStrategies: Map<ChannelName, IAction>;
  constructor(readonly user: IUser) {
    this.notifyStrategies = new Map();
    this.notifyStrategies.set('Email', new NotifyEngine(new MailStrategy()));
    this.notifyStrategies.set('Whatsapp', new NotifyEngine(new WhatsappStrategy()));
  }
  async do(notification: INotification, channelNames: ChannelName[]) {
    for (const channel of channelNames) {
      const cred = this.user.getCredential(channel);
      const strategy = this.notifyStrategies.get(channel);

      if (!strategy) {
        throw new Error(
          `[No Strategy Implementation Found] there is not such strategy implementation for channel name ${channel}`
        );
      }

      await strategy?.update(notification, cred);
    }
  }
}

export default Observer;
