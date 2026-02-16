import { ChannelName } from '../../../types/ChannelName';
import INotification from '../../notification/interface/INotification';

interface IObserver {
  do(notification: INotification, channelName: ChannelName[]): Promise<void>;
}

export default IObserver;
