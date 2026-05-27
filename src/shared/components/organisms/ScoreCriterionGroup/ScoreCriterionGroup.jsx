import { Icon } from '../../atoms/Icon';
import { Radio } from '../../atoms/Radio';
import styles from './ScoreCriterionGroup.module.css';

/**
 * Organism: ScoreCriterionGroup (DS · Figma calc/score-criterion-group 2227:59924).
 * Acordeão de um eixo do escore (ex.: "Cardiovascular"). Header com System Name +
 * (opcional) Parameter + critério selecionado + badge de pontos + chevron. Expandido
 * lista as opções pontuadas em seleção ÚNICA (radio). Dark via .modo-escuro.
 *
 * Estados Figma: Collapsed-Empty / Collapsed-Filled / Expanded.
 *  - expanded controlado por prop `expanded` + `onToggle`.
 *  - "Filled" = há `value` selecionado (mostra badge + critério selecionado).
 *
 * Props:
 *  - systemName (System Name) · parameter (Show Parameter) · placeholder (Selected Criterion vazio)
 *  - options: [{ label, points }] (até 10 · substitui os Show Option N + Label/Points do Figma)
 *  - value (índice da opção selecionada) · onChange(index)
 *  - expanded · onToggle
 *  - showBadge (Show Badge) · showChevron (Show Chevron) · showSelectedCriterion (Show Selected Criterion)
 *  - name (group de radios)
 */
export const ScoreCriterionGroup = ({
  systemName,
  parameter,
  placeholder = 'Toque para selecionar critério',
  options = [],
  value,
  onChange,
  expanded = false,
  onToggle,
  showBadge = true,
  showChevron = true,
  showSelectedCriterion = true,
  name,
}) => {
  const hasValue = value != null && options[value] != null;
  const selected = hasValue ? options[value] : null;
  const groupName = name || `score-group-${systemName || 'x'}`;

  const cardClass = [styles.card, expanded ? styles.expanded : ''].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <button
        type="button"
        className={styles.header}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className={styles.leftCol}>
          <span className={styles.titleRow}>
            <span className={styles.systemName}>{systemName}</span>
            {parameter && <span className={styles.parameter}>{parameter}</span>}
          </span>
          {showSelectedCriterion && (
            <span className={[styles.criterionValue, selected ? styles.criterionFilled : ''].filter(Boolean).join(' ')}>
              {selected ? selected.label : placeholder}
            </span>
          )}
        </span>
        <span className={styles.rightCol}>
          {showBadge && selected && <span className={styles.ptsBadge}>{selected.points}</span>}
          {showChevron && (
            <Icon
              name={expanded ? 'dropdown-up' : 'dropdown'}
              size={24}
              className={styles.chevron}
            />
          )}
        </span>
      </button>

      {expanded && (
        <>
          <span className={styles.divider} />
          <div className={styles.list} role="radiogroup">
            {options.map((opt, i) => {
              const isSel = value === i;
              return (
                <label
                  key={i}
                  className={[styles.option, isSel ? styles.optionSelected : ''].filter(Boolean).join(' ')}
                >
                  <Radio
                    name={groupName}
                    checked={isSel}
                    onChange={() => onChange && onChange(i)}
                  />
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionPts}>{opt.points}</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
