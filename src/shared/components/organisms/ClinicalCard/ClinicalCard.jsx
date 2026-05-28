import { Tag } from '../../molecules/Tag';
import { InfoButton } from '../../atoms/InfoButton/InfoButton';
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
 *  - onInfo? — opcional (Luis 2026-05-28): renderiza InfoButton "?" no canto superior
 *    direito do header, alinhado ao título (golden drug-card-vaso tem isso). Usado pelos
 *    drug-cards do T4 Sepse pra abrir a teoria/explicação da droga.
 *  - children — conteúdo livre
 * Dark via .modo-escuro.
 */
export const ClinicalCard = ({ state = 'default', variant = 'default', tags = [], title, subtitle, onInfo, children, className = '' }) => {
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
          {(title || onInfo) && (
            <div className={styles.titleRow}>
              {title && <span className={styles.title}>{title}</span>}
              {onInfo && <InfoButton onClick={onInfo} size={20} />}
            </div>
          )}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
};
