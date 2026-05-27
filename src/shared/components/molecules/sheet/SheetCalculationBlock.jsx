import styles from './Sheet.module.css';

/**
 * Molecule: SheetCalculationBlock.
 * Bloco de resultado clinico para ToolSheet (dose, score, vazao).
 * Valor em JetBrains Mono tabular; unidade colada em teal.
 */
export function SheetCalculationBlock({ label, value, unit, hint }) {
  return (
    <div className={styles.calcBlock}>
      {label && <span className={styles.calcLabel}>{label}</span>}
      <span className={styles.calcValueRow}>
        <span className={styles.calcValue}>{value}</span>
        {unit && <span className={styles.calcUnit}>{unit}</span>}
      </span>
      {hint && <span className={styles.calcHint}>{hint}</span>}
    </div>
  );
}
