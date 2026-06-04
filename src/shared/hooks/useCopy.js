import { useCallback, useRef, useState } from 'react';

/**
 * useCopy — copia texto para a área de transferência e expõe um estado
 * `copied` que volta a false após `timeout` ms. Degrada com try/catch
 * (clipboard pode falhar em contexto não-seguro).
 */
export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(String(text ?? ''));
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      setCopied(false);
    }
  }, [timeout]);

  return { copied, copy };
}
