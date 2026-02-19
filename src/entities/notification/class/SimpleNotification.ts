import INotification from '../interface/INotification';

class SimpleNotification implements INotification {
  constructor(private readonly content: string) {}

  getContent(): string {
    return this.content;
  }
}

export default SimpleNotification;
