import IObserver from '../../../entities/observer/interface/IObserver';

interface ICache<T extends IObserver> {
  getObject(
    userId: string,
    clientName: string,
    fallback: (userId: string, clientName: string) => Promise<T>
  ): Promise<T>;

  setObject(userId: string, clientName: string, value: T): Promise<void>;

  deleteObject(userId: string, clientName: string): Promise<void>;
}

export default ICache;
