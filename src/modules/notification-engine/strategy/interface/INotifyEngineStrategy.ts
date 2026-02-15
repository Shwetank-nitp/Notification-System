interface INotifyEngineStrategy {
  send(notification: Notification): Promise<void>;
}

export default INotifyEngineStrategy;
