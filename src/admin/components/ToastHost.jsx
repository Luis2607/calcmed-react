import { Toast } from '../../shared/components/molecules/Toast/Toast';
import { toastStore, useToasts } from '../data/toastStore';
import styles from './ToastHost.module.css';

/** Região fixa que renderiza os toasts (empilhados, embaixo-centro). Reusa o Toast do DS. */
export function ToastHost() {
  const toasts = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className={styles.host} role="region" aria-label="Notificações">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          type={t.type}
          message={t.message}
          onUndo={t.undo ? () => { t.undo(); toastStore.dismiss(t.id); } : undefined}
          onDismiss={() => toastStore.dismiss(t.id)}
        />
      ))}
    </div>
  );
}
