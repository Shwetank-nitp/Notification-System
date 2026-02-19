import IObserver from '../../../entities/observer/interface/IObserver';
import ICache from '../interface/ICache';

class ListNode {
  constructor(
    public readonly id: string,
    public prev: ListNode | null = null,
    public next: ListNode | null = null
  ) {}
}

export default class LRUCache<T extends IObserver> implements ICache<T> {
  private readonly map: Map<string, T>;
  private readonly refs: Map<string, ListNode>;
  private readonly inflight: Map<string, Promise<T>>;

  private readonly head: ListNode;
  private readonly tail: ListNode;

  private size: number;

  constructor(private readonly maxSize: number) {
    this.map = new Map();
    this.refs = new Map();
    this.inflight = new Map();

    this.head = new ListNode('__HEAD__');
    this.tail = new ListNode('__TAIL__');

    this.head.next = this.tail;
    this.tail.prev = this.head;

    this.size = 0;
  }

  async getObject(
    userId: string,
    clientName: string,
    fallback: (userId: string, clientName: string) => Promise<T>
  ): Promise<T> {
    const id = this.getKey(userId, clientName);

    // Cache hit
    if (this.map.has(id)) {
      const node = this.refs.get(id)!;

      this.moveToHead(node);
      // console.log(clientName, userId, ' found in cache');
      return this.map.get(id)!;
    }

    // Check if already loading
    if (this.inflight.has(id)) {
      return this.inflight.get(id)!;
    }

    // Start loading
    const promise = fallback(userId, clientName)
      .then((obj) => {
        this.setObject(userId, clientName, obj);

        this.inflight.delete(id);

        return obj;
      })
      .catch((err) => {
        this.inflight.delete(id);

        throw err;
      });

    this.inflight.set(id, promise);

    return promise;
  }

  async setObject(userId: string, clientName: string, value: T): Promise<void> {
    const id = this.getKey(userId, clientName);

    if (this.map.has(id)) {
      this.map.set(id, value);

      const node = this.refs.get(id)!;

      this.moveToHead(node);

      return;
    }

    const node = new ListNode(id);

    this.map.set(id, value);
    this.refs.set(id, node);

    this.addToHead(node);

    this.size++;

    if (this.size > this.maxSize) {
      this.evictLRU();
    }
  }

  async deleteObject(userId: string, clientName: string): Promise<void> {
    const key = this.getKey(userId, clientName);
    const node = this.refs.get(key);
    if (!node) return;

    this.removeNode(node);

    this.map.delete(key);
    this.refs.delete(key);

    this.size--;

    // console.log(node, ' deleted');
  }

  private evictLRU(): void {
    const lru = this.tail.prev!;

    if (lru === this.head) return;

    this.removeNode(lru);

    this.map.delete(lru.id);
    this.refs.delete(lru.id);

    this.size--;
  }

  private moveToHead(node: ListNode): void {
    this.removeNode(node);

    this.addToHead(node);
  }

  private addToHead(node: ListNode): void {
    node.prev = this.head;
    node.next = this.head.next;

    this.head.next!.prev = node;

    this.head.next = node;
  }

  private removeNode(node: ListNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private getKey(userId: string, clientName: string): string {
    return `${userId}:${clientName}`;
  }
}
