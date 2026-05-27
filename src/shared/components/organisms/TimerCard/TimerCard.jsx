import styles from './TimerCard.module.css';

/**
 * Organism: TimerCard.
 * Card de cronometro clinico para Central de Urgencia (Porta-ECG, compressao, adrenalina).
 * Code-first: registrar/sincronizar no Figma quando a familia PCR for portada.
 */
export function TimerCard({
  label,
  value,
  description,
  tone = 'primary',
  meta,
  children,
}) {
  return (
    <section className={styles.card} data-tone={tone}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>

      <strong className={`${styles.value} mono`}>{value}</strong>

      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
