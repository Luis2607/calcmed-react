import { Button } from '../../atoms/Button/Button';
import styles from './ActionFooter.module.css';

const EMPTY_ACTIONS = [];

/**
 * Fixed action area used above the bottom navigation in urgent protocols.
 * hint supports the small clinical text that sometimes appears over actions.
 */
export function ActionFooter({
  hint,
  meta,
  primary,
  secondary,
  backLink,
  actions = EMPTY_ACTIONS,
  sticky = false,
}) {
  const resolvedActions = actions.length > 0
    ? actions
    : [secondary, primary].filter(Boolean);

  return (
    <section className={[styles.footer, sticky ? styles.sticky : ''].filter(Boolean).join(' ')}>
      {/* backLink (Luis 2026-05-28) — link textual discreto "← Voltar" à esquerda,
          em linha própria acima do hint/actions. Padrão Opção C da pesquisa NN/g
          (1 primary + link textual quando há evidência de necessidade). */}
      {backLink && (
        <button type="button" className={styles.backLink} onClick={backLink.onClick}>
          ← {backLink.label || 'Voltar'}
        </button>
      )}

      {(hint || meta) && (
        <div className={styles.hintRow}>
          {hint && <span className={styles.hint}>{hint}</span>}
          {meta && <span className={styles.meta}>{meta}</span>}
        </div>
      )}

      <div className={styles.actions}>
        {resolvedActions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant || 'primary'}
            size={action.size || 'md'}
            disabled={action.disabled}
            onClick={action.onClick}
            showLeftIcon={Boolean(action.leftIcon)}
            leftIcon={action.leftIcon}
            showRightIcon={Boolean(action.rightIcon)}
            rightIcon={action.rightIcon}
            className={styles.button}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
