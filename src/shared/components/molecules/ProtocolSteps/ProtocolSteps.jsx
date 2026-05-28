import { Fragment } from 'react';
import { StepItem } from '../../atoms/StepItem';
import styles from './ProtocolSteps.module.css';

/**
 * Molecule: ProtocolSteps.
 * Progresso de etapas do protocolo (1..N). Compõe átomos StepItem com linha conectora entre eles.
 * steps: array de labels · current: etapa ativa (1-based) · onStepClick(num)
 *
 * stepStates: opcional, array de override por índice. Aceita 'pending'|'active'|'completed'|'warning'.
 * Se passado, sobrescreve a lógica default (current). Necessário para Sepse marcar steps
 * visitados-mas-incompletos como 'warning' (Gustavo 2026-05-28).
 */
export function ProtocolSteps({ steps = [], current = 1, onStepClick, activePresentation = 'circle', stepStates }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {steps.map((label, i) => {
          const num = i + 1;
          const defaultCompleted = num < current;
          const defaultActive = num === current;
          const state = stepStates?.[i]
            ?? (defaultCompleted ? 'completed' : defaultActive ? 'active' : 'pending');
          const navegavel = state === 'completed' || state === 'warning';
          // Conector entre StepItems · "done" = passo seguinte alcançado (Luis 2026-05-28)
          const showConnector = i < steps.length - 1;
          return (
            <Fragment key={label}>
              <StepItem
                number={num}
                label={label}
                state={state}
                disabled={!navegavel && state !== 'active'}
                onClick={() => navegavel && onStepClick?.(num)}
                activePresentation={activePresentation}
              />
              {showConnector && (
                <span
                  className={[styles.connector, activePresentation === 'capsule' ? styles.connectorCapsule : ''].filter(Boolean).join(' ')}
                  data-done={state === 'completed' || state === 'warning' ? 'true' : 'false'}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
