import IAction from '../../../modules/notification-engine/action/interface/IAction';

interface IUser {
  getId(): string;
  getClientId(): string;
  getSub(): IAction[];
}

export default IUser;
