import { BottomSheet } from '../BottomSheet';

/**
 * Pattern: ConfirmSheet.
 * Uso: sair do protocolo, encerrar PCR, limpar anotacao, resetar caso.
 *
 * destructive=true:
 *  - tone "critical"
 *  - botao primario variant "danger"
 *  - closeOnBackdrop=false (forca decisao explicita)
 */
export function ConfirmSheet({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  destructive = false,
  loading = false,
  children,
}) {
  const handleConfirm = () => {
    onConfirm?.();
    if (!loading) onClose?.();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      tone={destructive ? 'critical' : 'neutral'}
      closeOnBackdrop={!destructive}
      footer={{
        secondary: { label: cancelLabel, onClick: onClose, disabled: loading },
        primary: {
          label: confirmLabel,
          onClick: handleConfirm,
          variant: destructive ? 'danger' : 'primary',
          loading,
        },
      }}
    >
      {children}
    </BottomSheet>
  );
}
