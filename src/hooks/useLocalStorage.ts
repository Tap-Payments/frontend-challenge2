import { useEffect, useState } from 'react';

// TODO: explain this hook and how it works + adding a dynamic type for the value
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
