import styles from './Toast.module.css';

/**
 * Molecule: Toast / Snackbar (DS base · Figma Alert Compact 131:4093).
 * Figma: Type=Success/Error · Show dismiss · ícone (sucesso/atencao) · 1 linha Mensagem.
 * EXTENSÃO de código (não existe no Figma): ação `Desfazer` (onUndo) — logada como
 * pendência em docs/ds-issues-figma.md.
 *
 * Props:
 *  - type: 'success' | 'error'
 *  - message: string (texto da mensagem)
 *  - onUndo?: () => void  -> renderiza botão "Desfazer"
 *  - onDismiss?: () => void -> renderiza X (Figma "Show dismiss")
 *  - undoLabel?: string (default "Desfazer")
 */
const GLYPH = {
  // Figma Alert Compact: Success=icone/sucesso (círculo+check) · Error=icone/atencao (TRIÂNGULO)
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 9 11 14 8 11" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

export const Toast = ({ type = 'success', message, onUndo, onDismiss, undoLabel = 'Desfazer' }) => (
  <div className={[styles.toast, styles[type]].filter(Boolean).join(' ')} role="status" aria-live="polite">
    <span className={styles.icon} aria-hidden="true">{GLYPH[type] || GLYPH.success}</span>
    <span className={styles.message}>{message}</span>
    {onUndo && (
      <button type="button" className={styles.undo} onClick={onUndo}>{undoLabel}</button>
    )}
    {onDismiss && (
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);
