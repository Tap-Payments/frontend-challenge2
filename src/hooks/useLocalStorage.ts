import { useEffect, useState } from 'react';

// TODO: explain this hook and how it works + adding a dynamic type for the value
export function useLocalStorage<Value>(
  key: string,
  initialValue: Value | (() => Value)
) {
  const [value, setValue] = useState<Value>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue !== null) return JSON.parse(jsonValue);

    if (typeof initialValue === 'function') {
      return (initialValue as () => Value)();
    } else {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [
    Value,
    React.Dispatch<React.SetStateAction<Value>>
  ];
}
