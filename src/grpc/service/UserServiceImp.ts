import { sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';
import {
  ChannelCredentialMessage,
  ChannelPermissionMessage,
  UserGrpcServiceServer,
  UserMessage,
} from '../../generated/user';
import UserFactory from '../../entities/user/class/UserFactory';
import { Empty } from '../../generated/google/protobuf/empty';
import CredentialFactory from '../../entities/user/class/CredentialFactory';
import { ChannelName } from '../../types/ChannelName';
import { ChannelName as GrpcChannelEnum } from '../../generated/user';
import IUserService from '../../service/interface/IUserService';

export const GrpcToInternalChannel: Record<number, ChannelName> = {
  [GrpcChannelEnum.Email]: 'Email',
};

export default class UserGrpcServiceImpl implements UserGrpcServiceServer {
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(private readonly userService: IUserService) {}

  private validate(
    fields: Record<string, any>,
    callback: sendUnaryData<any>
  ): boolean {
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === '') {
        callback(
          {
            code: status.INVALID_ARGUMENT,
            message: `Field '${key}' is required and cannot be empty.`,
          },
          null
        );
        return false;
      }
    }
    return true;
  }

  async createNewUser(
    call: ServerUnaryCall<UserMessage, UserMessage>,
    callback: sendUnaryData<UserMessage>
  ): Promise<void> {
    const { userId, clientName } = call.request;
    if (!this.validate({ userId, clientName }, callback)) return;

    try {
      const user = new UserFactory().getUser(userId!, clientName!, []);
      await this.userService.addUser(user);
      callback(null, { userId, clientName });
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  async deleteUser(
    call: ServerUnaryCall<UserMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    const { userId, clientName } = call.request;
    if (!this.validate({ userId, clientName }, callback)) return;

    try {
      await this.userService.delUser(userId!, clientName!);
      callback(null, {});
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  async offChannelPermission(
    call: ServerUnaryCall<ChannelPermissionMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    const { userId, clientName, channelName } = call.request;
    if (!this.validate({ userId, clientName }, callback)) return;

    try {
      await this.userService.offChannel(
        userId!,
        clientName!,
        GrpcToInternalChannel[channelName!] as ChannelName
      );
      callback(null, {});
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  async onChannelPermission(
    call: ServerUnaryCall<ChannelPermissionMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    const { userId, clientName, channelName } = call.request;
    if (!this.validate({ userId, clientName }, callback)) return;

    try {
      await this.userService.onChannel(
        userId!,
        clientName!,
        GrpcToInternalChannel[channelName!] as ChannelName
      );
      callback(null, {});
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  async appendPermission(
    call: ServerUnaryCall<ChannelCredentialMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    const { userId, clientName, channelName, credential: str } = call.request;
    if (!this.validate({ userId, clientName, credential: str }, callback)) return;

    try {
      const credential = new CredentialFactory().getCredential(
        GrpcToInternalChannel[channelName!] as ChannelName,
        str!
      );

      await this.userService.appendSub(userId!, clientName!, credential);
      callback(null, {});
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  async removePermission(
    call: ServerUnaryCall<ChannelPermissionMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    const { userId, clientName, channelName } = call.request;
    if (!this.validate({ userId, clientName }, callback)) return;

    try {
      await this.userService.removeSub(
        userId!,
        clientName!,
        GrpcToInternalChannel[channelName!] as ChannelName
      );
      callback(null, {});
    } catch (err) {
      this.handleError(err, callback);
    }
  }

  private handleError(err: any, callback: sendUnaryData<any>) {
    console.error('Service Error:', err);
    callback(
      {
        code: status.INTERNAL,
        message: err instanceof Error ? err.message : 'Internal service error',
      },
      null
    );
  }
}
