export default interface IServerAdapter {
  startServer(port: number, host: string): Promise<void>;
}
