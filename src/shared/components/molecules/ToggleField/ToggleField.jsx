import { Toggle } from '../../atoms/Toggle';
import styles from './ToggleField.module.css';

/**
 * Molecule: ToggleField (DS · Figma 1630:585).
 * Linha: label à esquerda + Toggle à direita (ex.: "Sou estrangeiro").
 */
export const ToggleField = ({ label, checked = false, onChange, disabled = false }) => (
  <div className={[styles.field, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
    <span className={styles.label}>{label}</span>
    <Toggle checked={checked} onChange={onChange} disabled={disabled} />
  </div>
);
