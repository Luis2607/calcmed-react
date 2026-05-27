import { useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { InputField } from '../../shared/components/molecules/InputField';
import { ActionSheet, FormSheet, InfoSheet, DetailSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { SheetText, SheetList, SheetSection, SheetDetailRow } from '../../shared/components/molecules/sheet';
import styles from './SheetGallery.module.css';

const EVENTOS = [
  {
    title: 'MEDICAÇÃO',
    items: [
      { id: 'adre', label: 'Adrenalina', description: '1 mg IV · a cada 3–5 min' },
      { id: 'amio', label: 'Amiodarona', description: '300 mg IV · FV/TV refratária' },
      { id: 'bic', label: 'Bicarbonato de Sódio', description: '1 mEq/kg IV · hipercalemia/acidose' },
      { id: 'mg', label: 'Sulfato de Magnésio', description: '1–2 g IV · Torsades' },
    ],
  },
  {
    title: 'PROCEDIMENTO',
    items: [{ id: 'iot', label: 'Intubação Orotraqueal', description: 'Confirmar com ETCO₂' }],
  },
  {
    title: 'RITMOS ATÍPICOS',
    items: [
      { id: 'idio', label: 'Idioventricular Acelerado', description: 'Comum em RCE · não tratar isoladamente' },
      { id: 'tdp', label: 'Torsades de Pointes', description: 'Mg 1–2 g IV · corrigir QT' },
    ],
  },
];

const SHEETS = [
  ['evento', 'Adicionar evento', 'ActionSheet'],
  ['outro', 'Outro evento', 'FormSheet'],
  ['ritmos', 'Ritmos de PCR', 'InfoSheet'],
  ['anotacao', 'Anotação', 'AnnotationSheet'],
  ['historico', 'Caso do histórico', 'DetailSheet'],
];

export function PcrSheets() {
  const [openKey, setOpenKey] = useState(null);
  const [nome, setNome] = useState('');
  const [dose, setDose] = useState('');
  const [nota, setNota] = useState('');
  const close = () => setOpenKey(null);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>PCR · Parada Cardiorrespiratória</span>
        <span className={styles.subtitle}>5 sheets reproduzidos do golden no padrão novo.</span>
      </div>

      <div className={styles.grid}>
        {SHEETS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={`pcr-${key}`} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <ActionSheet
        open={openKey === 'evento'}
        onClose={close}
        title="Adicionar evento"
        sections={EVENTOS}
        onSelect={() => {}}
        extra={{ label: 'Outro · não listado', onSelect: () => setOpenKey('outro') }}
      />

      <FormSheet
        open={openKey === 'outro'}
        onClose={close}
        title="Outro evento"
        description="Vira um card no Adicionar evento até o fim do caso · pode aplicar de novo sem digitar"
        saveLabel="Adicionar"
        onSave={() => {}}
        canSave={nome.trim().length > 0}
      >
        <InputField label="Nome" value={nome} onChange={setNome} placeholder="Ex.: Vasopressina · Cardioversão · Marca-passo" />
        <InputField label="Dose · detalhe (opcional)" value={dose} onChange={setDose} placeholder="Ex.: 40 U IV · 100 J sincronizado" />
      </FormSheet>

      <InfoSheet open={openKey === 'ritmos'} onClose={close} title="Ritmos de PCR" description="Chocável × não-chocável" leadingIcon="i">
        <SheetText>
          Define a conduta imediata: <strong>chocável</strong> → desfibrilar; <strong>não-chocável</strong> → RCP + adrenalina.
        </SheetText>
        <SheetSection title="Chocáveis">
          <SheetList items={['Fibrilação ventricular (FV)', 'Taquicardia ventricular sem pulso (TVSP)']} />
        </SheetSection>
        <SheetSection title="Não-chocáveis">
          <SheetList items={['Atividade elétrica sem pulso (AESP)', 'Assistolia']} />
        </SheetSection>
      </InfoSheet>

      <AnnotationSheet
        open={openKey === 'anotacao'}
        onClose={close}
        value={nota}
        onChange={setNota}
        onSave={() => {}}
      />

      <DetailSheet open={openKey === 'historico'} onClose={close} title="A.B.C." description="Caso encerrado · PCR">
        <SheetSection title="Caso">
          <SheetDetailRow label="Ritmo inicial" value="FV" />
          <SheetDetailRow label="Choques" value="3" />
          <SheetDetailRow label="Adrenalina" value="4 doses" />
          <SheetDetailRow label="Desfecho" value="RCE" />
        </SheetSection>
      </DetailSheet>
    </section>
  );
}
