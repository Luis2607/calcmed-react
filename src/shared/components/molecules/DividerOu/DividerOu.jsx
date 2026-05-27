import styles from './DividerOu.module.css';

/**
 * Molecule: DividerOu (DS · Figma diluicao/divider-ou 331:1558).
 * Divisor horizontal com label central (default "OU"). 14 Medium texto/terciario, gap 12.
 * Dark via .modo-escuro (tokens).
 */
export const DividerOu = ({ label = 'OU' }) => (
  <div className={styles.divider} role="separator" aria-label={label}>
    <span className={styles.line} aria-hidden="true" />
    <span className={styles.label}>{label}</span>
    <span className={styles.line} aria-hidden="true" />
  </div>
);
