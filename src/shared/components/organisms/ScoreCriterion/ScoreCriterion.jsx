import { Checkbox } from '../../atoms/Checkbox';
import { Radio } from '../../atoms/Radio';
import { Segmented } from '../../molecules/Segmented';
import { Stepper } from '../../molecules/Stepper';
import styles from './ScoreCriterion.module.css';

/**
 * Organism: ScoreCriterion (DS · Figma calc/score-criterion 283:150286 · 56 var).
 * Critério único de escore cujo input varia por `type`. Despacha pro átomo/molécula certo
 * reusando o DS: Checkbox, Radio, Segmented, Stepper, Numeric (input), Slider. Dark via .modo-escuro.
 *
 * Eixos Figma:
 *  - Type: Checkbox | Radio | Stepper | Numeric | Slider | Segmented
 *  - State: Inactive | Active | Error | Disabled
 *  - Has image (Checkbox/Radio): mostra image-slot abaixo da linha
 *  - Options (Segmented): 2 | 3 (derivado de options.length)
 *
 * Props comuns: label (Label/criterion-label), points (Points), showPoints (Show Points),
 *   unit (Unit), placeholder (Placeholder), showCriterionHeader (Show Criterion Header),
 *   state ('inactive'|'active'|'error'|'disabled'), name (radio group), image (Has image).
 * Por tipo:
 *  - checkbox/radio: checked, onChange(checked|nada)
 *  - segmented: options:[{value,label,points}], value, onChange(value)
 *  - stepper:  value(number), onChange(number), min, max, stepperLabel
 *  - numeric:  value(string), onChange(string), helperText
 *  - slider:   value(number), onChange(number), min, max, minLabel, maxLabel
 */
export const ScoreCriterion = ({
  type = 'checkbox',
  label = 'Critério do escore',
  points = '+1',
  showPoints = true,
  unit,
  placeholder = '0',
  state = 'inactive',
  name,
  image = false,
  checked = false,
  value,
  onChange,
  min = 0,
  max = 10,
  stepperLabel,
  helperText,
  minLabel,
  maxLabel,
  options = [],
}) => {
  const disabled = state === 'disabled';
  const isError = state === 'error';
  const pts = showPoints ? <span className={styles.ptsBadge}>{points}</span> : null;

  // --- CHECKBOX / RADIO: linha [indicador + label + pts] (+ image-slot opcional) ---
  if (type === 'checkbox' || type === 'radio') {
    const Indicator = type === 'checkbox' ? Checkbox : Radio;
    const isActive = type === 'checkbox' ? checked : checked || state === 'active';
    return (
      <div className={[styles.stack, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <div className={styles.row}>
          <Indicator
            name={name}
            checked={!!isActive}
            disabled={disabled}
            onChange={onChange}
          />
          <span className={styles.label}>{label}</span>
          {pts}
        </div>
        {image && <div className={styles.imageSlot} aria-hidden="true" />}
      </div>
    );
  }

  // --- SEGMENTED: header [label + pts] + controle segmentado (com pontos por tab) ---
  if (type === 'segmented') {
    const segOptions = options.map((o) => ({
      value: o.value,
      label: o.points ? `${o.label}  ${o.points}` : o.label,
    }));
    return (
      <div className={[styles.padded, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <div className={styles.headerRow}>
          <span className={styles.label}>{label}</span>
          {pts}
        </div>
        <Segmented options={segOptions} value={value} onChange={onChange} />
      </div>
    );
  }

  // --- STEPPER: [Stepper(label/−/value/+) + unit] + label + pts ---
  if (type === 'stepper') {
    return (
      <div className={[styles.row, styles.stepperRow, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <div className={styles.stepperInput}>
          <Stepper
            label={stepperLabel}
            value={typeof value === 'number' ? value : 0}
            onChange={onChange}
            min={min}
            max={max}
            disabled={disabled}
          />
          {unit && <span className={styles.stepperUnit}>{unit}</span>}
        </div>
        <span className={styles.label}>{label}</span>
        {pts}
      </div>
    );
  }

  // --- NUMERIC: input compacto [value + unit] + pts + helper(erro) ---
  if (type === 'numeric') {
    const wrapClass = [styles.numericBox, isError ? styles.numericError : ''].filter(Boolean).join(' ');
    return (
      <div className={[styles.numericStack, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <div className={styles.row}>
          <div className={wrapClass}>
            <input
              className={`${styles.numericInput} mono`}
              type="text"
              inputMode="numeric"
              value={value ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(e) => onChange && onChange(e.target.value)}
            />
            {unit && <span className={styles.numericUnit}>{unit}</span>}
          </div>
          {pts}
        </div>
        {helperText && (
          <span className={[styles.helper, isError ? styles.helperError : ''].filter(Boolean).join(' ')}>
            {helperText}
          </span>
        )}
      </div>
    );
  }

  // --- SLIDER: header [label + value + pts] + track + range labels ---
  if (type === 'slider') {
    const v = typeof value === 'number' ? value : min;
    return (
      <div className={[styles.sliderStack, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
        <div className={styles.headerRow}>
          <span className={styles.label}>{label}</span>
          <span className={styles.sliderValue}>{v}</span>
          {pts}
        </div>
        <input
          className={styles.slider}
          type="range"
          min={min}
          max={max}
          value={v}
          disabled={disabled}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
        />
        <div className={styles.rangeRow}>
          <span className={styles.rangeLabel}>{minLabel ?? `${min}`}</span>
          <span className={styles.rangeLabel}>{maxLabel ?? `${max}`}</span>
        </div>
      </div>
    );
  }

  return null;
};
