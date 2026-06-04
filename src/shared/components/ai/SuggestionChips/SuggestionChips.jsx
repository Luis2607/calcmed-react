import { Chip } from '../../molecules/Chip';
import styles from './SuggestionChips.module.css';

/**
 * AI · SuggestionChips — linha de chips de continuidade (próximo passo,
 * refinamento, ação rápida). Compõe o Chip do DS; não cria visual novo.
 *
 * Props:
 *  - items: array de string | { label, active?, onClick? }
 *  - label: eyebrow opcional acima dos chips
 *  - onSelect(item, index): atalho de clique (usado quando item é string)
 */
export const SuggestionChips = ({ items = [], label, onSelect }) => {
  if (!items.length) return null;
  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row}>
        {items.map((raw, i) => {
          const item = typeof raw === 'string' ? { label: raw } : raw;
          return (
            <Chip
              key={item.label ?? i}
              state={item.active ? 'active' : 'default'}
              onClick={item.onClick ?? (onSelect ? () => onSelect(item, i) : undefined)}
            >
              {item.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};
