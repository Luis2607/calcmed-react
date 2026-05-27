import styles from './StepItem.module.css';

/**
 * Atom: StepItem — um passo do progresso de protocolo (círculo + label).
 * state: 'pending' | 'active' | 'completed'. Completos clicáveis; outros disabled.
 * Code-first (Central de Urgência) → portar pro Figma depois.
 */
export const StepItem = ({ number, label, state = 'pending', onClick, disabled = false, activePresentation = 'circle' }) => {
  const status = state === 'completed' ? styles.completed : state === 'active' ? styles.active : styles.pending;
  const capsule = activePresentation === 'capsule';
  return (
    <button
      type="button"
      className={[
        styles.step,
        capsule ? styles.capsule : '',
        capsule && state === 'active' ? styles.capsuleActive : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-current={state === 'active' ? 'step' : undefined}
    >
      <span className={[styles.circle, status].join(' ')}>{state === 'completed' ? '✓' : number}</span>
      <span className={[styles.label, state === 'active' ? styles.labelActive : ''].filter(Boolean).join(' ')}>{label}</span>
    </button>
  );
};
