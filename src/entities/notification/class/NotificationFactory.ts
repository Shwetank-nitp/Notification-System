import { NotificationName } from '../../../types/NotificationName';
import INotification from '../interface/INotification';
import INotificationFactory from '../interface/INotificationFactory';
import SimpleNotification from './SimpleNotification';
import TimestampDec from './TimestampDecorator';

export default class NotificationFactory implements INotificationFactory {
  getNotification(type: NotificationName, content: string): INotification {
    if (type === 'Simple') {
      const simple = new SimpleNotification(content);
      const timeDecorator = new TimestampDec(simple);
      return timeDecorator;
    }

    throw new Error('[Implementation] not implemented');
  }
}
