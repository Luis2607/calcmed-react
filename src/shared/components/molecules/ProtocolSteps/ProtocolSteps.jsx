import { Fragment } from 'react';
import { StepItem } from '../../atoms/StepItem';
import styles from './ProtocolSteps.module.css';

/**
 * Molecule: ProtocolSteps.
 * Progresso de etapas do protocolo (1..N). Compõe átomos StepItem com linha conectora entre eles.
 * steps: array de labels · current: etapa ativa (1-based) · onStepClick(num)
 */
export function ProtocolSteps({ steps = [], current = 1, onStepClick, activePresentation = 'circle' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {steps.map((label, i) => {
          const num = i + 1;
          const completed = num < current;
          const active = num === current;
          return (
            <Fragment key={label}>
              <StepItem
                number={num}
                label={label}
                state={completed ? 'completed' : active ? 'active' : 'pending'}
                disabled={!completed}
                onClick={() => completed && onStepClick?.(num)}
                activePresentation={activePresentation}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
