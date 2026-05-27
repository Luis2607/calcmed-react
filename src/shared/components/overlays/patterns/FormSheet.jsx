import { BottomSheet } from '../BottomSheet';

/**
 * Pattern: FormSheet.
 * Uso: anotacao, dados complementares, comentario, pequenos formularios.
 * Footer: Salvar (obrigatorio) + Cancelar. canSave controla disabled do primario.
 */
export function FormSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'neutral',
  saveLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  onSave,
  onCancel,
  canSave = true,
  loading = false,
  children,
}) {
  const handleSave = () => {
    onSave?.();
    if (!loading) onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
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
        secondary: { label: cancelLabel, onClick: handleCancel, disabled: loading },
        primary: { label: saveLabel, onClick: handleSave, disabled: !canSave, loading },
      }}
    >
      {children}
    </BottomSheet>
  );
}
