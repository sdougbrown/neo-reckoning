import type { Accessor } from 'solid-js';

export type MaybeAccessor<T> = T | Accessor<T>;

export function toAccessor<T>(value: MaybeAccessor<T>): Accessor<T> {
  return typeof value === 'function' ? (value as Accessor<T>) : () => value;
}
