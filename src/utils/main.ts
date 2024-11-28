export function collect<T, R>(
  arr: T[],
  f: (v: T, i: number, arr: T[]) => R | null | undefined,
): R[] {
  const result: R[] = [];
  arr.forEach((v, i, arr) => {
    const y = f(v, i, arr);
    if (y != null) {
      result.push(y);
    }
  });
  return result;
}
