import styles from './Sheet.module.css';

/**
 * Molecule: SheetTextarea.
 * Campo de texto multilinha para FormSheet (anotacao, comentario).
 * Controlado: value + onChange(string). maxLength mostra contador.
 */
export function SheetTextarea({ label, value = '', onChange, placeholder, maxLength, rows = 5, id }) {
  return (
    <div className={styles.textareaField}>
      {label && <label className={styles.textareaLabel} htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
      />
      {maxLength && <span className={styles.charCount}>{value.length}/{maxLength}</span>}
    </div>
  );
}
