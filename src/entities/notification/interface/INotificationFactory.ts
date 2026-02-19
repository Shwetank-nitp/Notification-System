import { NotificationName } from '../../../types/NotificationName';
import INotification from './INotification';

export default interface INotificationFactory {
  getNotification(type: NotificationName, content: string): INotification;
}
