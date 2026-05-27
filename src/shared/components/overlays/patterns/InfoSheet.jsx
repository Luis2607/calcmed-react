import { BottomSheet } from '../BottomSheet';

/**
 * Pattern: InfoSheet.
 * Uso: teoria, explicacao de score, referencia clinica, microcopy.
 * Footer obrigatorio com 1 acao (default: "Entendi") que tambem fecha.
 */
export function InfoSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'info',
  acknowledgeLabel = 'Entendi',
  onAcknowledge,
  children,
}) {
  const handleAck = () => {
    onAcknowledge?.();
    onClose?.();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      leadingIcon={leadingIcon}
      tone={tone}
      footer={{
        primary: { label: acknowledgeLabel, onClick: handleAck },
      }}
    >
      {children}
    </BottomSheet>
  );
}
