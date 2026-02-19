import INotification from '../../../entities/notification/interface/INotification';
import { ChannelName } from '../../../types/ChannelName';

export default interface IObservable {
  notifyUser(
    userId: string,
    clientName: string,
    notification: INotification,
    channelNames: ChannelName[]
  ): Promise<void>;
}
