import { ProtocolSteps } from '../../molecules/ProtocolSteps';
import styles from './ProtocolHeader.module.css';

const ICONS = {
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  audio: (
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </>
  ),
  audioOff: (
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </>
  ),
  // Alias p/ nome que o PCRFlow passa (audioOn ? 'audio' : 'audio-mute')
  'audio-mute': (
    <>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </>
  ),
  exit: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/**
 * Organism: ProtocolHeader.
 * Cobre as variantes de header de protocolo:
 *  - inline (CAD): back + título/subtítulo + cronômetro pequeno à direita.
 *  - stacked (PCR): título + subtítulo + cronômetro GRANDE à esquerda + botões de ação à direita.
 * chips: [{ label, mono?, tone? }] · actions: [{ icon, label, onClick, active? }]
 * steps: [labels] + currentStep (1-based) + onStepClick → embute ProtocolSteps (Show Steps).
 * domain: 'sca'|'pcr'|'cad'|'sepse'|'avc' → variante por doença (data-domain p/ acento).
 */
export function ProtocolHeader({
  onBack,
  title,
  subtitle,
  timer,
  timerLabel = 'Caso',
  timerVariant = 'inline',
  chips = [],
  actions = [],
  steps,
  currentStep = 1,
  onStepClick,
  stepStates,
  domain,
  showStatusDot = false,
  showTimerIcon = false,
  compactLabel,
}) {
  const stacked = timerVariant === 'stacked';
  const compact = stacked && Boolean(compactLabel);

  return (
    <header className={[styles.header, stacked ? styles.stacked : '', compact ? styles.compact : '', showStatusDot ? styles.withStatusDot : '', domain ? styles.withDomain : ''].filter(Boolean).join(' ')} data-domain={domain || undefined}>
      <div className={styles.row}>
        <div className={styles.lead}>
          {onBack && (
            <button type="button" className={styles.back} onClick={onBack} aria-label="Sair do protocolo">
              <Icon name="back" />
            </button>
          )}
          <div className={styles.titleBox}>
            {compact ? (
              <span className={styles.compactLabel}>{compactLabel}</span>
            ) : (
              <>
                <span className={styles.titleLine}>
                  {showStatusDot && <span className={styles.statusDot} aria-hidden="true" />}
                  <span className={styles.title}>{title}</span>
                </span>
                {(subtitle || showTimerIcon) && (
                  <span className={styles.subtitleLine}>
                    {showTimerIcon && (
                      <span className={styles.titleIcon} aria-hidden="true">
                        <Icon name="clock" />
                      </span>
                    )}
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                  </span>
                )}
              </>
            )}
            {stacked && timer != null && <span className={`${styles.timerBig} mono`}>{timer}</span>}
          </div>
        </div>

        <div className={styles.right}>
          {!stacked && timer != null && (
            <div className={styles.timer}>
              <span className={styles.timerLabel}>{timerLabel}</span>
              <span className={`${styles.timerValue} mono`}>{timer}</span>
            </div>
          )}
          {actions.map((a, i) => (
            <button
              key={i}
              type="button"
              className={[styles.actionBtn, a.active ? styles.actionBtnActive : ''].filter(Boolean).join(' ')}
              onClick={a.onClick}
              aria-label={a.label}
              aria-pressed={a.active || undefined}
            >
              <Icon name={a.icon} />
            </button>
          ))}
        </div>
      </div>

      {chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map((c, i) => (
            <span key={i} className={[styles.chip, c.mono ? 'mono' : '', c.tone ? styles[`tone-${c.tone}`] : ''].filter(Boolean).join(' ')}>
              {c.label}
            </span>
          ))}
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className={styles.steps}>
          <ProtocolSteps steps={steps} current={currentStep} onStepClick={onStepClick} stepStates={stepStates} />
        </div>
      )}
    </header>
  );
}
