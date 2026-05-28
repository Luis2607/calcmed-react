import { StepHeader } from '../../molecules/StepHeader/StepHeader';
import { DisclosureCard } from '../../molecules/DisclosureCard/DisclosureCard';
import { Segmented } from '../../molecules/Segmented/Segmented';
import styles from './TheoryScreen.module.css';

/**
 * Template L2: TheoryScreen — a aba Teoria/Consulta/ACLS. Layout padrão; título e conteúdo
 * por prop (golden: "Teoria" | "Consulta rápida" | "ACLS | AHA"). StepHeader + lista de
 * `DisclosureCard` (o card de consulta do DS: título + subtítulo + chevron, abre sheet —
 * é o componente que JÁ serve pra teoria). PCR = exceção de CONTEÚDO: sub-tabs (Segmented).
 *
 * Props:
 *   title ('Teoria'|'Consulta rápida'|'ACLS | AHA') · subtitle?
 *   items? [{ title, sub, onClick }] — cards de consulta (DisclosureCard)
 *   subTabs? { options:[{value,label}], value, onChange } — sub-abas (PCR)
 *   children? — conteúdo livre (em vez de/antes de items)
 */
export const TheoryScreen = ({ title = 'Teoria', subtitle, items, subTabs, children }) => (
  <div className={styles.screen}>
    <StepHeader as="h2" title={title} subtitle={subtitle} />

    {subTabs ? (
      <Segmented options={subTabs.options} value={subTabs.value} onChange={subTabs.onChange} />
    ) : null}

    {children}

    {items && items.length > 0 ? (
      <div className={styles.grid}>
        {items.map((it, i) => (
          <DisclosureCard key={i} title={it.title} subtitle={it.sub} onClick={it.onClick} />
        ))}
      </div>
    ) : null}
  </div>
);
