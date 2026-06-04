import { Chip } from '../../molecules/Chip';
import styles from './ContextSelector.module.css';

/**
 * AI · ContextSelector — quando a pergunta é ambígua, a IA não assume contexto:
 * faz uma pergunta curta e oferece chips de indicação. Resolve a ambiguidade
 * antes de responder (ex.: "dose de adrenalina?" → PCR/Anafilaxia/...).
 *
 * Props:
 *  - question: pergunta de contexto
 *  - options: array de string | { label, value }
 *  - value: opção selecionada (controlado, opcional)
 *  - onSelect(option): callback ao escolher
 */
export const ContextSelector = ({ question, options = [], value, onSelect }) => (
  <div className={styles.selector}>
    <p className={styles.question}>{question}</p>
    <div className={styles.options}>
      {options.map((raw, i) => {
        const opt = typeof raw === 'string' ? { label: raw, value: raw } : raw;
        const active = value != null && (opt.value ?? opt.label) === value;
        return (
          <Chip
            key={opt.label ?? i}
            state={active ? 'active' : 'default'}
            onClick={onSelect ? () => onSelect(opt.value ?? opt.label, opt) : undefined}
          >
            {opt.label}
          </Chip>
        );
      })}
    </div>
  </div>
);
