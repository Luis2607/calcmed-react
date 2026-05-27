import styles from './DoseDisplay.module.css';

/**
 * Molecule: DoseDisplay (DS · Figma calc/dose-display 173:10850).
 * Exibição INLINE de dose (sem card): valor teal 32 Bold + unidade 20 Medium + via 14 Regular.
 * DIFERENTE de ResultDisplay (que é card com level success/warning/critical).
 * Tipo: 'single' | 'range' | 'conversor' (range = passe o valor já como "1,4 – 4,2").
 * Dark via .modo-escuro (tokens).
 */
export const DoseDisplay = ({ value, unit, via, tipo = 'single' }) => (
  <div className={styles.dose} data-tipo={tipo}>
    <div className={styles.valueRow}>
      <span className={`${styles.value} mono`}>{value}</span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </div>
    {via && <span className={styles.via}>{via}</span>}
  </div>
);
