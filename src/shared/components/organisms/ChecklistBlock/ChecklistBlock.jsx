import { Tag } from '../../molecules/Tag';
import { Checkbox } from '../../atoms/Checkbox';
import { InfoButton } from '../../atoms/InfoButton';
import styles from './ChecklistBlock.module.css';

/**
 * Organism: ChecklistBlock (DS · Figma calc/checklist-block 1895:67043).
 * Card de checklist: header (Tag de estado · [info?] · contador "0/4" à direita) + subtítulo + itens.
 * State no Figma = Urgente/Padrao/Preenchida → controlado via prop tagTone + items[].checked.
 * Dark via .modo-escuro.
 *
 * Props:
 *  - tagLabel, tagTone ('critico'|'premium'|'novo'|... default 'critico' p/ Urgente)
 *  - count (ex.: "0/4"), subtitle
 *  - onInfo (botão "?" — recorrente; abre teoria/explicação)
 *  - items: [{ label, checked }], onToggle(index)
 */
export const ChecklistBlock = ({ tagLabel, tagTone = 'critico', count, subtitle, onInfo, items = [], onToggle }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.headerTop}>
        {tagLabel && <Tag variant="status" tone={tagTone}>{tagLabel}</Tag>}
        <div className={styles.headerRight}>
          {onInfo && <InfoButton onClick={onInfo} size={20} />}
          {count && <span className={styles.count}>{count}</span>}
        </div>
      </div>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
    <div className={styles.items}>
      {items.map((it, i) => (
        <Checkbox
          key={i}
          label={it.label}
          checked={!!it.checked}
          onChange={() => onToggle && onToggle(i)}
        />
      ))}
    </div>
  </div>
);
