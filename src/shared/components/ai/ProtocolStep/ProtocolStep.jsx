import styles from './ProtocolStep.module.css';

/**
 * AI · ProtocolStep — pattern "Protocol Stepper": mostra a ETAPA ATUAL de um
 * protocolo longo (PCR, sepse, AVC, CAD, IOT) com progresso, sem despejar o
 * protocolo inteiro. Etapas anteriores = concluídas, a atual = destacada,
 * próximas = atenuadas. A ramificação vem por chips (SuggestionChips) à parte.
 *
 * Props:
 *  - label: nome do protocolo (default "Protocolo")
 *  - current: índice (0-based) da etapa atual
 *  - steps: array de string | { label }
 */
export const ProtocolStep = ({ label = 'Protocolo', current = 0, steps = [] }) => {
  const total = steps.length;
  return (
    <div className={styles.block}>
      <span className={styles.eyebrow}>{label} · etapa {Math.min(current + 1, total)} de {total}</span>
      <ol className={styles.list}>
        {steps.map((raw, i) => {
          const step = typeof raw === 'string' ? { label: raw } : raw;
          const state = i < current ? 'done' : i === current ? 'active' : 'upcoming';
          return (
            <li key={step.label ?? i} className={styles.step} data-state={state}>
              <span className={styles.marker} aria-hidden="true">{state === 'done' ? '✓' : i + 1}</span>
              <span className={styles.label}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
