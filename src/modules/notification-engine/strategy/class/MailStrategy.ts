import INotification from '../../../../entities/notification/interface/INotification';
import EmailChannel from '../../../../entities/user/class/EmailChannel';
import INotifyEngineStrategy from '../interface/INotifyEngineStrategy';

class MailStrategy implements INotifyEngineStrategy {
  //@ts-ignore
  async send(notification: INotification, emial: EmailChannel): Promise<void> {
    console.log(notification.getContent());
    console.log(emial.emailTo);
    console.log('Mail send!!');
  }
}

export default MailStrategy;
