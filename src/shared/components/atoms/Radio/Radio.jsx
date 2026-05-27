import styles from './Radio.module.css';

export const Radio = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  name,
  value,
  className = '',
  ...props
}) => {
  const containerClass = [
    styles.container,
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <label className={containerClass}>
      <span className={styles.radioWrapper}>
        <input
          type="radio"
          name={name}
          value={value}
          className={styles.input}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <span className={`${styles.circle} ${checked ? styles.checked : ''}`}>
          {checked && <span className={styles.dot} />}
        </span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
