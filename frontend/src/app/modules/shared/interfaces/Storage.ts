export interface StorageInterface { // later extend (browser) Storage interface
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  // remove(key: string): void;
}
