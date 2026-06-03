import { Table } from '../Table/Table';

/**
 * Organism: TETTabela (DS · code-first F-PCR-2.8).
 * Tabela 3-col (faixa · sem cuff · com cuff) pediátrica (pcr.js linha 876).
 * Wrapper fino sobre o componente genérico Table (regra DS: toda tabela usa Table).
 *
 * Props:
 *  - rows: [{faixa, semCuff, comCuff}] — required.
 *  - caption?: string.
 */
const TET_COLUMNS = [
  { key: 'faixa', label: 'Faixa etária', emphasis: true },
  { key: 'semCuff', label: 'Sem cuff', mono: true },
  { key: 'comCuff', label: 'Com cuff', mono: true },
];

export function TETTabela({ rows = [], caption }) {
  return <Table columns={TET_COLUMNS} rows={rows} caption={caption} />;
}
