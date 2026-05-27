import { Radio } from '../../atoms/Radio';
import styles from './SelectionGroup.module.css';

/**
 * Molecule: RadioGroup (DS · Figma calc/radio-group 173:11246).
 * Compõe N Radio em 1 ou 2 colunas (variant Columns). Seleção única.
 * variant: 'card' (default, opção bordeada como o Figma) | 'plain' (radio nu).
 * radius: 'card' (12px) | 'pill' (999px) — só vale no variant card.
 * options: [{ value, label, disabled? }].
 */
export const RadioGroup = ({
  label,
  name = 'radio-group',
  options = [],
  value,
  onChange,
  columns = 1,
  variant = 'card',
  radius = 'card',
}) => (
  <fieldset className={styles.group}>
    {label && <legend className={styles.label}>{label}</legend>}
    <div className={columns === 2 ? styles.cols2 : styles.cols1}>
      {options.map((opt) => {
        const selected = value === opt.value;
        const cardClass = variant === 'card'
          ? [styles.optionCard, radius === 'pill' ? styles.optionCardPill : '', selected ? styles.optionCardSelected : ''].filter(Boolean).join(' ')
          : '';
        return (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            checked={selected}
            onChange={() => onChange && onChange(opt.value)}
            disabled={opt.disabled}
            className={cardClass}
          />
        );
      })}
    </div>
  </fieldset>
);
