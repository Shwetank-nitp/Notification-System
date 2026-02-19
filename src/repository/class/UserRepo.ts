import MongoDBInstance from '../../db/class/MongoDBInstance';
import UserModel from '../../modules/model/UserModel';
import { ChannelName } from '../../types/ChannelName';
import IUserRepo from '../interface/IUserRepo';
import ICredentialRepo from '../interface/ICredentialRepo';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';
import { IUserDocument } from '../../modules/model/interface/IUserModel';
import { CREDENTIAL_NAMES } from '../../types/CredentialName';
import { CredentialRepoFactory } from './CredentialRepoFactory';
import ICredential from '../../entities/user/interface/ICredential';

export default class UserRepo implements IUserRepo {
  private static readonly credMap: Map<
    ChannelName,
    ICredentialRepo<ICredentialDocument>
  > = new Map();
  private static instance: UserRepo;

  private constructor() {}

  static getInstance(): UserRepo {
    if (!UserRepo.instance) {
      UserRepo.instance = new UserRepo();
    }

    return UserRepo.instance;
  }

  static {
    const credentialFactory = new CredentialRepoFactory();
    for (const type of CREDENTIAL_NAMES) {
      this.credMap.set(type, credentialFactory.getRepository(type));
    }
  }

  async addUser(userId: string, clientName: string): Promise<IUserDocument> {
    return await UserModel.create({
      userId,
      clientName,
    });
  }

  async appendSubs(
    userId: string,
    clientName: string,
    credentialObj: ICredential
  ): Promise<IUserDocument | null> {
    const instance = MongoDBInstance.instance;

    if (!instance) {
      throw new Error('[DB Error] Database instance is null or undefined');
    }

    const session = await instance.startSession();

    const sub = credentialObj.getCredentialName();
    const credential = credentialObj.getCredential();

    try {
      session.startTransaction();

      const updatedUser = await UserModel.findOneAndUpdate(
        {
          userId,
          clientName,
        },
        {
          $addToSet: { subs: sub },
        },
        {
          returnDocument: 'after',
          session,
        }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      const repo = UserRepo.credMap.get(sub);
      if (!repo) {
        throw new Error(
          `[Unmapped strategy] cannot find the credentials filling strange of channel name: ${sub}`
        );
      }

      await repo.addCredentials(updatedUser._id, credential, false);

      await session.commitTransaction();

      return updatedUser;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteUserByIdAndClientName(
    userId: string,
    clientName: string
  ): Promise<void> {
    await UserModel.deleteOne({ userId, clientName });
  }

  async getUserByIdAndClientName(
    userId: string,
    clientName: string
  ): Promise<IUserDocument | null> {
    return await UserModel.findOne({ userId, clientName });
  }

  async removeChannel(
    userId: string,
    clientName: string,
    sub: ChannelName
  ): Promise<IUserDocument | null> {
    const instance = MongoDBInstance.instance;

    if (!instance) {
      throw new Error('[DB Error] Database instance is null or undefined');
    }

    const session = await instance.startSession();

    try {
      session.startTransaction();

      const updatedUser = await UserModel.findOneAndUpdate(
        {
          userId,
          clientName,
        },
        {
          $unset: { subs: sub },
        },
        {
          returnDocument: 'after',
          session,
        }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      const repo = UserRepo.credMap.get(sub);
      if (!repo) {
        throw new Error(
          `[Unmapped Strategy] cannot find the credentials filling strange of channel name: ${sub}`
        );
      }

      await repo.deleteDocument(updatedUser._id);

      await session.commitTransaction();

      return updatedUser;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }
}
