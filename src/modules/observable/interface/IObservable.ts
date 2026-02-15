interface IObservable {
  notifyUser(
    userId: string,
    clientName: string,
    notification: Notification
  ): Promise<void>;
}
