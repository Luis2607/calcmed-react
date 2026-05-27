import { BottomSheet } from '../BottomSheet';

/**
 * Pattern: ToolSheet.
 * Uso: calculadora, dose, ferramenta clinica, texto p/ prontuario.
 * Footer flexivel via primaryAction { label, onClick, variant?, loading?, disabled?, closeOnClick? }
 * e secondaryAction { label, onClick }. Sem primaryAction => "Fechar".
 */
export function ToolSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'info',
  maxHeight = 'tall',
  primaryAction,
  secondaryAction,
  children,
}) {
  const primary = primaryAction
    ? {
        label: primaryAction.label,
        onClick: () => {
          primaryAction.onClick?.();
          if (primaryAction.closeOnClick !== false) onClose?.();
        },
        variant: primaryAction.variant,
        loading: primaryAction.loading,
        disabled: primaryAction.disabled,
      }
    : { label: 'Fechar', onClick: onClose };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      leadingIcon={leadingIcon}
      tone={tone}
      maxHeight={maxHeight}
      footer={{
        secondary: secondaryAction ? { label: secondaryAction.label, onClick: secondaryAction.onClick } : undefined,
        primary,
      }}
    >
      {children}
    </BottomSheet>
  );
}
