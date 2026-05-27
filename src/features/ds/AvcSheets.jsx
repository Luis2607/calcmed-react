import { useState } from 'react';
import { InfoSheet, ConfirmSheet, DetailSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { Button } from '../../shared/components/atoms/Button';
import { SheetText, SheetList, SheetSection, SheetDetailRow } from '../../shared/components/molecules/sheet';
import styles from './SheetGallery.module.css';

const SHEETS = [
  ['contra', 'Contraindicações à trombólise', 'InfoSheet'],
  ['bypass', 'Confirmar bypass', 'ConfirmSheet'],
  ['anotacao', 'Anotação', 'AnnotationSheet'],
  ['historico', 'Caso do histórico', 'DetailSheet'],
];

export function AvcSheets() {
  const [openKey, setOpenKey] = useState(null);
  const [nota, setNota] = useState('');
  const close = () => setOpenKey(null);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>AVC</span>
        <span className={styles.subtitle}>4 sheets reproduzidos do golden no padrão novo.</span>
      </div>

      <div className={styles.grid}>
        {SHEETS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={`avc-${key}`} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <InfoSheet
        open={openKey === 'contra'}
        onClose={close}
        title="Contraindicações à trombólise"
        description="Absolutas · revisar antes do trombolítico"
        tone="critical"
        leadingIcon="!"
      >
        <SheetList
          items={[
            'Hemorragia intracraniana prévia',
            'AVC isquêmico ou TCE grave < 3 meses',
            'Neoplasia ou malformação vascular do SNC',
            'Sangramento ativo / diátese hemorrágica',
            'PA > 185/110 mmHg refratária',
            'Plaquetas < 100.000 ou INR > 1,7',
          ]}
        />
        <SheetText variant="auxiliary">Referência: AHA/ASA 2019 · protocolo institucional.</SheetText>
      </InfoSheet>

      <ConfirmSheet
        open={openKey === 'bypass'}
        onClose={close}
        title="Confirmar bypass?"
        description="Pular esta etapa pode omitir uma checagem de segurança."
        confirmLabel="Confirmar bypass"
        cancelLabel="Voltar"
        onConfirm={() => {}}
      />

      <AnnotationSheet
        open={openKey === 'anotacao'}
        onClose={close}
        value={nota}
        onChange={setNota}
        onSave={() => {}}
      />

      <DetailSheet open={openKey === 'historico'} onClose={close} title="R.K.L." description="Caso encerrado · AVC">
        <SheetSection title="Caso">
          <SheetDetailRow label="NIHSS" value="12" />
          <SheetDetailRow label="Janela" value="2h40" />
          <SheetDetailRow label="Conduta" value="Trombólise (TNK)" />
          <SheetDetailRow label="Porta-agulha" value="38 min" />
        </SheetSection>
      </DetailSheet>
    </section>
  );
}
