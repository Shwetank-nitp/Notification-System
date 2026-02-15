interface ICache<T> {
  getObject(
    userId: string,
    clientName: string,
    fallback: () => Promise<T>
  ): Promise<T>;
}

export default ICache;
