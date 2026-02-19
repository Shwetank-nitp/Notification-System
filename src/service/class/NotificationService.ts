import NotificationFactory from '../../entities/notification/class/NotificationFactory';
import Observable from '../../modules/observable/class/Observable';
import { ChannelName } from '../../types/ChannelName';
import INotificationService from '../interface/INotificationService';

export default class NotificationService implements INotificationService {
  private readonly observable = new Observable();
  private static instance = new NotificationService();

  private constructor() {}

  static getInstance(): NotificationService {
    return this.instance;
  }

  async sendNotification(
    userId: string,
    clientName: string,
    content: string,
    channelNames: ChannelName[]
  ): Promise<void> {
    const notification = new NotificationFactory().getNotification(
      'Simple',
      content
    );

    await this.observable.notifyUser(userId, clientName, notification, channelNames);
  }
}
