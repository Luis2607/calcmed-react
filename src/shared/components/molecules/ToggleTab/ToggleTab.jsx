import styles from './ToggleTab.module.css';
import { Icon } from '../../atoms/Icon/Icon';

/**
 * Molecule: ToggleTab (DS · Figma 128:3673).
 * Tab pill 58×44/r8 · Active fill #F8FAFC + texto teal · Inactive transparente + secundário.
 * Slots: icon (16px) + label + points ("+N"). Show Icon/Show Points via presença das props.
 */
export const ToggleTab = ({ label, active = false, onClick, icon, points, ...props }) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={[styles.tab, active ? styles.active : ''].filter(Boolean).join(' ')}
    {...props}
  >
    {icon && <Icon name={icon} size={16} />}
    <span className={styles.label}>{label}</span>
    {points != null && <span className={styles.points}>{points}</span>}
  </button>
);
