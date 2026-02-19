import INotification from '../interface/INotification';
import ITimestampDec from '../interface/ITimestampDecurator';

class TimestampDec implements ITimestampDec {
  private readonly timestamp;

  constructor(private readonly notification: INotification) {
    this.timestamp = new Date();
  }

  getContent(): string {
    return this.notification.getContent();
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

export default TimestampDec;
