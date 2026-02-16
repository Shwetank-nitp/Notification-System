import INotification from '../../../../entities/notification/interface/INotification';
import IChannel from '../../../../entities/user/interface/IChannel';

interface IAction {
  update(notification: INotification, channel: IChannel): Promise<void>;
}

export default IAction;
