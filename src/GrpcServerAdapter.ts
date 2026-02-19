import { Server, ServerCredentials } from '@grpc/grpc-js';
import { UserGrpcServiceService } from './generated/user';
import { NotifyGrpcServiceService } from './generated/notification';
import IServerAdapter from './interface/IServerAdapter';
import { notificationGrpcService, userGrpcService } from '.';

export default class GrpcServerAdapter implements IServerAdapter {
  private static instance: GrpcServerAdapter = new GrpcServerAdapter();
  private static grpcServer: Server = new Server();

  private constructor() {}

  static get grpc() {
    return this.instance;
  }

  async startServer(port_number: number, host: string) {
    const uri = `${host}:${port_number}`;

    GrpcServerAdapter.grpcServer.addService(UserGrpcServiceService, userGrpcService);
    GrpcServerAdapter.grpcServer.addService(
      NotifyGrpcServiceService,
      notificationGrpcService
    );

    GrpcServerAdapter.grpcServer.bindAsync(
      uri,
      ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.log('[GRPC SERVER] failed to load the grpc server:', err);
        }

        console.log(`your server is running at port number: ${port} and uri ${uri}`);
      }
    );
  }
}
