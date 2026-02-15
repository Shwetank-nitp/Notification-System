import IAction from '../../../modules/notification-engine/action/interface/IAction';
import IUser from '../interface/IUser';

class User implements IUser {
  constructor(
    private readonly userId: string,
    private readonly clientId: string,
    private readonly subs: IAction[]
  ) {}

  getClientId(): string {
    return this.clientId;
  }
  getId(): string {
    return this.userId;
  }
  getSub(): IAction[] {
    return this.subs;
  }
}

export default User;
