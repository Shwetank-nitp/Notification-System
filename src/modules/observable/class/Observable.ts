import INotification from '../../../entities/notification/interface/INotification';
import Observer from '../../../entities/observer/class/Observer';
import IObserver from '../../../entities/observer/interface/IObserver';
import EmailChannel from '../../../entities/user/class/EmailChannel';
import User from '../../../entities/user/class/User';
import { ChannelName } from '../../../types/ChannelName';
import LRUCache from '../../cache/class/LRUCache';
import ICache from '../../cache/interface/ICache';
import IObservable from '../interface/IObservable';

class Observable implements IObservable {
  private readonly cache: ICache<IObserver>;

  constructor() {
    this.cache = new LRUCache<IObserver>(5 * 10 ** 6);
  }

  async notifyUser(
    userId: string,
    clientName: string,
    notification: INotification,
    channelNames: ChannelName[]
  ): Promise<void> {
    const observer = await this.cache.getObject(userId, clientName, async () => {
      return new Observer(new User('', '', [new EmailChannel('', '', '')]));
    });

    observer.do(notification, channelNames);
  }
}

export default Observable;
