import INotification from '../../../../entities/notification/interface/INotification';
import IChannel from '../../../../entities/user/interface/IChannel';

interface INotifyEngineStrategy {
  send(notification: INotification, channel: IChannel): Promise<void>;
}

export default INotifyEngineStrategy;
