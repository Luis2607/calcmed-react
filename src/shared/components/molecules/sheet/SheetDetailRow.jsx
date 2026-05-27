import styles from './Sheet.module.css';

/**
 * Molecule: SheetDetailRow.
 * Linha label/valor read-only para DetailSheet (caso do historico).
 */
export function SheetDetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
