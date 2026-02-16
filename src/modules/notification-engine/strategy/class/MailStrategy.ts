import INotification from '../../../../entities/notification/interface/INotification';
import EmailChannel from '../../../../entities/user/class/EmailChannel';
import INotifyEngineStrategy from '../interface/INotifyEngineStrategy';

class MailStrategy implements INotifyEngineStrategy {
  async send(notification: INotification, emial: EmailChannel): Promise<void> {}
}

export default MailStrategy;
