import styles from './Sheet.module.css';

export function SheetHeader({
  title,
  titleId,
  description,
  leadingIcon,
  tone = 'neutral',
  showHandle = true,
  onClose,
  closeLabel = 'Fechar',
}) {
  return (
    <header
      className={[styles.header, showHandle ? styles.headerHandle : ''].filter(Boolean).join(' ')}
      data-tone={tone}
    >
      <div className={styles.headerLead}>
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <div className={styles.headerText}>
          <h2 id={titleId} className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </header>
  );
}
