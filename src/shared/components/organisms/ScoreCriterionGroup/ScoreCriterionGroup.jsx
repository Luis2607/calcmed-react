import { Icon } from '../../atoms/Icon';
import { Radio } from '../../atoms/Radio';
import { Checkbox } from '../../atoms/Checkbox';
import styles from './ScoreCriterionGroup.module.css';

/**
 * Organism: ScoreCriterionGroup (DS · Figma calc/score-criterion-group 2227:59924).
 * Card de critério de score — todo critério (multi-nível OU binário) vive aqui,
 * num container visual consistente. 3 modos:
 *
 *  - **accordion** (default) — multi-nível com chevron + expand/collapse. Lista de
 *    opções single-select (Radio). Ex.: SOFA Cardiovascular (5 opções).
 *
 *  - **binary** (Luis 2026-05-28) — critério booleano (sem opções). Header simples
 *    com Checkbox no canto direito + badge de pontos. Sem chevron, sem body.
 *    Ex.: SIRS Temperatura/FC/FR/Leucócitos · NEWS O₂ suplementar.
 *
 *  - **alwaysOpen + optionsLayout=horizontal** (golden `shouldRenderHorizontal`) —
 *    critério multi-nível com ≤3 opções curtas. Sem chevron, body sempre visível,
 *    opções lado a lado em row. Ex.: NEWS Consciência (Alerta/Alterado).
 *
 * Estados Figma: Collapsed-Empty / Collapsed-Filled / Expanded.
 *  - expanded controlado por prop `expanded` + `onToggle` (modo accordion);
 *  - "Filled" = há `value` selecionado (mostra badge + critério selecionado).
 *
 * Props:
 *  - systemName, parameter, placeholder
 *  - options: [{ label, points }] (modo accordion)
 *  - value (índice da opção selecionada), onChange(index)  ← modo accordion
 *  - expanded, onToggle  ← modo accordion
 *  - showBadge, showChevron, showSelectedCriterion  ← modo accordion
 *  - name  ← radio group name
 *  - **binary** (bool): muda anatomia pra checkbox interno (sem body)
 *  - **binaryChecked** (bool): valor do checkbox interno
 *  - **onBinaryChange** (fn(bool)): callback do checkbox
 *  - **points** (string): pontuação exibida no badge (ex.: "+1")
 *  - **alwaysOpen** (bool): força aberto (ignora expanded/onToggle), esconde chevron
 *  - **optionsLayout** ('vertical' | 'horizontal'): layout do .list em modo accordion.
 *    horizontal usado pra ≤3 opções curtas (Consciência Alerta/Alterado lado a lado).
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
  binary = false,
  binaryChecked = false,
  onBinaryChange,
  points,
  alwaysOpen = false,
  optionsLayout = 'vertical',
}) => {
  // ── Modo BINARY · header com Checkbox + badge, sem body ─────────────
  if (binary) {
    const cardClass = [styles.card, binaryChecked ? styles.expanded : ''].filter(Boolean).join(' ');
    return (
      <label className={cardClass}>
        <div className={[styles.header, styles.headerBinary].join(' ')}>
          <span className={styles.leftCol}>
            <span className={styles.titleRow}>
              <span className={styles.systemName}>{systemName}</span>
              {parameter && <span className={styles.parameter}>{parameter}</span>}
            </span>
          </span>
          <span className={styles.rightCol}>
            {points && <span className={styles.ptsBadge}>{points}</span>}
            <Checkbox checked={binaryChecked} onChange={onBinaryChange} />
          </span>
        </div>
      </label>
    );
  }

  // ── Modo ACCORDION (default) ────────────────────────────────────────
  const isOpen = alwaysOpen || expanded;
  const hasValue = value != null && options[value] != null;
  const selected = hasValue ? options[value] : null;
  const groupName = name || `score-group-${systemName || 'x'}`;

  const cardClass = [styles.card, isOpen ? styles.expanded : ''].filter(Boolean).join(' ');
  const showChev = !alwaysOpen && showChevron;
  const headerInteractive = !alwaysOpen;

  const listClass = [
    styles.list,
    optionsLayout === 'horizontal' ? styles.listHorizontal : '',
  ].filter(Boolean).join(' ');

  // Conteúdo do header (compartilhado entre header interactive button e header static div)
  const headerContent = (
    <>
      <span className={styles.leftCol}>
        <span className={styles.titleRow}>
          <span className={styles.systemName}>{systemName}</span>
          {parameter && <span className={styles.parameter}>{parameter}</span>}
        </span>
        {/* Em alwaysOpen, o "Toque para selecionar critério" é redundante
            (o usuário JÁ vê as opções abaixo). */}
        {!alwaysOpen && showSelectedCriterion && (
          <span className={[styles.criterionValue, selected ? styles.criterionFilled : ''].filter(Boolean).join(' ')}>
            {selected ? selected.label : placeholder}
          </span>
        )}
      </span>
      <span className={styles.rightCol}>
        {showBadge && selected && <span className={styles.ptsBadge}>{selected.points}</span>}
        {showChev && (
          <Icon
            name={expanded ? 'dropdown-up' : 'dropdown'}
            size={24}
            className={styles.chevron}
          />
        )}
      </span>
    </>
  );

  return (
    <div className={cardClass}>
      {headerInteractive ? (
        <button type="button" className={styles.header} onClick={onToggle} aria-expanded={expanded}>
          {headerContent}
        </button>
      ) : (
        <div className={[styles.header, styles.headerStatic].join(' ')}>{headerContent}</div>
      )}

      {isOpen && (
        <>
          <span className={styles.divider} />
          <div className={listClass} role="radiogroup">
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
