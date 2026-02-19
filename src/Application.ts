import MongoDBInstance from './db/class/MongoDBInstance';
import IApplication from './interface/IApplication';
import IServerAdapter from './interface/IServerAdapter';

export class Application implements IApplication {
  private static instance: Application | null = null;

  private constructor(
    private readonly serverAdapter: IServerAdapter,
    private readonly portNumber: number,
    private readonly hostName: string,
    private readonly dbUri: string
  ) {}

  static getInstance(
    adapter: IServerAdapter,
    portNumber: number,
    host: string,
    dbUri: string
  ): Application {
    if (!this.instance) {
      this.instance = new Application(adapter, portNumber, host, dbUri);
    }

    return this.instance;
  }

  private async spinDatabase(dbUri: string) {
    await MongoDBInstance.connect(dbUri);
    console.log('Database connected!');
  }

  private async spinApiService(portNumber: number, host: string) {
    await this.serverAdapter.startServer(portNumber, host);
    console.log('Grpc Server Successfully Started');
  }

  async start() {
    await this.spinDatabase(this.dbUri);
    await this.spinApiService(this.portNumber, this.hostName);
  }
}
