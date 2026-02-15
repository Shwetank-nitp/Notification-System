interface IObserver {
  do(notification: Notification): Promise<void>;
}

export default IObserver;
