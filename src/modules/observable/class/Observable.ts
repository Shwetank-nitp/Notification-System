import INotification from '../../../entities/notification/interface/INotification';
import Observer from '../../../entities/observer/class/Observer';
import IObserver from '../../../entities/observer/interface/IObserver';
import IObservable from '../interface/IObservable';
import { lruCache } from '../../..';
import UserService from '../../../service/class/UserService';
import { ChannelName } from '../../../types/ChannelName';
import IChannel from '../../../entities/user/interface/IChannel';
import ChannelFactory from '../../../entities/user/class/ChannelFactory';

export default class Observable implements IObservable {
  private get cache() {
    return lruCache;
  }

  // Note: using arrow function to bind the repos and variables of the class to this function
  private fallback = async (
    userId: string,
    clientName: string
  ): Promise<IObserver> => {
    const user = await UserService.getInstance().getUser(userId, clientName);

    if (!user) {
      throw new Error('[USER NOT EXIST] no user found');
    }

    return new Observer(user);
  };

  async notifyUser(
    userId: string,
    clientName: string,
    notification: INotification,
    channelNames: ChannelName[]
  ): Promise<void> {
    const observer = await this.cache.getObject(userId, clientName, this.fallback);

    const channels: IChannel[] = [];
    const factory = new ChannelFactory();

    for (const channelName of channelNames) {
      channels.push(factory.getChannel(observer.getCredential(channelName)));
    }

    observer.do(notification, channels);
  }
}
