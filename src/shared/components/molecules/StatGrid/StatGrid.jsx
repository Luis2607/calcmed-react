import styles from './StatGrid.module.css';

/**
 * Molecule: StatGrid — grade compacta de tiles {label, value}.
 *
 * Ancorada no GOLDEN consistente (`.valor-card`/`.valor-card-label`), compartilhado por
 * CAD/Sepse/PCR/AVC — NÃO no SCA. Resumos clínicos escaneáveis. Distinto de DetailRow
 * (linha única rótulo/valor): aqui são vários tiles bordeados em grade.
 *
 * Props:
 *   items    [{ label, value }] (obrigatório)
 *   columns  1 | 2 | 3 | 4 (default 2)
 */
export const StatGrid = ({ items = [], columns = 2, className = '', ...props }) => (
  <div
    className={[styles.grid, className].filter(Boolean).join(' ')}
    data-columns={columns}
    {...props}
  >
    {items.map((item, i) => (
      <div key={item.label ?? i} className={styles.tile}>
        <span className={styles.label}>{item.label}</span>
        <strong className={styles.value}>{item.value}</strong>
      </div>
    ))}
  </div>
);
