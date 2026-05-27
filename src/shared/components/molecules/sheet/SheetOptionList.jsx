import styles from './Sheet.module.css';

/**
 * options: [{ value, label, description?, disabled? }]
 * value: currently selected value (string|number)
 * onChange: (value) => void
 */
export function SheetOptionList({ options, value, onChange, name }) {
  return (
    <ul className={styles.optionList} role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <li key={String(opt.value)}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={opt.disabled}
              onClick={() => onChange?.(opt.value)}
              className={[styles.option, selected ? styles.optionSelected : ''].filter(Boolean).join(' ')}
            >
              <div className={styles.optionMain}>
                <span>{opt.label}</span>
                {opt.description && <span className={styles.optionDescription}>{opt.description}</span>}
              </div>
              {selected && (
                <svg className={styles.optionCheck} viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
