import ICredentialRepo from '../../interface/ICredentialRepo';
import ICredentialDocument from '../../../modules/model/interface/ICredentialModel';

export default interface ICredentialFillingStrategy<T extends ICredentialDocument>
  extends ICredentialRepo<T> {}
