import IUser from '../../user/interface/IUser';
import IObserver from '../interface/IObserver';

class Observer implements IObserver {
  constructor(readonly user: IUser) {}
  async do(notification: Notification) {
    for (const act of this.user.getSub()) {
      await act.update(notification);
    }
  }
}

export default Observer;
