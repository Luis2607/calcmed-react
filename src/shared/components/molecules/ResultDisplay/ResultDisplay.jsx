import styles from './ResultDisplay.module.css';

export const ResultDisplay = ({
  value,
  unit,
  label = 'Dose Calculada',
  level = 'success', // 'success' | 'warning' | 'critical'
  darkMode = false,
  className = '',
  ...props
}) => {
  const containerClass = [
    styles.container,
    styles[`level-${level}`],
    darkMode ? styles.dark : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass} {...props}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.valueRow}>
        <span className={`${styles.value} mono`}>{value}</span>
        {unit && <span className={`${styles.unit} mono`}>{unit}</span>}
      </div>
    </div>
  );
};
