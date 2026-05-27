import { FormSheet } from './FormSheet';
import { SheetTextarea } from '../../molecules/sheet/SheetTextarea';

/**
 * Pattern: AnnotationSheet.
 * Uso: anotacao livre de caso em qualquer protocolo.
 *
 * Mantem o mesmo contrato visual/copy entre CAD, Sepse, PCR, AVC e SCA:
 * titulo, helper, label, placeholder, limite e CTA ficam padronizados.
 */
export function AnnotationSheet({
  open,
  onClose,
  value,
  onChange,
  onSave,
  maxLength = 500,
  canSave,
  loading = false,
}) {
  const hasContent = String(value ?? '').trim().length > 0;

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title="Anotação"
      description="Opcional · salva no histórico deste aparelho"
      saveLabel="Salvar"
      onSave={onSave}
      canSave={canSave ?? hasContent}
      loading={loading}
    >
      <SheetTextarea
        label="Observações"
        value={value}
        onChange={onChange}
        placeholder="Evolução, condutas, intercorrências..."
        maxLength={maxLength}
      />
    </FormSheet>
  );
}
