import styles from './Chip.module.css';

/**
 * Molecule: Chip (DS · Figma "Tags e Chips").
 * Chip 128:3792 (filtro): State = Default (outline) | Active (teal filled) | Inactive (outline dimmed).
 * Chip Dismissible 128:3801: + X de remover (prop onDismiss); tone domain opcional.
 * Pill 36h, pad 8/16, 14 Medium. Dark via .modo-escuro.
 *
 * Props:
 *  - label/children
 *  - state: 'default' | 'active' | 'inactive'
 *  - tone?: domínio (urgencias|diluicoes|...) — colore como chip removível de domínio
 *  - onClick?, onDismiss? (renderiza X)
 */
export const Chip = ({ label, children, state = 'default', tone, onClick, onDismiss }) => {
  const cls = [
    styles.chip,
    styles[state],
    tone ? styles[`tone-${tone}`] : '',
    onDismiss ? styles.dismissible : '',
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} onClick={onClick}>
      <span className={styles.label}>{children ?? label}</span>
      {onDismiss && (
        <span
          className={styles.x}
          role="button"
          aria-label="Remover"
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
    </button>
  );
};

/**
 * Molecule: UnitChip (DS · Figma calc/concentration-chip 173:10855).
 * Chip pequeno (24h, pill) p/ unidade/concentração: "50 mcg/mL". 11 Semi Bold.
 */
export const UnitChip = ({ children, label }) => (
  <span className={styles.unitChip}>{children ?? label}</span>
);
