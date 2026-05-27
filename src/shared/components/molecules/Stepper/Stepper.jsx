import styles from './Stepper.module.css';

export const Stepper = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  label,
  disabled = false,
  ...props
}) => {
  const handleDecrement = () => {
    if (disabled) return;
    if (onChange && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (onChange && value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''}`} {...props}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.controlsRow}>
        <button
          type="button"
          className={styles.button}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          aria-label="Decrementar"
        >
          <span className={styles.btnSymbol}>－</span>
        </button>
        <span className={`${styles.value} mono`}>{value}</span>
        <button
          type="button"
          className={styles.button}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          aria-label="Incrementar"
        >
          <span className={styles.btnSymbol}>＋</span>
        </button>
      </div>
    </div>
  );
};
