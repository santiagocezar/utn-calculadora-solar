export const sum = (a: number, b: number, _i: number) => a + b
export const get = <I extends number>(i: I) => <T extends any[]>(xs: T): T[I] => xs[i]
