import INotifyEngineStrategy from '../interface/INotifyEngineStrategy';

class MailStrategy implements INotifyEngineStrategy {
  async send(notification: Notification): Promise<void> {}
}

export default MailStrategy;
