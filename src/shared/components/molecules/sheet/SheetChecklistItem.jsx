import styles from './Sheet.module.css';

/**
 * Molecule: SheetChecklistItem.
 * Item marcavel (checkbox) para ChecklistSheet. Controlado:
 * checked + onToggle(nextBool).
 */
export function SheetChecklistItem({ label, description, checked = false, onToggle, disabled }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onToggle?.(!checked)}
      className={[styles.checklistItem, checked ? styles.checklistItemChecked : ''].filter(Boolean).join(' ')}
    >
      <span className={styles.checklistBox} aria-hidden="true">
        {checked && (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={styles.checklistMain}>
        <span className={styles.checklistLabel}>{label}</span>
        {description && <span className={styles.checklistDesc}>{description}</span>}
      </span>
    </button>
  );
}
