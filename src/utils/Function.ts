import { EventEmitter } from "events";

// TODO: Seperate various utility functions into their own files

export class PubSubStack<T> {
  private items: T[];
  private events: EventEmitter;

  constructor() {
    this.items = [];
    this.events = new EventEmitter();
  }

  push(item: T): void {
    this.items.push(item);
    this.events.emit("push", item);
  }

  pop(): void {
    const item = this.items.pop();
    if (item) this.events.emit("pop", item);
  }

  clear(): void {
    this.items = [];
    this.events.emit("clear");
  }

  subscribe(event: string, listener: (item: T) => void): void {
    this.events.on(event, listener);
  }

  toArray(): T[] {
    return [...this.items];
  }
}

type AsyncAction = () => Promise<void>;

export class AsyncQueue {
  private current: Promise<void> = Promise.resolve();

  enqueue(action: AsyncAction): void {
    this.current = this.current.then(() => action());
  }

  async flush(): Promise<void> {
    await this.current;
  }
}

export function getHexColorString(hex: number): string {
  return `#${hex.toString(16).padStart(6, "0")}`;
}

export function dateToSeed(date: Date): number {
  const [year, month, day] = date
    .toISOString()
    .split("T")[0]
    .split("-")
    .map(Number);
  return year * 10000 + month * 100 + day;
}

// TODO: cleanup
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${minutes}:${seconds}`; // no padStart on hours
  }

  return `${minutes}:${seconds}`;
}

export function getCurrentUTCDateString() {
  const isoString = new Date().toISOString(); // always UTC
  return isoString.slice(0, 10); // 'YYYY-MM-DD'
}

export function getTimeUntilNextUTCDate(): number {
  const now = new Date();
  const nextUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return nextUTC.getTime() - now.getTime();
}
