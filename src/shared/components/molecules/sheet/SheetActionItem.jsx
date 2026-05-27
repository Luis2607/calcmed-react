import styles from './Sheet.module.css';

/**
 * Molecule: SheetActionItem.
 * Item de acao para ActionSheet (ex: PCR "Adicionar evento").
 * variant="default": titulo + sub + botao "+" no fim.
 * variant="extra": linha tracejada centralizada ("Outro · nao listado").
 */
export function SheetActionItem({ label, description, onSelect, disabled, variant = 'default' }) {
  const isExtra = variant === 'extra';
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        className={[styles.actionItem, isExtra ? styles.actionItemExtra : ''].filter(Boolean).join(' ')}
      >
        {isExtra ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className={styles.actionLabel}>{label}</span>
          </>
        ) : (
          <>
            <span className={styles.actionMain}>
              <span className={styles.actionLabel}>{label}</span>
              {description && <span className={styles.actionDesc}>{description}</span>}
            </span>
            <span className={styles.actionAdd} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </>
        )}
      </button>
    </li>
  );
}
