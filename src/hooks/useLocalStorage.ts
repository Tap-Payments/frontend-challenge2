import { useEffect, useState } from 'react';

// TODO: 1- explain this hook and how it works + add a generic type to it
export function useLocalStorage(key: string, initialValue: any | (() => any)) {
  const [value, setValue] = useState<any>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue !== null) return JSON.parse(jsonValue);

    if (typeof initialValue === 'function') {
      return (initialValue as () => any)();
    } else {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
