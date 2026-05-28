import { useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { SelectSheet, InfoSheet, ConfirmSheet, DetailSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { SheetText, SheetList, SheetAlert, SheetSection, SheetDetailRow } from '../../shared/components/molecules/sheet';
import styles from './SheetGallery.module.css';

const K_OPCOES = [
  { value: 'baixo', label: '< 3,5 mEq/L', description: 'NÃO INICIE INSULINA · repor KCl primeiro' },
  { value: 'normal', label: '3,5 – 5,5 mEq/L', description: 'Faixa segura · liberado para insulina' },
  { value: 'alto', label: '> 5,5 mEq/L', description: 'Iniciar insulina e monitorar K seriado' },
];

const SHEETS = [
  ['k', 'Faixa de Potássio (K)', 'SelectSheet'],
  ['gate', 'Por que o K bloqueia a insulina?', 'InfoSheet'],
  ['reav', 'Reavaliação horária', 'InfoSheet'],
  ['insulina', 'Como ajustar a insulina', 'InfoSheet'],
  ['anotacao', 'Anotação', 'AnnotationSheet'],
  ['resetar', 'Resetar caso', 'ConfirmSheet'],
  ['historico', 'Caso do histórico', 'DetailSheet'],
  ['sair', 'Sair do protocolo', 'ConfirmSheet'],
];

export function CadSheets() {
  const [openKey, setOpenKey] = useState(null);
  const [k, setK] = useState('normal');
  const [nota, setNota] = useState('');
  const close = () => setOpenKey(null);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>CAD · Cetoacidose Diabética</span>
        <span className={styles.subtitle}>8 sheets · os 3 do fluxo React + os do golden. Padrão novo.</span>
      </div>

      <div className={styles.grid}>
        {SHEETS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={`cad-${key}`} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <SelectSheet
        open={openKey === 'k'}
        onClose={close}
        title="Potássio Sérico (K)"
        description="Selecione a faixa do K para liberar (ou bloquear) a insulina."
        options={K_OPCOES}
        value={k}
        onChange={setK}
        name="Faixa de K"
      />

      <InfoSheet open={openKey === 'gate'} onClose={close} title="Por que o K bloqueia a insulina?" description="Gate de segurança CAD · prevenção de arritmia" tone="info">
        <SheetText>
          A insulina <strong>desloca o potássio</strong> do extracelular para o intracelular. Com K &lt; 3,5 mEq/L, isso pode causar <strong>hipocalemia grave</strong> e arritmias fatais.
        </SheetText>
        <SheetAlert tone="critical" title="NÃO INICIE INSULINA se K < 3,5">
          Reponha KCl 20–40 mEq/L primeiro e só então libere a bomba.
        </SheetAlert>
      </InfoSheet>

      <InfoSheet open={openKey === 'reav'} onClose={close} title="Reavaliação horária" description="Controle do tratamento">
        <SheetText>Ao zerar o cronômetro de reavaliação:</SheetText>
        <SheetList
          items={[
            'Colher novo HGT (glicemia capilar)',
            'Colher gasometria (pH, HCO₃, ânion gap)',
            'Reavaliar K e ajustar reposição',
            'Registrar no log de atendimento',
          ]}
        />
      </InfoSheet>

      <InfoSheet open={openKey === 'insulina'} onClose={close} title="Como ajustar a insulina" description="Alvo de queda da glicemia">
        <SheetList
          items={[
            'Meta: queda de 50–75 mg/dL por hora',
            'Queda < 50/h → aumentar a vazão',
            'Queda muito rápida → reduzir a vazão',
            'Ao atingir HGT < 200 → manter 200–250 até resolver a acidose',
          ]}
        />
      </InfoSheet>

      <AnnotationSheet
        open={openKey === 'anotacao'}
        onClose={close}
        value={nota}
        onChange={setNota}
        onSave={() => {}}
      />

      <ConfirmSheet
        open={openKey === 'resetar'}
        onClose={close}
        title="Resetar caso?"
        description="Isso apaga todos os dados deste atendimento."
        confirmLabel="Resetar"
        destructive
        onConfirm={() => {}}
      />

      <DetailSheet open={openKey === 'historico'} onClose={close} title="T.A.M." description="Caso encerrado · CAD">
        <SheetSection title="Atendimento">
          <SheetDetailRow label="Modo" value="Adulto" />
          <SheetDetailRow label="Medidas" value="6 lançadas" />
          <SheetDetailRow label="Duração" value="47 min" />
          <SheetDetailRow label="Status" value="Alta" />
        </SheetSection>
      </DetailSheet>

      <ConfirmSheet
        open={openKey === 'sair'}
        onClose={close}
        title="Sair do protocolo?"
        description="O CalcMed mantém o protocolo aberto. Você retoma de onde parou pelo hub."
        confirmLabel="Sair (mantém aberto)"
        cancelLabel="Continuar aqui"
        onConfirm={() => {}}
      />
    </section>
  );
}
