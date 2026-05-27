import styles from './DisclosureCard.module.css';

/**
 * Molecule: DisclosureCard (DS · base Figma diluicao/solucao-card 327:102662, repositionado).
 * Row tappável (título + subtítulo + chevron) que ABRE um BottomSheet com o conteúdo.
 * Uso: Teoria, referência clínica, "saiba mais", detalhe de diluição, etc.
 * O sheet em si é responsabilidade do consumidor (onClick → abre InfoSheet/DetailSheet).
 *
 * Props: title, subtitle, leftIcon (node opcional), onClick, showChevron.
 */
export const DisclosureCard = ({ title, subtitle, leftIcon, onClick, showChevron = true }) => (
  <button type="button" className={styles.card} onClick={onClick}>
    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
    <span className={styles.text}>
      <span className={styles.title}>{title}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </span>
    {showChevron && (
      <span className={styles.chevron} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    )}
  </button>
);
