import { IconButton } from '../../atoms/IconButton';
import styles from './BannerContextual.module.css';

/**
 * Organism: BannerContextual (DS · code-first F-PCR-2.3).
 * Banner contextual T2 PCR (#banner-t2 golden). Estado dinâmico conforme ciclo/RCE.
 * 4 tones · border-left grosso · pulse no critical (respeitando prefers-reduced-motion).
 *
 * NÃO estende AlertCard — anatomia distinta (border-left 3-6px vs AlertCard sem border-left).
 *
 * Tones e uso PCR:
 *  - 'warning' (amarelo · 3px) — `banner-pre-compressao` operação normal.
 *  - 'critical' (vermelho · 6px · pulse opcional) — `banner-critico-marco` 30s antes do marco
 *    OU marco confirmado "CHECAR PULSO/RITMO".
 *  - 'pos-choque' (amarelo escuro · 3px) — após registrar choque ("Choque registrado · retome compressões").
 *  - 'success' (verde · 3px) — T3 pós-RCE fixo "Decúbito lateral · SpO₂ 90-98%".
 *
 * Props:
 *  - tone: 'warning' | 'critical' | 'pos-choque' | 'success' (required)
 *  - title: string (required) — destaque em uppercase quando critical
 *  - description?: string — segunda linha auxiliar
 *  - pulse?: bool (default false) — ativa animação pulse (só faz sentido em critical)
 *  - onDismiss?: () => void — X close (renderiza IconButton)
 *  - role?: 'alert' | 'status' (default 'status') — 'alert' faz screen reader anunciar
 *
 * Tokens-only · Pulse respeita prefers-reduced-motion (some animação).
 */
export function BannerContextual({
  tone = 'warning',
  title,
  description,
  pulse = false,
  onDismiss,
  role = 'status',
}) {
  const classes = [
    styles.banner,
    styles[`tone-${tone}`],
    pulse ? styles.pulse : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'}>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      {onDismiss && (
        <IconButton
          icon="close"
          aria-label="Fechar banner"
          variant="ghost"
          size="sm"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
