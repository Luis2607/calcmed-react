import { Tag } from '../../molecules/Tag';
import styles from './ClinicalCard.module.css';

/**
 * Organism: ClinicalCard (DS · base Figma calc/drug-card-vaso 1965:33074, generalizado).
 * CONTAINER composável de conteúdo clínico. O corpo (children) aceita qualquer componente:
 * InputField, AlertCard, ChecklistBlock, RadioGroup, DoseDisplay, etc.
 * Os configuráveis são props (= component properties no Figma): tags, title, subtitle, state.
 *
 * Props:
 *  - state: 'default' | 'ativo' (borda teal 2px) | 'inativo'
 *  - variant: 'default' | 'plain' (card de seção neutro = golden `.exame-card`:
 *    gap 12, título 16/600, borda padrão; cobre SectionCard/medCard/setupCard)
 *  - tags: [{ label, tone }] — header tags (Tag status)
 *  - title (18 Semi Bold; 16 no plain), subtitle (14 secundario)
 *  - children — conteúdo livre
 * Dark via .modo-escuro.
 */
export const ClinicalCard = ({ state = 'default', variant = 'default', tags = [], title, subtitle, children, className = '' }) => {
  const cls = [styles.card, styles[`state-${state}`], styles[`variant-${variant}`], className].filter(Boolean).join(' ');
  const hasHeader = (tags && tags.length > 0) || title || subtitle;
  return (
    <div className={cls}>
      {hasHeader && (
        <div className={styles.head}>
          {tags && tags.length > 0 && (
            <div className={styles.tagRow}>
              {tags.map((t, i) => (
                <Tag key={i} variant="status" tone={t.tone}>{t.label}</Tag>
              ))}
            </div>
          )}
          {title && <span className={styles.title}>{title}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
};
