import { BottomSheet } from '../BottomSheet';
import { SheetChecklistItem } from '../../molecules/sheet/SheetChecklistItem';

/**
 * Pattern: ChecklistSheet.
 * Uso: criterios RCE, edema cerebral, contraindicacoes.
 * items: [{ id, label, description?, disabled? }]
 * value: array de ids marcados; onChange(nextIds[]) atualiza ao vivo.
 * Footer: Aplicar (default) + Cancelar opcional; onApply(ids) ao confirmar.
 */
export function ChecklistSheet({
  open,
  onClose,
  title,
  description,
  leadingIcon,
  tone = 'neutral',
  items = [],
  value = [],
  onChange,
  applyLabel = 'Aplicar',
  onApply,
  cancelLabel,
  maxHeight = 'tall',
}) {
  const checked = new Set(value);
  const getItemId = (item) => item.id ?? item.value ?? item.label;

  const toggle = (id, next) => {
    const nextSet = new Set(checked);
    if (next) nextSet.add(id);
    else nextSet.delete(id);
    onChange?.([...nextSet]);
  };

  const handleApply = () => {
    onApply?.([...checked]);
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
      maxHeight={maxHeight}
      footer={{
        secondary: cancelLabel ? { label: cancelLabel, onClick: onClose } : undefined,
        primary: { label: applyLabel, onClick: handleApply },
      }}
    >
      {items.map((item) => {
        const itemId = getItemId(item);
        return (
          <SheetChecklistItem
            key={String(itemId)}
            label={item.label}
            description={item.description}
            disabled={item.disabled}
            checked={checked.has(itemId)}
            onToggle={(next) => toggle(itemId, next)}
          />
        );
      })}
    </BottomSheet>
  );
}
