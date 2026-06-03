import { Table } from '../../organisms/Table/Table';

/**
 * Molecule: ScoreRangeTable — interpretação de escore.
 * Wrapper fino sobre o Table genérico do DS (regra: toda tabela usa Table).
 * Sem header de coluna (usa caption); 1ª linha (menor risco) em verde.
 * Props: title, rows: [{ points, label }].
 */
const COLUMNS = [
  { key: 'points', label: 'Pontos', mono: true, emphasis: true },
  { key: 'label', label: 'Interpretação' },
];

export const ScoreRangeTable = ({ title = 'Interpretação', rows = [] }) => (
  <Table
    columns={COLUMNS}
    rows={rows}
    caption={title}
    showHeader={false}
    getRowTone={(_, i) => (i === 0 ? 'success' : undefined)}
  />
);
