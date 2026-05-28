import styles from './TETTabela.module.css';

/**
 * Organism: TETTabela (DS · code-first F-PCR-2.8).
 * Tabela 3-col (faixa · sem cuff · com cuff) com 6 linhas pediátricas (pcr.js linha 876).
 *
 * Apenas leitura. Mono font nas medidas (tnum). Border-collapse com padding compacto.
 *
 * Props:
 *  - rows: [{faixa, semCuff, comCuff}] — required.
 *  - caption?: string — para acessibilidade screen reader.
 *
 * Tokens-only. Sem hardcode.
 */
export function TETTabela({ rows = [], caption }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            <th className={styles.th} scope="col">Faixa etária</th>
            <th className={styles.th} scope="col">Sem cuff</th>
            <th className={styles.th} scope="col">Com cuff</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.td}>{row.faixa}</td>
              <td className={[styles.td, styles.tdValue].join(' ')}>{row.semCuff}</td>
              <td className={[styles.td, styles.tdValue].join(' ')}>{row.comCuff || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

