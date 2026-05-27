import { useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { InfoSheet, ConfirmSheet, DetailSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { SheetText, SheetList, SheetSection, SheetDetailRow } from '../../shared/components/molecules/sheet';
import styles from './SheetGallery.module.css';

const SHEETS = [
  ['anotacao', 'Anotação', 'AnnotationSheet'],
  ['bundle', 'Bundle da 1ª hora', 'InfoSheet'],
  ['metas', 'Metas de ressuscitação', 'InfoSheet'],
  ['encerrar', 'Encerrar protocolo', 'ConfirmSheet'],
  ['historico', 'Caso do histórico', 'DetailSheet'],
];

export function SepseSheets() {
  const [openKey, setOpenKey] = useState(null);
  const [nota, setNota] = useState('');
  const close = () => setOpenKey(null);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Sepse</span>
        <span className={styles.subtitle}>5 sheets reproduzidos do golden no padrão novo.</span>
      </div>

      <div className={styles.grid}>
        {SHEETS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={`sepse-${key}`} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <AnnotationSheet
        open={openKey === 'anotacao'}
        onClose={close}
        value={nota}
        onChange={setNota}
        onSave={() => {}}
      />

      <InfoSheet open={openKey === 'bundle'} onClose={close} title="Bundle da 1ª hora" description="Surviving Sepsis Campaign" tone="warning" leadingIcon="!">
        <SheetText>Iniciar <strong>na primeira hora</strong> do reconhecimento de sepse/choque séptico.</SheetText>
        <SheetList
          items={[
            'Lactato sérico (repetir se > 2 mmol/L)',
            'Hemoculturas antes do antibiótico',
            'Antibiótico de amplo espectro',
            'Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 4',
            'Vasopressor se PAM < 65 após volume',
          ]}
        />
      </InfoSheet>

      <InfoSheet open={openKey === 'metas'} onClose={close} title="Metas de ressuscitação" description="Após o bundle inicial" leadingIcon="i">
        <SheetList
          items={[
            'PAM ≥ 65 mmHg',
            'Lactato em queda / normalizando',
            'Diurese ≥ 0,5 mL/kg/h',
            'Glicemia 140 a 180 mg/dL',
            'SpO₂ ≥ 94% (evite hiperóxia)',
          ]}
        />
      </InfoSheet>

      <ConfirmSheet
        open={openKey === 'encerrar'}
        onClose={close}
        title="Encerrar protocolo?"
        description="O caso fica salvo no histórico deste aparelho."
        confirmLabel="Encerrar"
        cancelLabel="Continuar"
        onConfirm={() => {}}
      />

      <DetailSheet open={openKey === 'historico'} onClose={close} title="M.R.S." description="Caso encerrado · Sepse">
        <SheetSection title="Caso">
          <SheetDetailRow label="Foco" value="Pulmonar" />
          <SheetDetailRow label="Classificação" value="Choque séptico" />
          <SheetDetailRow label="Porta-ATB" value="42 min" />
        </SheetSection>
        <SheetSection title="Linha do tempo">
          <SheetList
            items={[
              'T+0 · Protocolo aberto',
              'T+0h12 · Lactato + hemocultura',
              'T+0h42 · ATB administrado',
              'Encerrado · alta para UTI',
            ]}
          />
        </SheetSection>
      </DetailSheet>
    </section>
  );
}
