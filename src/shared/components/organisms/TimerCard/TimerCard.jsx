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
  size = 'md', // 'md' (default 32px · SCA) | 'lg' (56px · PCR foco)
  progress, // 0-100 · mostra barra de progresso (golden .progress-track)
  progressMarkers, // [{ position: 0-100, label }] · marcadores na barra (adrenalina 3/5 min)
  children,
}) {
  const showProgress = typeof progress === 'number';
  const clamped = showProgress ? Math.min(100, Math.max(0, progress)) : 0;
  return (
    <section className={styles.card} data-tone={tone} data-state={state} data-size={size}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.headerRight}>
          {meta && <span className={styles.meta}>{meta}</span>}
          {onInfo && <InfoButton onClick={onInfo} size={20} />}
        </div>
      </div>

      <strong className={`${styles.value} mono`}>{value}</strong>

      {showProgress && (
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${clamped}%` }} />
          </div>
          {Array.isArray(progressMarkers) && progressMarkers.length > 0 && (
            <div className={styles.progressMarkers} aria-hidden="true">
              {progressMarkers.map((m, i) => (
                <span key={i} className={styles.progressMarker} style={{ left: `${m.position}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </section>
  );
}
