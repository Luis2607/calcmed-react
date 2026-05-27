import { useState } from 'react';
import { Button } from '../../shared/components/atoms/Button';
import { InputField } from '../../shared/components/molecules/InputField';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
import { InfoSheet, SelectSheet, ToolSheet, FormSheet, DetailSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import {
  SheetText,
  SheetList,
  SheetAlert,
  SheetTextarea,
  SheetCalculationBlock,
  SheetOptionList,
  SheetSection,
  SheetDetailRow,
} from '../../shared/components/molecules/sheet';
import styles from './SheetGallery.module.css';

// Reproduzido fielmente do golden (sca.js)
const QUEIXAS = [
  { value: 'tipica', label: 'Dor torácica anginosa', description: 'Aperto/peso, irradiação clássica · alta probabilidade isquêmica' },
  { value: 'atipica', label: 'Dor torácica não anginosa', description: 'Sem padrão clássico, mas suspeita clínica mantida' },
  { value: 'dispneia', label: 'Dispneia', description: 'Equivalente anginoso (idoso, DM, mulher)' },
  { value: 'sincope', label: 'Síncope', description: 'Perda de consciência transitória' },
  { value: 'epigastrica', label: 'Dor epigástrica', description: 'Idoso, DM ou DAC prévia · mascara como dispepsia' },
  { value: 'diaforese', label: 'Sudorese e náusea isoladas', description: 'Equivalentes sem dor torácica' },
  { value: 'outro', label: 'Outro', description: 'Detalhar em anotação' },
];

const REPERFUSAO = [
  { value: 'ppci-interno', label: 'Cathlab interno · disponível agora', description: 'ICP primária no próprio hospital · meta ≤ 90 min do PMC' },
  { value: 'transferencia', label: 'Transferência para hemodinâmica regional', description: 'ICP primária em outro serviço · meta ≤ 120 min · acionar transporte agora' },
  { value: 'fibrinolise', label: 'Fibrinólise local', description: 'Sem hemodinâmica disponível · fibrinolisar e transferir em seguida (sempre)' },
];

const P2Y12 = [
  { value: 'prasugrel', label: 'Prasugrel', description: '60mg ataque · 10mg/dia manutenção' },
  { value: 'ticagrelor', label: 'Ticagrelor', description: '180mg ataque · 90mg 2x/dia' },
  { value: 'clopidogrel', label: 'Clopidogrel', description: '300mg ataque · obrigatório com fibrinolítico' },
];

const SHEETS = [
  ['queixa', 'Queixa principal', 'SelectSheet · 7 opções'],
  ['sgarbossa', 'Calculadora Sgarbossa-Smith', 'ToolSheet · cálculo ao vivo'],
  ['reperfundir', 'Onde vai reperfundir?', 'SelectSheet · 3 opções'],
  ['p2y12', 'Qual P2Y12?', 'Composição · alerta + opções'],
  ['omi', 'Sinal de OMI', 'InfoSheet · referência'],
  ['historico', 'Caso do histórico', 'DetailSheet'],
  ['prontuario', 'Texto pra prontuário', 'ToolSheet · copiar'],
  ['termo', 'Termo · fibrinólise', 'InfoSheet · documento'],
  ['anotacao', 'Anotação', 'AnnotationSheet'],
  ['encerrar', 'Encerrar caso', 'FormSheet'],
];

export function ScaSheets() {
  const [openKey, setOpenKey] = useState(null);
  const [queixa, setQueixa] = useState('tipica');
  const [reperf, setReperf] = useState('ppci-interno');
  const [p2y12, setP2y12] = useState('prasugrel');
  const [st, setSt] = useState('');
  const [s, setS] = useState('');
  const [nota, setNota] = useState('');

  const close = () => setOpenKey(null);
  const num = (v) => Number(String(v).replace(',', '.'));
  const ratio = st !== '' && s !== '' && num(s) !== 0 ? Math.abs(num(st) / num(s)) : null;
  const sgarPos = ratio !== null && ratio >= 0.25;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>SCA · Síndrome Coronariana Aguda</span>
        <span className={styles.subtitle}>10 sheets reproduzidos do golden no padrão novo.</span>
      </div>

      <div className={styles.grid}>
        {SHEETS.map(([key, label, meta]) => (
          <div key={key} className={styles.item}>
            <Button variant="secondary" size="lg" data-sheet={`sca-${key}`} onClick={() => setOpenKey(key)}>
              {label}
            </Button>
            <span className={styles.itemMeta}>{meta}</span>
          </div>
        ))}
      </div>

      <SelectSheet
        open={openKey === 'queixa'}
        onClose={close}
        title="Queixa principal"
        description="Toque na opção que melhor descreve a apresentação do paciente."
        options={QUEIXAS}
        value={queixa}
        onChange={setQueixa}
        name="Queixa"
      />

      <ToolSheet
        open={openKey === 'sgarbossa'}
        onClose={close}
        title="Calculadora Sgarbossa-Smith"
        description="BRE/BRD com dor · 1 critério positivo = OMI (Alencar 2025)"
        primaryAction={{ label: 'Fechar' }}
      >
        <InputField label="Desnivelamento do ST (mm)" inputMode="decimal" mono value={st} onChange={setSt} placeholder="ex: 3" />
        <InputField label="Onda S ou R precedente (mm)" inputMode="decimal" mono value={s} onChange={setS} placeholder="ex: 10" />
        <SheetCalculationBlock
          label="Razão ST/S"
          value={ratio !== null ? ratio.toFixed(2) : '·'}
          hint={ratio !== null ? '≥ 0,25 = critério Smith positivo' : 'Preencha os dois campos pra calcular'}
        />
        {ratio !== null && (
          <SheetAlert tone={sgarPos ? 'critical' : 'info'} title={sgarPos ? 'Critério positivo · OMI provável' : 'Critério negativo'}>
            {sgarPos
              ? 'Discordância ST/S ≥ 0,25 — trate como oclusão (acionar reperfusão).'
              : 'Razão abaixo de 0,25 — reavaliar ECG seriado e clínica.'}
          </SheetAlert>
        )}
        <SheetSection title="3 critérios (Smith-modified)">
          <SheetList
            items={[
              'SST concordante ≥ 1 mm em qualquer derivação',
              'IST concordante ≥ 1 mm em V1–V3',
              'SST discordante com razão ST/S ≥ 0,25',
            ]}
          />
        </SheetSection>
      </ToolSheet>

      <SelectSheet
        open={openKey === 'reperfundir'}
        onClose={close}
        title="Onde vai reperfundir?"
        description="A escolha define o fluxo · pode mudar entre plantões."
        options={REPERFUSAO}
        value={reperf}
        onChange={setReperf}
        name="Reperfusão"
      />

      <BottomSheet
        open={openKey === 'p2y12'}
        onClose={close}
        title="Qual P2Y12?"
        description="Decisão guiada por cenário + filtros automáticos (Rao 2025)"
        footer={{
          secondary: { label: 'Cancelar', onClick: close },
          primary: { label: 'Confirmar', onClick: close, disabled: !p2y12 },
        }}
      >
        <SheetAlert tone="success" title="Prasugrel 60mg VO ou ticagrelor 180mg VO">
          Preferenciais em PCI. Bloqueie prasugrel se AVC/AIT prévio; reduza se ≥ 75a ou &lt; 60 kg.
        </SheetAlert>
        <SheetOptionList options={P2Y12} value={p2y12} onChange={setP2y12} name="P2Y12" />
      </BottomSheet>

      <InfoSheet
        open={openKey === 'omi'}
        onClose={close}
        title="Sinais de OMI"
        description="Oclusão miocárdica sem critério STEMI clássico"
        tone="warning"
        leadingIcon="!"
      >
        <SheetText>
          Padrões que <strong>indicam reperfusão</strong> mesmo sem supra clássico — não espere o STEMI fechar.
        </SheetText>
        <SheetList
          items={[
            'Onda T hiperaguda',
            'De Winter (IST + T apiculada em V1–V6)',
            'Wellens (T bifásica/invertida em V2–V3)',
            'Aslanger, Sgarbossa-Smith, espelho posterior',
          ]}
        />
        <SheetText variant="auxiliary">Referência: SBC 2025 · Smith/Alencar 2025.</SheetText>
      </InfoSheet>

      <DetailSheet
        open={openKey === 'historico'}
        onClose={close}
        title="J.S.O."
        description="Caso encerrado · SCA"
      >
        <SheetSection title="Atendimento">
          <SheetDetailRow label="Classificação ECG" value="STEMI" />
          <SheetDetailRow label="Reperfusão" value="ICP primária" />
          <SheetDetailRow label="Porta-balão" value="68 min" />
        </SheetSection>
        <SheetSection title="Alta">
          <SheetDetailRow label="P2Y12" value="Prasugrel" />
          <SheetDetailRow label="Destino" value="UCO" />
        </SheetSection>
      </DetailSheet>

      <ToolSheet
        open={openKey === 'prontuario'}
        onClose={close}
        title="Texto pra prontuário"
        description="Copie e cole no sistema de prontuário."
        primaryAction={{ label: 'Copiar resultado', closeOnClick: false }}
        secondaryAction={{ label: 'Fechar', onClick: close }}
      >
        <SheetText>
          Paciente com dor torácica anginosa, ECG com supra de ST em parede inferior. Conduzido como STEMI:
          AAS + P2Y12 + anticoagulação, acionado cathlab. Porta-balão 68 min.
        </SheetText>
        <SheetText variant="auxiliary">Gerado pelo CalcMed · revisar antes de assinar.</SheetText>
      </ToolSheet>

      <InfoSheet
        open={openKey === 'termo'}
        onClose={close}
        title="Termo de consentimento · fibrinólise"
        description="Exigência INTS pra fibrinólise"
        acknowledgeLabel="Entendi"
        leadingIcon="i"
      >
        <SheetText>
          Imprimir e colher as assinaturas físicas do paciente/responsável antes de administrar o fibrinolítico.
        </SheetText>
        <SheetList items={['Riscos hemorrágicos explicados', 'Contraindicações revisadas', 'Assinatura do médico e do paciente']} />
      </InfoSheet>

      <AnnotationSheet
        open={openKey === 'anotacao'}
        onClose={close}
        value={nota}
        onChange={setNota}
        onSave={() => {}}
      />

      <FormSheet
        open={openKey === 'encerrar'}
        onClose={close}
        title="Encerrar caso"
        description="Preencha pra salvar no histórico · tudo opcional"
        saveLabel="Encerrar caso"
        onSave={() => {}}
      >
        <InputField label="Iniciais (LGPD)" value="" onChange={() => {}} placeholder="Ex: J.S.O." />
        <SheetTextarea label="Observação final" value="" onChange={() => {}} placeholder="Desfecho, destino..." />
      </FormSheet>
    </section>
  );
}
