import INotification from '../../../../entities/notification/interface/INotification';
import INotifyEngineStrategy from '../interface/INotifyEngineStrategy';

class WhatsappStrategy implements INotifyEngineStrategy {
  async send(notification: INotification): Promise<void> {}
}

export default WhatsappStrategy;
