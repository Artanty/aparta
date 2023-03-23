export type Entries<T> = {
  [K in keyof T]: T[K]
}
