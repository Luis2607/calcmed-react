import { useState, useEffect } from 'react';

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const persisted = localStorage.getItem(key);
      return persisted !== null ? JSON.parse(persisted) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
