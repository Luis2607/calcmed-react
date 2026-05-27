import { useEffect, useId, useRef, useState } from 'react';
import { SheetHeader } from '../../molecules/sheet/SheetHeader';
import { SheetBody } from '../../molecules/sheet/SheetBody';
import { SheetFooter } from '../../molecules/sheet/SheetFooter';
import styles from './BottomSheet.module.css';

/**
 * Organism: BottomSheet.
 *
 * Controla shell, backdrop, motion, ESC, focus return, maxHeight.
 * Header/Body/Footer sao moleculas Sheet.* — patterns escolhem conteudo,
 * nunca reinventam estrutura.
 *
 * Anatomia:
 *   <Backdrop>
 *     <Sheet>
 *       <SheetHeader />     (handle decorativo + title + close)
 *       <SheetBody />       (rolavel · children)
 *       <SheetFooter />     (fixo · opcional via prop `footer`)
 *     </Sheet>
 *   </Backdrop>
 */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'neutral',
  closeLabel = 'Fechar',
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  showHandle = true,
  footer,
  maxHeight = 'auto',
  children,
}) {
  const sheetRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useId();

  // wasOpen rastreia se passou por um ciclo aberto — mantem montado durante o exit
  const [wasOpen, setWasOpen] = useState(false);

  // Set durante render (guarded) — padrao oficial React p/ derivar estado de prop
  if (open && !wasOpen) {
    setWasOpen(true);
  }

  // Captura trigger para devolver foco — fora do render, em effect
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    }
  }, [open]);

  // Foco inicial no sheet + retorno ao trigger ao fechar
  useEffect(() => {
    if (!open) return undefined;
    const sheet = sheetRef.current;
    if (sheet) {
      const t = setTimeout(() => sheet.focus({ preventScroll: true }), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (open) return undefined;
    return () => {
      const trigger = triggerRef.current;
      if (trigger && typeof trigger.focus === 'function') {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // ESC fecha
  useEffect(() => {
    if (!open || !closeOnEsc) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onClose]);

  // Scroll lock — trava o scroller do viewport (.scroll-container) enquanto aberto
  useEffect(() => {
    if (!open) return undefined;
    const scroller = document.querySelector('.scroll-container') || document.body;
    const previous = scroller.style.overflow;
    scroller.style.overflow = 'hidden';
    return () => {
      scroller.style.overflow = previous;
    };
  }, [open]);

  // Focus trap — Tab/Shift+Tab ciclam dentro do dialog, nunca escapam pro fundo
  useEffect(() => {
    if (!open) return undefined;
    const sheet = sheetRef.current;
    if (!sheet) return undefined;
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = sheet.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) {
        e.preventDefault();
        sheet.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || active === sheet || !sheet.contains(active)) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last || !sheet.contains(active)) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    sheet.addEventListener('keydown', onKeyDown);
    return () => sheet.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Fallback de unmount — garante desmontagem mesmo sem transitionend
  // (prefers-reduced-motion zera a transition; aba throttled pode não disparar)
  useEffect(() => {
    if (open || !wasOpen) return undefined;
    const t = setTimeout(() => setWasOpen(false), 360);
    return () => clearTimeout(t);
  }, [open, wasOpen]);

  const shouldRender = open || wasOpen;
  if (!shouldRender) return null;

  const heightClass =
    maxHeight === 'tall' ? styles.sheetTall :
    maxHeight === 'full' ? styles.sheetFull :
    styles.sheetAuto;

  const handleTransitionEnd = (e) => {
    if (e.propertyName === 'transform' && !open) {
      setWasOpen(false);
    }
  };

  return (
    <div
      className={[styles.backdrop, open ? styles.backdropOpen : ''].filter(Boolean).join(' ')}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) onClose?.();
      }}
      aria-hidden={!open}
    >
      <div
        ref={sheetRef}
        className={[styles.sheet, heightClass, open ? styles.sheetOpen : ''].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
      >
        <SheetHeader
          title={title}
          titleId={titleId}
          description={description}
          leadingIcon={leadingIcon}
          tone={tone}
          showHandle={showHandle}
          onClose={showCloseButton ? onClose : undefined}
          closeLabel={closeLabel}
        />
        <SheetBody>{children}</SheetBody>
        <SheetFooter footer={footer} />
      </div>
    </div>
  );
}
