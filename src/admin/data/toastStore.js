import { useSyncExternalStore } from 'react';

/**
 * Store de toasts do admin. show() empilha um toast e agenda o auto-dismiss.
 * Toast com `undo` mostra o botão "Desfazer" (ex.: restaurar escore excluído).
 */
const listeners = new Set();
let toasts = [];
let seq = 0;

function emit() {
  listeners.forEach((l) => l());
}

export const toastStore = {
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return toasts;
  },
  show({ message, type = 'success', undo, duration = 5000 }) {
    const id = ++seq;
    toasts = [...toasts, { id, message, type, undo }];
    emit();
    if (duration) setTimeout(() => toastStore.dismiss(id), duration);
    return id;
  },
  dismiss(id) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};

export const useToasts = () =>
  useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
