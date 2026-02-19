import IUser from '../../entities/user/interface/IUser';
import ICredentialRepo from '../../repository/interface/ICredentialRepo';
import { CREDENTIAL_NAMES, CredentialName } from '../../types/CredentialName';
import IUserService from '../interface/IUserService';
import { CredentialRepoFactory } from '../../repository/class/CredentialRepoFactory';
import ICredential from '../../entities/user/interface/ICredential';
import CredentialFactory from '../../entities/user/class/CredentialFactory';
import ICredentialDocument from '../../modules/model/interface/ICredentialModel';
import UserFactory from '../../entities/user/class/UserFactory';
import { ChannelName } from '../../types/ChannelName';
import { lruCache } from '../..';
import IUserRepo from '../../repository/interface/IUserRepo';

export default class UserService implements IUserService {
  private static instance: UserService;
  private static readonly credentialRepositories: Map<
    CredentialName,
    ICredentialRepo<ICredentialDocument>
  > = new Map();

  private constructor(private readonly userRepo: IUserRepo) {}

  static {
    const credentialFactory = new CredentialRepoFactory();
    for (const type of CREDENTIAL_NAMES) {
      this.credentialRepositories.set(type, credentialFactory.getRepository(type));
    }
  }

  static getCredentialRepo(
    type: CredentialName
  ): ICredentialRepo<ICredentialDocument> {
    const repo = this.credentialRepositories.get(type);

    if (!repo) {
      throw new Error(
        `[Not Implemented] Credential repository not found for type: ${type}`
      );
    }

    return repo;
  }

  static init(userRepo: IUserRepo): UserService {
    if (!this.instance) {
      this.instance = new UserService(userRepo);
    }
    return this.instance;
  }

  static getInstance(): UserService {
    if (!this.instance) {
      throw new Error('[UserService] must be initialized with a repository first.');
    }
    return this.instance;
  }

  private get cache() {
    return lruCache;
  }

  async getUser(userId: string, clientId: string): Promise<IUser | null> {
    const userDoc = await this.userRepo.getUserByIdAndClientName(userId, clientId);

    if (!userDoc) {
      return null;
    }

    const subs = userDoc?.subs;
    const credentials: ICredential[] = [];

    if (subs) {
      const factory = new CredentialFactory();
      for (const sub of subs) {
        const doc = await UserService.getCredentialRepo(sub).getCredentials(
          userDoc._id
        );

        if (!doc) {
          throw new Error(
            `[Exception] user has subbed the channel name ${sub} but the credentials are missing`
          );
        }

        if (!doc.optIn) continue;

        credentials.push(factory.getCredential(sub, doc.credential));
      }
    }

    const user = new UserFactory().getUser(userId, clientId, credentials);

    return user;
  }

  async addUser(user: IUser): Promise<IUser> {
    await this.userRepo.addUser(user.getId(), user.getClientName());

    return user;
  }

  async delUser(userId: string, clientName: string): Promise<void> {
    await this.cache.deleteObject(userId, clientName);
    await this.userRepo.deleteUserByIdAndClientName(userId, clientName);
  }

  async appendSub(
    userId: string,
    clientName: string,
    credential: ICredential
  ): Promise<IUser> {
    await this.userRepo.appendSubs(userId, clientName, credential);

    const user = await this.getUser(userId, clientName);
    if (!user) {
      throw new Error('[DB Error] you should exist but is not?');
    }

    await this.cache.deleteObject(userId, clientName);
    return user;
  }

  async removeSub(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser> {
    await this.userRepo.removeChannel(userId, clientName, channelName);
    const user = await this.getUser(userId, clientName);
    if (!user) {
      throw new Error('[DB Error] you should exist but is not?');
    }

    await this.cache.deleteObject(userId, clientName);
    return user;
  }

  async offChannel(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser> {
    const repo = UserService.credentialRepositories.get(channelName)!;
    const userDoc = await this.userRepo.getUserByIdAndClientName(userId, clientName);

    if (!userDoc) {
      throw new Error(
        `[NO USER FOUND] there is not such user with userid ${userId} and clientName ${clientName}`
      );
    }

    await repo.revokePermission(userDoc._id);

    const user = await this.getUser(userId, clientName);
    if (!user) {
      throw new Error('[DB Error] you should exist but is not?');
    }

    await this.cache.deleteObject(userId, clientName);
    return user;
  }

  async onChannel(
    userId: string,
    clientName: string,
    channelName: ChannelName
  ): Promise<IUser> {
    const repo = UserService.credentialRepositories.get(channelName)!;
    const userDoc = await this.userRepo.getUserByIdAndClientName(userId, clientName);

    if (!userDoc) {
      throw new Error(
        `[NO USER FOUND] there is not such user with userid ${userId} and clientName ${clientName}`
      );
    }

    await repo.enableCredential(userDoc._id);

    const user = await this.getUser(userId, clientName);
    if (!user) {
      throw new Error('[DB Error] you should exist but is not?');
    }

    await this.cache.deleteObject(userId, clientName);
    return user;
  }
}
