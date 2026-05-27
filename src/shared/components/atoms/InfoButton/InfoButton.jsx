import styles from './InfoButton.module.css';

/**
 * Atom: InfoButton — botão "?" recorrente (abre teoria/explicação, ex.: via InfoSheet).
 * Reusado em SectionLabel, ChecklistBlock e headers clínicos. Default 20px (touch-friendly).
 */
export const InfoButton = ({ onClick, size = 20, ariaLabel = 'Mais informações', className = '', ...props }) => (
  <button
    type="button"
    className={[styles.info, className].filter(Boolean).join(' ')}
    style={{ width: size, height: size }}
    onClick={onClick}
    aria-label={ariaLabel}
    {...props}
  >
    ?
  </button>
);
