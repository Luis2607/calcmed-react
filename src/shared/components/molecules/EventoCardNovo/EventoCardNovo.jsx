import { Tag } from '../Tag/Tag';
import styles from './EventoCardNovo.module.css';

/**
 * Molecule: EventoCardNovo (DS · code-first F-PCR-2.10 · refatorado PM4).
 * Card pra modal "Adicionar evento" PCR T2. Card = container info; o botão "+"
 * à direita é o único elemento clicável (golden anatomia: tap target dedicado).
 *
 * Anatomia golden:
 *  - [Body: nome em bold + dose subtle] [count "×N" tag] [botão "+" teal circular]
 *  - Card ganha border accent quando count > 0 (já foi aplicado).
 *
 * Props:
 *  - name: string (required) — droga/procedimento/ritmo.
 *  - dose?: string — descrição/dose (ex.: "300 mg IV/IO bolus").
 *  - count?: number — quantas vezes já foi aplicado (mostra Tag + accent).
 *  - onApply: () => void — disparado APENAS no clique do botão "+".
 *  - disabled?: bool.
 *
 * Tokens-only.
 */
export function EventoCardNovo({ name, dose, count = 0, onApply, disabled = false }) {
  const ariaLabel = `Aplicar ${name}${count > 0 ? ` (já aplicado ${count}×)` : ''}`;
  return (
    <div className={styles.card} data-applied={count > 0 ? 'true' : 'false'}>
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        {dose && <span className={styles.dose}>{dose}</span>}
      </div>
      {count > 0 && (
        <Tag variant="count">{`×${count}`}</Tag>
      )}
      <button
        type="button"
        className={styles.applyBtn}
        onClick={onApply}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
