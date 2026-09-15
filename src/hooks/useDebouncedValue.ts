import { useEffect, useState } from "react";

export function useDebouncedValue<Value>(value: Value, delayMs = 200): Value {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
}
