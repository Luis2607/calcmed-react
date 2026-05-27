import { useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { InfoSheet } from '../../shared/components/overlays/patterns/InfoSheet';
import { SelectSheet } from '../../shared/components/overlays/patterns/SelectSheet';
import { ConfirmSheet } from '../../shared/components/overlays/patterns/ConfirmSheet';
import { FormSheet } from '../../shared/components/overlays/patterns/FormSheet';
import { ToolSheet } from '../../shared/components/overlays/patterns/ToolSheet';
import { ActionSheet } from '../../shared/components/overlays/patterns/ActionSheet';
import { ChecklistSheet } from '../../shared/components/overlays/patterns/ChecklistSheet';
import { DetailSheet } from '../../shared/components/overlays/patterns/DetailSheet';
import { SheetAlert } from '../../shared/components/molecules/sheet/SheetAlert';
import { SheetTextarea } from '../../shared/components/molecules/sheet/SheetTextarea';
import { SheetCalculationBlock } from '../../shared/components/molecules/sheet/SheetCalculationBlock';
import { SheetMedia } from '../../shared/components/molecules/sheet/SheetMedia';
import { SheetText } from '../../shared/components/molecules/sheet/SheetText';
import { SheetList } from '../../shared/components/molecules/sheet/SheetList';
import { SheetSection } from '../../shared/components/molecules/sheet/SheetSection';
import { SheetDetailRow } from '../../shared/components/molecules/sheet/SheetDetailRow';
import { ChromeShowcase } from './ChromeShowcase';
import { CadSheets } from './CadSheets';
import { ScaSheets } from './ScaSheets';
import { SepseSheets } from './SepseSheets';
import { PcrSheets } from './PcrSheets';
import { AvcSheets } from './AvcSheets';
import styles from './SheetGallery.module.css';

const ECG_DEMO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 64'%3E%3Cpath d='M0 32 H70 l6 -20 6 36 6 -16 H240' fill='none' stroke='%23007993' stroke-width='2.5'/%3E%3C/svg%3E";

const QUEIXAS = [
  { value: 'dor', label: 'Dor torácica', description: 'Típica ou equivalente anginoso' },
  { value: 'dispneia', label: 'Dispneia', description: 'Possível equivalente anginoso' },
  { value: 'sincope', label: 'Síncope', description: 'Investigar causa cardíaca' },
];

const RCE = [
  { id: 'pulso', label: 'Pulso central palpável' },
  { id: 'etco2', label: 'ETCO2 >= 40 ou subida abrupta', description: 'Capnografia contínua' },
  { id: 'pa', label: 'PA mensurável' },
  { id: 'consc', label: 'Despertar / movimento espontâneo' },
];

const EVENTOS = [
  { title: 'MEDICAÇÃO', items: [{ id: 'bic', label: 'Bicarbonato de Sódio', description: '1 mEq/kg IV · hipercalemia/acidose' }] },
  { title: 'PROCEDIMENTO', items: [{ id: 'iot', label: 'Intubação Orotraqueal', description: 'Confirmar com ETCO2' }] },
  {
    title: 'RITMOS ATÍPICOS',
    items: [
      { id: 'idio', label: 'Idioventricular Acelerado', description: 'Comum em RCE · não tratar isoladamente' },
      { id: 'tdp', label: 'Torsades de Pointes', description: 'Mg 1-2 g IV · corrigir QT' },
    ],
  },
];

const PATTERNS = [
  ['info', 'InfoSheet', 'Teoria / explicação (footer Entendi)'],
  ['select', 'SelectSheet', 'Substituto de select (seleção imediata)'],
  ['confirm', 'ConfirmSheet', 'Decisão de risco (destructive)'],
  ['form', 'FormSheet', 'Anotação / formulário (textarea + Salvar)'],
  ['tool', 'ToolSheet', 'Calculadora / dose / mídia clínica'],
  ['action', 'ActionSheet', 'Lista de ações por seção (Adicionar evento)'],
  ['checklist', 'ChecklistSheet', 'Critérios marcáveis (RCE)'],
  ['detail', 'DetailSheet', 'Detalhe read-only (caso do histórico)'],
];

export function SheetGallery() {
  const [openKey, setOpenKey] = useState(null);
  const [queixa, setQueixa] = useState('dor');
  const [nota, setNota] = useState('');
  const [rceChecked, setRceChecked] = useState(['pulso']);

  const close = () => setOpenKey(null);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.title}>BottomSheet · QA do sistema</span>
        <span className={styles.subtitle}>
          Toque pra abrir cada pattern. Todos usam o mesmo organismo (focus trap, scroll lock, ESC, close preenchido) e tokens do DS.
        </span>
      </header>

      <div className={styles.grid}>
        {PATTERNS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={key} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <ChromeShowcase />
      <CadSheets />
      <ScaSheets />
      <SepseSheets />
      <PcrSheets />
      <AvcSheets />

      <InfoSheet
        open={openKey === 'info'}
        onClose={close}
        title="Por que o K bloqueia a insulina?"
        description="Gate de segurança do CAD"
        leadingIcon="!"
      >
        <SheetText>
          A insulina empurra <strong>potássio pra dentro da célula</strong>. Com K sérico baixo, isso pode precipitar arritmia grave.
        </SheetText>
        <SheetSection title="Quando o gate dispara">
          <SheetList items={['K < 3,5 mEq/L confirmado', 'Antes de iniciar insulina IV', 'Reavaliar após reposição de KCl']} />
        </SheetSection>
        <SheetMedia src={ECG_DEMO} alt="ECG com onda U" caption="Onda T achatada + onda U sugerem hipocalemia" />
        <SheetAlert tone="critical" title="NÃO INICIE INSULINA se K < 3,5">
          Reponha KCl primeiro e só então libere a insulina.
        </SheetAlert>
        <SheetText variant="auxiliary">Referência: protocolo CAD · SBEM 2023.</SheetText>
      </InfoSheet>

      <SelectSheet
        open={openKey === 'select'}
        onClose={close}
        title="Queixa principal"
        description="Escolha o motivo dominante"
        options={QUEIXAS}
        value={queixa}
        onChange={setQueixa}
      />

      <ConfirmSheet
        open={openKey === 'confirm'}
        onClose={close}
        title="Resetar caso?"
        description="Isso apaga todos os dados deste atendimento."
        confirmLabel="Resetar"
        destructive
        onConfirm={() => {}}
      />

      <FormSheet
        open={openKey === 'form'}
        onClose={close}
        title="Anotação"
        description="Opcional · salva no histórico deste aparelho"
        onSave={() => {}}
        canSave={nota.trim().length > 0}
      >
        <SheetTextarea
          label="Observações"
          value={nota}
          onChange={setNota}
          placeholder="Evolução, condutas, intercorrências..."
          maxLength={500}
        />
      </FormSheet>

      <ToolSheet
        open={openKey === 'tool'}
        onClose={close}
        title="Calculadora Sgarbossa-Smith"
        description="BRE / ritmo de marcapasso com dor"
        primaryAction={{ label: 'Copiar resultado', closeOnClick: false }}
      >
        <SheetCalculationBlock label="Score" value="3" unit="pts" hint=">= 3 critérios = oclusão provável (OMI)" />
        <SheetMedia src={ECG_DEMO} alt="Traçado de ECG demonstrativo" caption="V3 · supradesnível discordante > 5 mm" />
      </ToolSheet>

      <ActionSheet
        open={openKey === 'action'}
        onClose={close}
        title="Adicionar evento"
        sections={EVENTOS}
        onSelect={() => {}}
        extra={{ label: 'Outro · não listado', onSelect: () => {} }}
      />

      <ChecklistSheet
        open={openKey === 'checklist'}
        onClose={close}
        title="Critérios de RCE"
        description="Marque os que estão presentes"
        items={RCE}
        value={rceChecked}
        onChange={setRceChecked}
        onApply={() => {}}
        cancelLabel="Cancelar"
      />

      <DetailSheet
        open={openKey === 'detail'}
        onClose={close}
        title="T.A.M."
        description="Caso encerrado · 26/05/2026"
      >
        <SheetSection title="Atendimento">
          <SheetDetailRow label="Iniciais" value="T.A.M." />
          <SheetDetailRow label="Duração" value="47 min" />
          <SheetDetailRow label="Status" value="Concluído" />
        </SheetSection>
        <SheetSection title="Desfecho">
          <SheetDetailRow label="Destino" value="UTI" />
          <SheetDetailRow label="Escore final" value="HEART 3" />
        </SheetSection>
      </DetailSheet>
    </div>
  );
}
