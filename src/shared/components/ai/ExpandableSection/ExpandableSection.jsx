import { useState } from 'react';
import { Icon } from '../../atoms/Icon';
import styles from './ExpandableSection.module.css';

/**
 * AI · ExpandableSection — progressive disclosure INLINE (não abre sheet).
 * Usado na Learning Layer e em detalhes opcionais: resumo curto agora,
 * profundidade sob demanda. Difere do DisclosureCard do DS (que abre sheet).
 *
 * Props:
 *  - title: rótulo do gatilho
 *  - hint: texto auxiliar à direita do gatilho (opcional)
 *  - defaultOpen (default false)
 *  - children: conteúdo revelado
 */
export const ExpandableSection = ({ title, hint, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section} data-open={open}>
      <button type="button" className={styles.trigger} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className={styles.chevron} data-open={open}>
          <Icon name="chevronRight" size={16} />
        </span>
        <span className={styles.title}>{title}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </button>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  );
};
