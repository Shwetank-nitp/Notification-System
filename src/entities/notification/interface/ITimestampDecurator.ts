import INotification from './INotification';

interface ITimestampDec extends INotification {
  getTimestamp(): Date;
}

export default ITimestampDec;
