import INotifyEngineStrategy from '../../strategy/interface/INotifyEngineStrategy';
import IAction from '../interface/IAction';

class NotifyEngine implements IAction {
  constructor(private readonly strategy: INotifyEngineStrategy) {}

  async update(notification: Notification): Promise<void> {
    this.strategy.send(notification);
  }
}

export default NotifyEngine;
