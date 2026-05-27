import styles from './ScoreResult.module.css';

/**
 * Molecule: ScoreResult (DS · Figma calc/score-result 283:145619).
 * Resultado de escore: valor grande + "pontos" + faixa de risco, em card tintado por risco.
 * risk: 'baixo' (verde) | 'moderado' (âmbar) | 'alto' (vermelho). Dark via .modo-escuro.
 * Props: value, risk, riskLabel, pointsLabel.
 */
export const ScoreResult = ({ value, risk = 'baixo', riskLabel, pointsLabel = 'pontos' }) => (
  <div className={[styles.card, styles[`risk-${risk}`]].join(' ')}>
    <div className={styles.valueRow}>
      <span className={`${styles.value} mono`}>{value}</span>
      <span className={styles.pts}>{pointsLabel}</span>
    </div>
    {riskLabel && <span className={styles.risk}>{riskLabel}</span>}
  </div>
);
