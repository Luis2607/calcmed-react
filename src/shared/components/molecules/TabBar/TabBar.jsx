import { Icon } from '../../atoms/Icon/Icon';
import styles from './TabBar.module.css';

const EMPTY_ITEMS = [];

export function TabBar({ items = EMPTY_ITEMS, activeId, onChange, safeArea = true, sticky = false }) {
  return (
    <nav
      className={[styles.tabBar, safeArea ? styles.safeArea : '', sticky ? styles.sticky : ''].filter(Boolean).join(' ')}
      style={{ '--tab-count': items.length || 3 }}
      aria-label="Navegacao do protocolo"
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={[styles.item, active ? styles.active : ''].filter(Boolean).join(' ')}
            onClick={() => onChange?.(item.id)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
            {item.badge && <strong className={styles.badge}>{item.badge}</strong>}
          </button>
        );
      })}
    </nav>
  );
}
