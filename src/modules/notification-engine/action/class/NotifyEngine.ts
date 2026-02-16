import INotification from '../../../../entities/notification/interface/INotification';
import IChannel from '../../../../entities/user/interface/IChannel';
import INotifyEngineStrategy from '../../strategy/interface/INotifyEngineStrategy';
import IAction from '../interface/IAction';

class NotifyEngine implements IAction {
  constructor(private readonly strategy: INotifyEngineStrategy) {}

  async update(notification: INotification, channel: IChannel): Promise<void> {
    await this.strategy.send(notification, channel);
  }
}

export default NotifyEngine;
