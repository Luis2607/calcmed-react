import styles from './ScoreRangeTable.module.css';

/**
 * Molecule: ScoreRangeTable (DS · Figma calc/score-range-table 283:150321).
 * Tabela de interpretação do escore: cabeçalho + linhas (pontos + label). 1ª linha em verde
 * (faixa de menor risco), demais neutras. Até 6 linhas. Dark via .modo-escuro.
 * Props: title, rows: [{ points, label }].
 */
export const ScoreRangeTable = ({ title = 'Interpretação', rows = [] }) => (
  <div className={styles.table}>
    {title && <span className={styles.head}>{title}</span>}
    {rows.map((r, i) => (
      <div key={i} className={[styles.row, i === 0 ? styles.firstRow : ''].filter(Boolean).join(' ')}>
        <span className={styles.pts}>{r.points}</span>
        <span className={styles.label}>{r.label}</span>
      </div>
    ))}
  </div>
);
