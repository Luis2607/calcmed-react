import { StepHeader } from '../../molecules/StepHeader/StepHeader';
import { HistoryView } from '../../organisms/HistoryView/HistoryView';
import { Chip } from '../../molecules/Chip';
import styles from './HistoryScreen.module.css';

/**
 * Template L2: HistoryScreen — a aba Histórico, padrão GLOBAL dos protocolos.
 * StepHeader + (opcional) linha de chips de filtro roláveis + HistoryView.
 * Filtros variam por protocolo; a estrutura é a mesma em todos.
 *
 * Props:
 *   title? ('Histórico') · subtitle?
 *   cases [] · onClear? · onCaseClick? — repassados ao HistoryView
 *   filters? { options:[{value,label}], value, onChange } — chips roláveis abaixo do header
 *   detail? — node do caso aberto; se presente, substitui a lista (e oculta filtros)
 */
export const HistoryScreen = ({
  title = 'Histórico',
  subtitle,
  cases = [],
  onClear,
  onCaseClick,
  filters,
  detail,
}) => (
  <div className={styles.screen}>
    <StepHeader as="h2" title={title} subtitle={subtitle} />
    {!detail && filters?.options?.length > 0 && (
      <div className={styles.filters} role="group" aria-label="Filtros do histórico">
        {filters.options.map((o) => (
          <Chip
            key={o.value}
            state={filters.value === o.value ? 'active' : 'default'}
            onClick={() => filters.onChange(o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    )}
    {detail ?? <HistoryView cases={cases} onClear={onClear} onCaseClick={onCaseClick} />}
  </div>
);
