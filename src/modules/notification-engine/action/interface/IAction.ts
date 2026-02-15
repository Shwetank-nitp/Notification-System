interface IAction {
  update(notification: Notification): Promise<void>;
}

export default IAction;
