import styles from './StepItem.module.css';

/**
 * Atom: StepItem — um passo do progresso de protocolo (círculo + label).
 * state: 'pending' | 'active' | 'completed' | 'warning'. Completed/warning clicáveis.
 * 'warning' = step visitado mas com itens pendentes (Gustavo 2026-05-28).
 * Code-first (Central de Urgência) → portar pro Figma depois.
 */
export const StepItem = ({ number, label, state = 'pending', onClick, disabled = false, activePresentation = 'circle' }) => {
  const status =
    state === 'completed' ? styles.completed :
    state === 'active' ? styles.active :
    state === 'warning' ? styles.warning :
    styles.pending;
  const capsule = activePresentation === 'capsule';
  const glyph =
    state === 'completed' ? '✓' :
    state === 'warning' ? '!' :
    number;
  return (
    <button
      type="button"
      className={[
        styles.step,
        capsule ? styles.capsule : '',
        capsule && state === 'active' ? styles.capsuleActive : '',
        capsule && state === 'warning' ? styles.capsuleWarning : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-current={state === 'active' ? 'step' : undefined}
      aria-label={state === 'warning' ? `${label} · pendente` : label}
    >
      <span className={[styles.circle, status].join(' ')}>{glyph}</span>
      <span className={[
        styles.label,
        state === 'active' ? styles.labelActive : '',
        state === 'warning' ? styles.labelWarning : '',
      ].filter(Boolean).join(' ')}>{label}</span>
    </button>
  );
};
