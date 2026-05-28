import { Tag } from '../Tag/Tag';
import styles from './EventoCardNovo.module.css';

/**
 * Molecule: EventoCardNovo (DS · code-first F-PCR-2.10).
 * Card pra modal "Adicionar evento" PCR T2 · cada droga/procedimento/ritmo é uma
 * opção clicável com nome + dose + contador atual (×N) + botão aplicar.
 *
 * Anatomia golden (pcr.js abrirModalAdicionarEvento):
 *  - [Nome em bold] [dose subtle] [Tag count "×N"]
 *  - Clicável (whole card) — onApply()
 *
 * Props:
 *  - name: string (required) — droga/procedimento/ritmo.
 *  - dose?: string — descrição/dose (ex.: "300 mg IV/IO bolus").
 *  - count?: number — quantas vezes já foi aplicado (mostra Tag se > 0).
 *  - onApply: () => void.
 *  - disabled?: bool.
 *  - icon?: string — ícone do evento.
 *
 * Tokens-only.
 */
export function EventoCardNovo({ name, dose, count = 0, onApply, disabled = false }) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onApply}
      disabled={disabled}
      aria-label={`Aplicar ${name}${count > 0 ? ` (já aplicado ${count}×)` : ''}`}
    >
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        {dose && <span className={styles.dose}>{dose}</span>}
      </div>
      {count > 0 && (
        <Tag variant="count">{`×${count}`}</Tag>
      )}
    </button>
  );
}
