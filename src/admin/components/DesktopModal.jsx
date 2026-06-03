import { useEffect, useId, useRef } from 'react';
import { Icon } from '../../shared/components/atoms/Icon';
import styles from './DesktopModal.module.css';

/**
 * Modal desktop centrado (o BottomSheet do DS é ancorado embaixo, mobile).
 * Backdrop + ESC + scroll-lock + foco inicial no painel. footer = ReactNode (botões).
 * size: 'md' (formulários curtos/confirm) | 'wide' (editor 2 painéis).
 */
export function DesktopModal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  closeOnBackdrop = true,
  children,
}) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    triggerRef.current = document.activeElement; // p/ devolver o foco ao fechar
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      // Focus-trap: Tab/Shift+Tab circulam só dentro do modal.
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const f = panel.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (f.length === 0) {
          e.preventDefault();
          panel.focus({ preventScroll: true });
          return;
        }
        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || active === panel || !panel.contains(active)) {
            e.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else if (active === last || !panel.contains(active)) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 30);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === 'function') trigger.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        className={[styles.panel, styles[`size-${size}`]].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div className={styles.headText}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            <Icon name="fechar" size={20} />
          </button>
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}
