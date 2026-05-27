import { Checkbox } from '../../atoms/Checkbox';
import styles from '../RadioGroup/SelectionGroup.module.css';

/**
 * Molecule: CheckboxGroup (DS · Figma calc/checkbox-group 901:164669).
 * Compõe N Checkbox em 1 ou 2 colunas. Seleção múltipla (value = array de values).
 * variant: 'card' (default, opção bordeada como o Figma) | 'plain' (checkbox nu).
 * radius: 'card' (12px) | 'pill' (999px) — só vale no variant card.
 * options: [{ value, label, disabled? }].
 */
export const CheckboxGroup = ({ label, options = [], value = [], onChange, columns = 1, variant = 'card', radius = 'card' }) => {
  const selected = new Set(value);
  const toggle = (v, next) => {
    const s = new Set(selected);
    if (next) s.add(v);
    else s.delete(v);
    if (onChange) onChange([...s]);
  };
  return (
    <fieldset className={styles.group}>
      {label && <legend className={styles.label}>{label}</legend>}
      <div className={columns === 2 ? styles.cols2 : styles.cols1}>
        {options.map((opt) => {
          const isSel = selected.has(opt.value);
          const cardClass = variant === 'card'
            ? [styles.optionCard, radius === 'pill' ? styles.optionCardPill : '', isSel ? styles.optionCardSelected : ''].filter(Boolean).join(' ')
            : '';
          return (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={isSel}
              onChange={(next) => toggle(opt.value, next)}
              disabled={opt.disabled}
              className={cardClass}
            />
          );
        })}
      </div>
    </fieldset>
  );
};
