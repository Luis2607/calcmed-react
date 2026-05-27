import { useState } from 'react';
import { BottomSheet } from '../BottomSheet';
import { SheetOptionList } from '../../molecules/sheet/SheetOptionList';

/**
 * Pattern: SelectSheet.
 * Uso: substituto de select nativo (queixa, reperfusao, foco, ritmo, faixa de K).
 *
 * Comportamento:
 *  - mode="immediate": clicar a opcao aplica e fecha (sem footer).
 *  - mode="confirm": precisa apertar Aplicar (footer com Cancelar + Aplicar).
 *
 * O draft (modo confirm) e re-semeado toda vez que o sheet abre, para que
 * mudar `value` por fora entre aberturas nao deixe o draft preso no antigo.
 */
export function SelectSheet({
  open,
  onClose,
  title,
  description,
  options,
  value,
  onChange,
  mode = 'immediate',
  applyLabel = 'Aplicar',
  cancelLabel = 'Cancelar',
  name,
}) {
  const [draft, setDraft] = useState(value);
  const [openSnapshot, setOpenSnapshot] = useState(false);

  // Re-semeia draft a cada transicao closed -> open (padrao oficial React p/ derivar de prop)
  if (open !== openSnapshot) {
    setOpenSnapshot(open);
    if (open) setDraft(value);
  }

  const handleImmediate = (next) => {
    onChange?.(next);
    onClose?.();
  };

  const handleConfirm = () => {
    onChange?.(draft);
    onClose?.();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        mode === 'confirm'
          ? {
              secondary: { label: cancelLabel, onClick: onClose },
              primary: { label: applyLabel, onClick: handleConfirm, disabled: draft === undefined || draft === '' },
            }
          : null
      }
    >
      <SheetOptionList
        options={options}
        value={mode === 'confirm' ? draft : value}
        onChange={mode === 'confirm' ? setDraft : handleImmediate}
        name={name || title}
      />
    </BottomSheet>
  );
}
