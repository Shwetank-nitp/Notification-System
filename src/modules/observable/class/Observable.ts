import Observer from '../../../entities/observer/class/Observer';
import User from '../../../entities/user/class/User';
import LRUCache from '../../cache/class/LRUCache';
import ICache from '../../cache/interface/ICache';

class Observable implements IObservable {
  private readonly cache: ICache<Observer>;

  constructor() {
    this.cache = new LRUCache<Observer>(5 * 10 ** 6);
  }

  async notifyUser(
    userId: string,
    clientName: string,
    notification: Notification
  ): Promise<void> {
    const observer = await this.cache.getObject(userId, clientName, async () => {
      return new Observer(new User('', '', []));
    });

    observer.do(notification);
  }
}

export default Observable;
