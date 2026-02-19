import { ChannelName } from '../../types/ChannelName';
import { IUserDocument } from '../../modules/model/interface/IUserModel';
import ICredential from '../../entities/user/interface/ICredential';

export default interface IUserRepo {
  addUser(userId: string, clientName: string): Promise<IUserDocument>;

  deleteUserByIdAndClientName(userId: string, clientName: string): Promise<void>;

  getUserByIdAndClientName(
    userId: string,
    clientName: string
  ): Promise<IUserDocument | null>;

  appendSubs(
    userId: string,
    clientName: string,
    credentialObj: ICredential
  ): Promise<IUserDocument | null>;

  removeChannel(
    userId: string,
    clientName: string,
    sub: ChannelName
  ): Promise<IUserDocument | null>;
}
