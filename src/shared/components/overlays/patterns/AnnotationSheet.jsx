import { BottomSheet } from '../BottomSheet';
import { SheetTextarea } from '../../molecules/sheet/SheetTextarea';

/**
 * Pattern: AnnotationSheet.
 * Uso: anotacao livre de caso em qualquer protocolo.
 *
 * Mantem o mesmo contrato visual/copy entre CAD, Sepse, PCR, AVC e SCA:
 * titulo, helper, label, placeholder, limite e CTA ficam padronizados.
 *
 * Bypassa o FormSheet para suportar "Limpar" (secundario que NAO fecha o sheet —
 * apenas zera o texto). Fecha por X ou Salvar. Aprovado por Luis (DS.1).
 *
 * Props:
 *  - open, onClose, value, onChange, onSave
 *  - onClear? (opcional) — quando passado, renderiza botao secundario "Limpar"
 *    que chama onClear (zera o texto) SEM fechar o sheet.
 *  - maxLength, canSave, loading
 */
export function AnnotationSheet({
  open,
  onClose,
  value,
  onChange,
  onSave,
  onClear,
  maxLength = 500,
  canSave,
  loading = false,
}) {
  const hasContent = String(value ?? '').trim().length > 0;
  const saveEnabled = canSave ?? hasContent;

  const handleSave = () => {
    onSave?.();
    if (!loading) onClose?.();
  };

  // Secundario = Limpar (NAO fecha · golden: limparAnotacao deixa o sheet aberto)
  const secondary = onClear
    ? { label: 'Limpar', onClick: () => onClear(), variant: 'fantasma', disabled: !hasContent || loading }
    : undefined;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Anotação"
      description="Opcional · salva no histórico deste aparelho"
      footer={{
        secondary,
        primary: { label: 'Salvar', onClick: handleSave, disabled: !saveEnabled || loading, loading },
      }}
    >
      <SheetTextarea
        label="Observações"
        value={value}
        onChange={onChange}
        placeholder="Evolução, condutas, intercorrências..."
        maxLength={maxLength}
      />
    </BottomSheet>
  );
}
