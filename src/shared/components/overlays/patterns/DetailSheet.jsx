import { BottomSheet } from '../BottomSheet';

/**
 * Pattern: DetailSheet.
 * Uso: detalhe read-only (ex: caso do historico). Conteudo via children
 * (SheetSection + SheetDetailRow). Footer opcional (default: Fechar primario).
 */
export function DetailSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'neutral',
  closeLabel = 'Fechar',
  footer,
  children,
  maxHeight = 'tall',
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      leadingIcon={leadingIcon}
      tone={tone}
      maxHeight={maxHeight}
      footer={footer ?? { primary: { label: closeLabel, onClick: onClose } }}
    >
      {children}
    </BottomSheet>
  );
}
