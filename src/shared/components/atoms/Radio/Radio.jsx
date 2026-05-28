import styles from './Radio.module.css';

export const Radio = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  name,
  value,
  className = '',
  ...props
}) => {
  const containerClass = [
    styles.container,
    description ? styles.containerWithDescription : '',
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
      {(label || description) && (
        <span className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </span>
      )}
    </label>
  );
};
