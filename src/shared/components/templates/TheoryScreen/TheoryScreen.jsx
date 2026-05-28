import { StepHeader } from '../../molecules/StepHeader/StepHeader';
import { ClinicalCard } from '../../organisms/ClinicalCard/ClinicalCard';
import { Segmented } from '../../molecules/Segmented/Segmented';
import styles from './TheoryScreen.module.css';

/**
 * Template L2: TheoryScreen — a aba Teoria/Consulta/ACLS. Layout padrão; título e conteúdo
 * por prop (golden: "Teoria" | "Consulta rápida" | "ACLS | AHA"). StepHeader + grade de cards
 * de consulta (ClinicalCard plain, data-driven). PCR = exceção de CONTEÚDO: sub-tabs (Segmented).
 *
 * Props:
 *   title ('Teoria'|'Consulta rápida'|'ACLS | AHA') · subtitle?
 *   items? [{ title, sub, onClick }] — cards de consulta (grade)
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
          <button key={i} type="button" className={styles.cardBtn} onClick={it.onClick}>
            <ClinicalCard variant="plain" title={it.title} subtitle={it.sub} />
          </button>
        ))}
      </div>
    ) : null}
  </div>
);
