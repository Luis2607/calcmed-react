import { InfoButton } from '../../atoms/InfoButton';
import styles from './TimerCard.module.css';

/**
 * Organism: TimerCard.
 * Card de cronometro clinico para Central de Urgencia (Porta-ECG, compressao, adrenalina).
 *
 * - tone: 'primary' | 'critical' | 'warning' — uso atual (SCA). Inalterado.
 * - state (opcional, golden PCR `.pcr-card-*`): 'idle' | 'running' | 'cycle-end' |
 *   'window-ok' | 'window-overdue'. Sem state, segue o tone (zero mudanca p/ SCA).
 *   idle=mudo · running=primario 2px · cycle-end=critico · window-ok=sucesso ·
 *   window-overdue=critico + pulso (unico diferencial visual vs cycle-end).
 * - onInfo (opcional · golden PCR `.pcr-info-btn`): botao "?" no header top-right
 *   ao lado do meta. Abre modal de teoria/explicacao do card (qualidade RCP, adrenalina, etc).
 * Code-first: registrar/sincronizar no Figma quando a familia PCR for portada.
 */
export function TimerCard({
  label,
  value,
  description,
  tone = 'primary',
  state,
  meta,
  onInfo,
  children,
}) {
  return (
    <section className={styles.card} data-tone={tone} data-state={state}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.headerRight}>
          {meta && <span className={styles.meta}>{meta}</span>}
          {onInfo && <InfoButton onClick={onInfo} size={20} />}
        </div>
      </div>

      <strong className={`${styles.value} mono`}>{value}</strong>

      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
