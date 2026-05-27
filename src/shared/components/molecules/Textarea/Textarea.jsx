import styles from './Textarea.module.css';

/**
 * Molecule: Textarea (DS · Figma 127:3228).
 * Campo multilinha. Reusa os tokens --ds-input-* (dark mode via .modo-escuro).
 * states: 'default' | 'error' | 'sucesso'.
 */
export const Textarea = ({
  label,
  value = '',
  onChange,
  placeholder,
  helperText,
  state = 'default',
  disabled = false,
  rows = 3,
  maxLength,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  const wrapClass = [styles.wrap, styles[`state-${state}`], disabled ? styles.disabled : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={wrapClass}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          {...props}
        />
      </div>
      {(helperText || maxLength) && (
        <div className={styles.footer}>
          {helperText && <span className={styles.helper}>{helperText}</span>}
          {maxLength && <span className={styles.count}>{value.length}/{maxLength}</span>}
        </div>
      )}
    </div>
  );
};
