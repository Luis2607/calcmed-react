import { AdminHeader } from './components/AdminHeader';
import { ScoresListView } from './components/ScoresListView';
import { ToastHost } from './components/ToastHost';
import styles from './AdminApp.module.css';

/**
 * Shell do Admin de Escores (desktop): header horizontal no topo + conteúdo full-width
 * rolável (sem sidebar — ganha largura; sidebar fica pro futuro se precisar).
 * Fase 1 tem uma única view (Escores).
 */
export function AdminApp() {
  return (
    <div className={styles.shell}>
      <AdminHeader />
      <main className={styles.main}>
        <div className={styles.content}>
          <ScoresListView />
        </div>
      </main>
      <ToastHost />
    </div>
  );
}
