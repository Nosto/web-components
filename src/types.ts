export type Props<T extends HTMLElement> = {
  [K in keyof T as T[K] extends Function ? never : K extends keyof HTMLElement ? never : K]: T[K]
}
