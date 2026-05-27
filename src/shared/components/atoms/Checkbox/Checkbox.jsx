import styles from './Checkbox.module.css';

export const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  strikethrough = false,
  className = '',
  ...props
}) => {
  const isChecked = !!checked;

  const containerClass = [
    styles.container,
    disabled ? styles.disabled : '',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e) => {
    if (disabled) return;
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={containerClass}>
      <span className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          className={styles.input}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <span className={`${styles.box} ${isChecked ? styles.checked : ''}`}>
          {isChecked && (
            <svg className={styles.checkmark} viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12l5 5L20 7"
              />
            </svg>
          )}
        </span>
      </span>
      {label && (
        <span className={[styles.label, isChecked && strikethrough ? styles.struck : ''].filter(Boolean).join(' ')}>
          {label}
        </span>
      )}
    </label>
  );
};

