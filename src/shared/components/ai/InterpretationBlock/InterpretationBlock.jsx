import { Table } from '../../organisms/Table';
import { SuggestionChips } from '../SuggestionChips';
import styles from './InterpretationBlock.module.css';

/**
 * AI · InterpretationBlock — leitura de exame/score: dado bruto (tabela) +
 * interpretação principal + chips de próxima etapa. Compõe o Table do DS e o
 * SuggestionChips. Regra do pattern: nunca só repetir valores — sempre indicar
 * o próximo passo.
 *
 * Props:
 *  - columns, rows: repassados ao Table do DS
 *  - reading: interpretação principal (node)
 *  - tone: 'atencao' | 'critico' | 'sucesso' | 'info' (cor da leitura)
 *  - chips: itens para SuggestionChips (próxima etapa)
 *  - getRowTone: repassado ao Table (realce de linha)
 *  - onSelect(value, meta): clique nos chips de próxima etapa (continua a conversa)
 */
export const InterpretationBlock = ({ columns, rows, reading, tone = 'info', chips, getRowTone, onSelect }) => (
  <div className={styles.block}>
    <Table columns={columns} rows={rows} getRowTone={getRowTone} />
    {reading && (
      <p className={styles.reading} data-tone={tone}>{reading}</p>
    )}
    {chips && chips.length > 0 && (
      <SuggestionChips
        items={chips}
        onSelect={onSelect ? (item) => onSelect(item.value ?? item.label, item) : undefined}
      />
    )}
  </div>
);
