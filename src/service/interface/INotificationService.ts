import { ChannelName } from '../../types/ChannelName';

export default interface INotificationService {
  sendNotification(
    userId: string,
    clientName: string,
    content: string,
    channelNames: ChannelName[]
  ): Promise<void>;
}
