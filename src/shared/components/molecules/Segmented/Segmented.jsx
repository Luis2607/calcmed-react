import styles from './Segmented.module.css';

/**
 * Molecule: Segmented (DS · Figma Toggle Segmented 128:3688).
 * Alternância segmentada (ex.: Adulto/Pediatra). Container r12 fill --ds-fundo-elevado,
 * segmento ativo branco. options: [{ value, label }].
 */
export const Segmented = ({ options = [], value, onChange, label, ...props }) => {
  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.container} role="tablist" {...props}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              className={[styles.segment, active ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => onChange && onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
