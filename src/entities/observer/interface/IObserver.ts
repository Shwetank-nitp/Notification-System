import { CredentialName } from '../../../types/CredentialName';
import INotification from '../../notification/interface/INotification';
import IChannel from '../../user/interface/IChannel';
import ICredential from '../../user/interface/ICredential';

interface IObserver {
  getCredential(credName: CredentialName): ICredential;
  do(notification: INotification, channel: IChannel[]): Promise<void>;
}

export default IObserver;
