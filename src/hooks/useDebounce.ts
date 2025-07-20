import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => setDebouncedValue(value), delay);
    handler();
    //return () => handler.cancel();
  }, [value, delay]);

  return debouncedValue;
};