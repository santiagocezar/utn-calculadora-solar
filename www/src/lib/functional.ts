export const sum = (a: number, b: number, _i: number) => a + b
export const get = <I extends number>(i: I) => <T extends any[]>(xs: T): T[I] => xs[i]

export function objectMap<T extends object, R>(
    obj: T, fn: (v: T[keyof T], k: keyof T) => R
): { [key in keyof T]: R } {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v]) => [k, fn(v, k as keyof T)]
    )
  ) as any
}
