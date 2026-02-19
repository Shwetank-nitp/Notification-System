import {
  NotifyGrpcServiceServer,
  NotificationMessage,
} from '../../generated/notification';

import { Empty } from '../../generated/google/protobuf/empty';

import { sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js';
import { ChannelName } from '../../types/ChannelName';
import { ChannelName as GrpcChannelEnum } from '../../generated/user';
import INotificationService from '../../service/interface/INotificationService';

export const GrpcToInternalChannel: Record<number, ChannelName> = {
  [GrpcChannelEnum.Email]: 'Email',
};

export class NotificationServiceGrpcImpl implements NotifyGrpcServiceServer {
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(private readonly notificationService: INotificationService) {}

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

  async sendNotification(
    call: ServerUnaryCall<NotificationMessage, Empty>,
    callback: sendUnaryData<Empty>
  ): Promise<void> {
    try {
      const { userId, clientName, channelName, content } = call.request;

      if (!this.validate({ userId, clientName, content, channelName }, callback)) {
        return;
      }

      await this.notificationService.sendNotification(
        userId!,
        clientName!,
        content!,
        [GrpcChannelEnum[channelName!] as ChannelName]
      );

      callback(null, {});
    } catch (error) {
      this.handleError(error, callback);
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
