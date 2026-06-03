import styles from './Table.module.css';

/**
 * Organism: Table — tabela de referência genérica do DS.
 * Componente ÚNICO para qualquer tabela do app (regra: nunca <table>/divs ad-hoc).
 * Leitura apenas, token-only, rolagem horizontal, tipografia DS espaçada.
 *
 * Props:
 *  - columns: [{ key, label, align?: 'left'|'center'|'right', mono?: bool, emphasis?: bool }]
 *  - rows: [{ [key]: ReactNode }]
 *  - caption?: string — rótulo acima da tabela (uppercase, p/ tabelas sem header de coluna)
 *  - showHeader?: bool (default true) — exibe a linha de cabeçalho das colunas
 *  - emptyCell?: string — placeholder de célula vazia (default '—')
 *  - getRowTone?: (row, index) => 'success' | undefined — realça uma linha (ex.: menor risco)
 */
export function Table({
  columns = [],
  rows = [],
  caption,
  showHeader = true,
  emptyCell = '—',
  getRowTone,
}) {
  return (
    <div className={styles.wrap}>
      {caption && <span className={styles.caption}>{caption}</span>}
      <table className={styles.table}>
        {showHeader && (
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={styles.th} data-align={c.align || 'left'}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => {
            const tone = getRowTone ? getRowTone(row, i) : undefined;
            return (
              <tr key={i} className={styles.row} data-tone={tone}>
                {columns.map((c) => {
                  const v = row[c.key];
                  const empty = v == null || v === '';
                  return (
                    <td
                      key={c.key}
                      className={[
                        styles.td,
                        c.mono ? styles.mono : '',
                        c.emphasis ? styles.emphasis : '',
                      ].filter(Boolean).join(' ')}
                      data-align={c.align || 'left'}
                    >
                      {empty ? emptyCell : v}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
