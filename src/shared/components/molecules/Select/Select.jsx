import styles from './Select.module.css';
import { Icon } from '../../atoms/Icon/Icon';

/**
 * Molecule: Select (DS · Figma 127:3241) — TRIGGER.
 * Aparência do select (label + valor + chevron). O dropdown em si é responsabilidade
 * do consumidor (ex.: abre um SelectSheet). Reusa --ds-input-* (dark via .modo-escuro).
 * states: 'default' | 'error'.
 */
export const Select = ({
  label,
  value,
  placeholder = 'Selecione...',
  onClick,
  state = 'default',
  disabled = false,
  showFlag = false,
  flag = null,
  ...props
}) => {
  const triggerClass = [styles.trigger, styles[`state-${state}`], disabled ? styles.disabled : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <button type="button" className={triggerClass} onClick={onClick} disabled={disabled} {...props}>
        {showFlag && flag && <span className={styles.flag} aria-hidden="true">{flag}</span>}
        <span className={value ? styles.value : styles.placeholder}>{value || placeholder}</span>
        <Icon name="dropdown" size={20} className={styles.chevron} />
      </button>
    </div>
  );
};
