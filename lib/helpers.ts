type DebounceFunction = (...args: any[]) => void;

export function debounce<T extends DebounceFunction>(
  callback: T,
  delay: number,
): T {
  let timerId: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;
}
