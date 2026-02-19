import mongoose, { ClientSession } from 'mongoose';
import ICredentialFillingStrategy from '../interface/ICredentialFillingStrategy';
import { CredentialName } from '../../../types/CredentialName';
import ICredentialDocument from '../../../modules/model/interface/ICredentialModel';
import EmailCred from '../../../modules/model/EmailCredModel';

export default class EmailFillingStrategy
  implements ICredentialFillingStrategy<ICredentialDocument>
{
  async addCredentials(
    _user: mongoose.Types.ObjectId,
    credential: string,
    isOpt: boolean,
    session?: ClientSession
  ): Promise<ICredentialDocument> {
    const [x] = await EmailCred.create(
      [
        {
          _user,
          credential: credential,
          optIn: isOpt,
        },
      ],
      { session }
    );

    return x;
  }

  async revokePermission(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<ICredentialDocument> {
    const update = await EmailCred.findOneAndUpdate(
      { _user },
      {
        optIn: false,
      },
      {
        returnDocument: 'after',
        session,
      }
    );

    if (!update) {
      throw new Error(
        '[No Such Document Found] cannot update the document because it does not exist'
      );
    }

    return update;
  }

  async deleteDocument(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<void> {
    await EmailCred.deleteOne({ _user }, { session });
  }

  async getCredentials(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<ICredentialDocument | null> {
    return await EmailCred.findOne({ _user }, null, { session });
  }

  async updateCredential(
    _user: mongoose.Types.ObjectId,
    credential: string,
    session?: ClientSession
  ): Promise<ICredentialDocument> {
    const update = await EmailCred.findOneAndUpdate(
      { _user },
      { credential },
      {
        returnDocument: 'after',
        session,
      }
    );

    if (!update) {
      throw new Error(
        '[Not Found] credential cannot be updated because it does not exist'
      );
    }

    return update;
  }

  async enableCredential(
    _user: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<ICredentialDocument> {
    const update = await EmailCred.findOneAndUpdate(
      { _user },
      { optIn: true },
      {
        returnDocument: 'after',
        session,
      }
    );

    if (!update) {
      throw new Error(
        '[Not Found] credential cannot be updated because it does not exist'
      );
    }

    return update;
  }

  getCredentialType(): CredentialName {
    return 'Email';
  }
}
