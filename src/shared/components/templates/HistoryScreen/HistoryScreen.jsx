import { StepHeader } from '../../molecules/StepHeader/StepHeader';
import { HistoryView } from '../../organisms/HistoryView/HistoryView';
import styles from './HistoryScreen.module.css';

/**
 * Template L2: HistoryScreen — a aba Histórico, idêntica nos 5 protocolos.
 * StepHeader (tela-cabecalho) + HistoryView (lista + empty + nota LGPD interna). Quando um
 * caso é aberto, o flow passa `detail` (ex.: <PatientDetail/>) e o template o exibe no lugar
 * da lista. Reusa HistoryView/PatientDetail — não reinventa a lista (como o SCA faz hoje).
 *
 * Props:
 *   title? ('Histórico') · subtitle? (nota LGPD da tela)
 *   cases [] · onClear? · onCaseClick? — repassados ao HistoryView
 *   detail? — node do caso aberto (ex.: PatientDetail); se presente, substitui a lista
 */
export const HistoryScreen = ({
  title = 'Histórico',
  subtitle,
  cases = [],
  onClear,
  onCaseClick,
  detail,
}) => (
  <div className={styles.screen}>
    <StepHeader as="h2" title={title} subtitle={subtitle} />
    {detail ?? <HistoryView cases={cases} onClear={onClear} onCaseClick={onCaseClick} />}
  </div>
);
