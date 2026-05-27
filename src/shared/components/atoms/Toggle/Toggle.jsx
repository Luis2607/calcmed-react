import styles from './Toggle.module.css';

/**
 * Atom: Toggle (DS · Figma 1628:568).
 * Switch on/off. Track 51×31 pill (on #007993 / off #F1F5F9), thumb 27 branco.
 * Reusa tokens --ds-* (dark via .modo-escuro). role="switch" + aria-checked.
 */
export const Toggle = ({ checked = false, onChange, disabled = false, label, ...props }) => {
  const handle = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  return (
    <label className={[styles.container, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handle}
        className={[styles.track, checked ? styles.on : ''].filter(Boolean).join(' ')}
        {...props}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
