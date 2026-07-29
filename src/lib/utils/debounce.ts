/**
 * Returns a debounced wrapper around `fn` that fires `wait` ms after the last
 * call. The returned function exposes `.cancel()` so effects can clear a
 * pending invocation on unmount.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number
): ((...args: TArgs) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: TArgs): void => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      fn(...args);
    }, wait);
  };

  debounced.cancel = (): void => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return debounced;
}
