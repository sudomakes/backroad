import { useCallback, useEffect, useState } from 'react';

/**
 * localStorage-backed state: `[value, setValue, clearValue]`. Centralizes
 * read/write/JSON/error-handling in one place (no scattered localStorage calls
 * or persistence effects across the app) and keeps tabs in sync via the
 * `storage` event. Mirrors the hook used in vantage.
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Persist whenever the value changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Keep other tabs in sync.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch (error) {
          console.warn(`Error parsing storage event for "${key}":`, error);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) =>
      setStoredValue((prev) =>
        value instanceof Function ? value(prev) : value
      ),
    []
  );

  const clearValue = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}
