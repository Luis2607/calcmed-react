import { FormSheet } from './FormSheet';
import { InputField } from '../../molecules/InputField';
import { Segmented } from '../../molecules/Segmented';
import { SheetSection } from '../../molecules/sheet/SheetSection';
import { SheetTextarea } from '../../molecules/sheet/SheetTextarea';
import { SheetDetailRow } from '../../molecules/sheet/SheetDetailRow';
import styles from './SavePatientSheet.module.css';

const SEXO_OPCOES = [
  { value: 'masc', label: 'Masculino' },
  { value: 'fem', label: 'Feminino' },
];

/**
 * Pattern: SavePatientSheet — bottomsheet PADRÃO de salvar paciente (todos os protocolos).
 * Só campos que precisam de input; o desfecho é read-only (derivado pelo protocolo).
 * Campos vêm pré-preenchidos quando já foram coletados antes (triagem).
 * O flow controla o estado e a gravação (onSave). "Finalizar sem salvar" é o botão
 * Finalizar do flow (que abre/dispensa este sheet), não vive aqui.
 */
export function SavePatientSheet({
  open,
  onClose,
  iniciais = '',
  onIniciais,
  idade = '',
  onIdade,
  peso = '',
  onPeso,
  sexo,
  onSexo,
  observacoes = '',
  onObservacoes,
  desfecho,
  onSave,
  onDiscard,
  discardLabel = 'Finalizar sem salvar',
  title = 'Salvar paciente',
  description = 'Confirme os dados para arquivar o caso neste aparelho. Apoio à memória · não substitui prontuário.',
  saveLabel = 'Salvar paciente',
}) {
  const canSave = (iniciais || '').trim().length > 0;
  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      saveLabel={saveLabel}
      cancelLabel={discardLabel}
      onCancel={onDiscard}
      canSave={canSave}
      onSave={onSave}
    >
      <div className={styles.group}>
        <InputField label="Iniciais" tagText="obrigatório" value={iniciais} onChange={onIniciais} placeholder="Ex.: J.S.M." maxLength={10} />
        <div className={styles.row2}>
          <InputField label="Idade" type="number" mono value={idade} onChange={onIdade} placeholder="—" unit="anos" showUnit />
          <InputField label="Peso" type="number" mono value={peso} onChange={onPeso} placeholder="—" unit="kg" showUnit />
        </div>
        {onSexo && <Segmented label="Sexo" block options={SEXO_OPCOES} value={sexo} onChange={onSexo} />}
        {desfecho != null && (
          <SheetSection boxed>
            <SheetDetailRow label="Desfecho" value={desfecho} />
          </SheetSection>
        )}
        <SheetTextarea label="Observações" value={observacoes} onChange={onObservacoes} placeholder="Anotações do caso (opcional)" rows={3} />
      </div>
    </FormSheet>
  );
}
