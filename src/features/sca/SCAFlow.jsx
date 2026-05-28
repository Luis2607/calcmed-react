import { useEffect, useMemo, useState } from 'react';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel/SectionLabel';
import { Button } from '../../shared/components/atoms/Button/Button';
import { Checkbox } from '../../shared/components/atoms/Checkbox/Checkbox';
import { InputField } from '../../shared/components/molecules/InputField/InputField';
import { Chip } from '../../shared/components/molecules/Chip/Chip';
import { Tag } from '../../shared/components/molecules/Tag/Tag';
import { AlertCard } from '../../shared/components/organisms/AlertCard/AlertCard';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader/ProtocolHeader';
import { ProtocolSteps } from '../../shared/components/molecules/ProtocolSteps/ProtocolSteps';
import { ActionFooter } from '../../shared/components/organisms/ActionFooter/ActionFooter';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard/ClinicalCard';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { TabBar } from '../../shared/components/molecules/TabBar/TabBar';
import { Timeline } from '../../shared/components/organisms/Timeline/Timeline';
import { PatientDetail } from '../../shared/components/organisms/PatientDetail/PatientDetail';
import { InfoSheet } from '../../shared/components/overlays/patterns/InfoSheet';
import { SheetText } from '../../shared/components/molecules/sheet/SheetText';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './SCAFlow.module.css';

const STEPS = ['Triagem', 'ECG', 'Estratificar', 'Conduzir', 'Reavaliar'];

const TABS = [
  { id: 'executar', label: 'Executar', icon: 'protocolos' },
  { id: 'historico', label: 'Historico', icon: 'tempo', badge: '1' },
  { id: 'teoria', label: 'Teoria', icon: 'cerebro' },
];

const OMI_SIGNS = [
  { id: 'hiperaguda', title: 'T hiperaguda', text: 'Amplitude ou simetria fora do contexto esperado.' },
  { id: 'dewinter', title: 'De Winter', text: 'Infra ascendente no ponto J com T alta em precordiais.' },
  { id: 'wellens', title: 'Wellens', text: 'T bifasica ou profundamente invertida em V2-V3.' },
  { id: 'aslanger', title: 'Aslanger', text: 'Padrao inferior discreto com supra em aVR.' },
  { id: 'posterior', title: 'Espelho posterior', text: 'Infra V1-V3, pedir V7-V9 se suspeita persistir.' },
  { id: 'sgarbossa', title: 'Sgarbossa', text: 'BRE/MP com criterios de concordancia ou ST/S >= 0,25.' },
];

const OUTCOME_CARDS = [
  {
    id: 'c1',
    label: 'STEMI / OMI claro',
    tone: 'critico',
    title: 'CCU/UTI + reperfusao imediata',
    rows: ['DAPT + anticoagulacao', 'Cateterismo ou fibrinolise conforme janela', 'Eco e monitorizacao continua'],
  },
  {
    id: 'c2',
    label: 'Duvida diagnostica',
    tone: 'atencao',
    title: 'Observacao 24h',
    rows: ['ECG seriado 10-20 min', 'Troponina seriada', 'Eco a beira-leito se disponivel'],
  },
  {
    id: 'c3',
    label: 'NSTEMI / OMI sem supra',
    tone: 'premium',
    title: 'Internacao cardiologica',
    rows: ['DAPT + anticoagulacao', 'Estrategia invasiva precoce', 'Tempo esperado 2-4 dias'],
  },
];

const INFO_SHEETS = {
  paciente: {
    title: 'Por que esses dados importam?',
    description: 'Triagem SCA/IAM',
    tone: 'info',
    paragraphs: [
      'Idade, peso, tempo de dor e queixa principal alimentam risco inicial, doses e janela de reperfusao.',
      'Os alertas da triagem tambem viram travas de seguranca mais tarde: SAA bloqueia AAS, PDE5 bloqueia nitrato e AVC/AIT previo bloqueia prasugrel.',
    ],
  },
  ecg: {
    title: 'Classificacao do ECG',
    description: 'Detector OMI/IAM',
    tone: 'warning',
    paragraphs: [
      'O objetivo aqui e separar STEMI classico, ECG preocupante e padroes OMI sem supra classico.',
      'Se houver sinal OMI, o fluxo trata como IAM relevante e puxa conduta, troponina, destino e necessidade de estrategia invasiva.',
    ],
  },
};

function formatElapsed(startedAt, now) {
  const diff = Math.max(0, now - startedAt);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  if (hours > 0) return `${hours}h${String(minutes).padStart(2, '0')}`;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function MiniEcg({ active }) {
  return (
    <span className={styles.miniEcg} data-active={active ? 'true' : 'false'} aria-hidden="true">
      <span />
      <strong />
      <span />
    </span>
  );
}

function SelectCard({ selected, title, meta, children, onClick, tone = 'default' }) {
  return (
    <button
      type="button"
      className={styles.selectCard}
      data-selected={selected ? 'true' : 'false'}
      data-tone={tone}
      onClick={onClick}
    >
      <span className={styles.selectHeader}>
        <strong>{title}</strong>
        {meta && <em>{meta}</em>}
      </span>
      {children && <span className={styles.selectBody}>{children}</span>}
    </button>
  );
}

function InfoGrid({ items }) {
  return (
    <div className={styles.infoGrid}>
      {items.map((item) => (
        <div key={item.label} className={styles.infoTile}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function ScoreBar({ value }) {
  const clamped = Math.max(0, Math.min(10, value));
  return (
    <div className={styles.scoreCard}>
      <div className={styles.scoreHeader}>
        <span>HEART</span>
        <strong className="mono">{clamped}</strong>
      </div>
      <div className={styles.scoreTrack}>
        <span style={{ width: `${clamped * 10}%` }} />
      </div>
      <div className={styles.scoreScale}>
        <span>Baixo</span>
        <span>Intermediario</span>
        <span>Alto</span>
      </div>
    </div>
  );
}

export function SCAFlow({ onBack }) {
  const [startedAt, setStartedAt] = usePersistedState('sca_iniciado_timestamp', 0);
  const [savedCases, setSavedCases] = usePersistedState('sca_historico', []);
  const [now, setNow] = useState(() => Date.now());
  const [step, setStep] = useState(() => {
    const requestedStep = Number(new URLSearchParams(window.location.search).get('step'));
    return requestedStep >= 1 && requestedStep <= 5 ? requestedStep : 1;
  });
  const [tab, setTab] = useState(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    return TABS.some((item) => item.id === requestedTab) ? requestedTab : 'executar';
  });
  const [copied, setCopied] = useState(false);
  const [patient, setPatient] = useState({
    initials: 'JLS',
    age: '58',
    weight: '78',
    sex: 'Masc.',
    onset: '40',
    complaint: 'Dor toracica tipica',
  });
  const [flags, setFlags] = useState({
    dissection: false,
    pde5: true,
    stroke: false,
    anticoag: false,
    diabetes: true,
  });
  const [ecgClass, setEcgClass] = useState('omi');
  const [omiSigns, setOmiSigns] = useState(['hiperaguda', 'posterior']);
  const [territory, setTerritory] = useState('Inferior / posterior');
  const [score, setScore] = useState({ heart: 5, timi: 3, troponin: 'rule-in' });
  const [strategy, setStrategy] = useState('ppci');
  const [fibrinolysisContra, setFibrinolysisContra] = useState(false);
  const [savedBanner, setSavedBanner] = useState('');
  const [infoSheetKey, setInfoSheetKey] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!Number.isFinite(Number(startedAt)) || Number(startedAt) <= 0) {
      setStartedAt(now);
    }
  }, [now, setStartedAt, startedAt]);

  useEffect(() => {
    if (!savedCases.length) {
      setSavedCases([
        {
          id: 'demo-sca-jls',
          initials: 'JLS',
          protocol: 'SCA',
          status: 'Internado',
          date: 'Hoje',
          duration: '42 min',
        },
      ]);
    }
  }, [savedCases.length, setSavedCases]);

  const elapsed = formatElapsed(Number(startedAt || now), now);
  const diagnosis = useMemo(() => {
    if (ecgClass === 'stemi') {
      return {
        id: 'c1',
        title: 'STEMI classico confirmado',
        level: 'critical',
        tag: 'Reperfusao',
        text: 'Ativar hemodinamica agora. Se transferencia exceder janela operacional, avaliar fibrinolise se nao houver contraindicacao.',
      };
    }
    if (ecgClass === 'omi' && score.troponin === 'rule-in') {
      return {
        id: 'c3',
        title: 'OMI/IAM sem supra confirmado',
        level: 'warning',
        tag: 'Internar',
        text: 'Sinais OMI + troponina em rule-in. Internar em cardio/CCU conforme instabilidade e programar estrategia invasiva precoce.',
      };
    }
    return {
      id: 'c2',
      title: 'Duvida diagnostica ativa',
      level: 'info',
      tag: 'Observar',
      text: 'ECG preocupante ou troponina em zona cinzenta. Manter observacao monitorizada, ECG seriado e segunda troponina.',
    };
  }, [ecgClass, score.troponin]);

  const activeOutcome = OUTCOME_CARDS.find((card) => card.id === diagnosis.id) || OUTCOME_CARDS[1];
  const canAdvance = step !== 2 || ecgClass === 'stemi' || omiSigns.length > 0 || ecgClass === 'preocupante';
  const timelineEvents = [
    { id: 'triagem', time: '00:00', status: 'info', statusLabel: 'Triagem', title: 'Paciente abriu protocolo SCA', description: `${patient.age}a, ${patient.complaint}, inicio ha ${patient.onset} min.` },
    { id: 'ecg', time: '08:40', status: diagnosis.level === 'critical' ? 'critical' : 'warning', statusLabel: 'ECG', title: ecgClass === 'stemi' ? 'STEMI classico' : 'Detector OMI positivo', description: territory },
    { id: 'trop', time: '21:00', status: score.troponin === 'rule-in' ? 'critical' : 'warning', statusLabel: 'Troponina', title: score.troponin === 'rule-in' ? 'Rule-in' : 'Zona cinzenta', description: `HEART ${score.heart} / TIMI ${score.timi}.` },
    { id: 'conduta', time: '31:00', status: 'success', statusLabel: 'Conduta', title: strategy === 'ppci' ? 'PPCI acionada' : 'Fibrinolise em avaliacao', description: 'DAPT, anticoagulacao e estatina de alta intensidade conforme locks.' },
    { id: 'destino', time: elapsed, status: diagnosis.id === 'c2' ? 'warning' : 'success', statusLabel: 'Destino', title: activeOutcome.title, description: 'Passe estruturado pronto para copiar.' },
  ];

  const patientSections = [
    {
      title: 'Diagnostico',
      meta: diagnosis.tag,
      rows: [
        { label: 'ECG', value: ecgClass === 'stemi' ? 'STEMI' : ecgClass === 'omi' ? 'OMI' : 'Preocupante' },
        { label: 'Territorio', value: territory },
        { label: 'HEART/TIMI', value: `${score.heart}/${score.timi}` },
      ],
    },
    {
      title: 'Conduta',
      meta: strategy === 'ppci' ? 'PPCI' : 'Trombolise',
      rows: [
        { label: 'AAS', value: flags.dissection ? 'Bloqueado' : 'Liberado' },
        { label: 'Nitrato', value: flags.pde5 ? 'Bloqueado' : 'Considerar' },
        { label: 'Destino', value: activeOutcome.label },
      ],
    },
  ];

  const updatePatient = (key, value) => {
    setPatient((current) => ({ ...current, [key]: value }));
  };

  const toggleFlag = (key) => {
    setFlags((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleOmiSign = (id) => {
    setOmiSigns((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const saveCurrentCase = () => {
    const entry = {
      id: `sca-${now}`,
      initials: patient.initials.toUpperCase(),
      protocol: 'SCA',
      status: diagnosis.id === 'c2' ? 'Observacao' : 'Internado',
      date: new Date().toLocaleDateString('pt-BR'),
      duration: elapsed,
    };
    setSavedCases([entry, ...savedCases.filter((item) => item.id !== 'demo-sca-jls')].slice(0, 6));
    setSavedBanner('Caso SCA salvo no historico local.');
  };

  const copyHandoff = async () => {
    const text = `SCA/IAM - ${patient.initials}, ${patient.age}a, ${patient.weight}kg. ECG: ${ecgClass.toUpperCase()} (${territory}). HEART ${score.heart}, TIMI ${score.timi}, troponina ${score.troponin}. Conduta: ${activeOutcome.title}. Locks: AAS ${flags.dissection ? 'bloqueado por SAA' : 'liberado'}, nitrato ${flags.pde5 ? 'bloqueado por PDE5' : 'considerar'}.`;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const goNext = () => setStep((current) => Math.min(5, current + 1));
  const goPrev = () => setStep((current) => Math.max(1, current - 1));

  const renderTriagem = () => (
    <>
      <section className={styles.setupCard}>
        <div>
          <Tag variant="domain" tone="urgencias">SCA</Tag>
          <h2>Realidade do servico</h2>
          <p>Hemodinamica 24/7, troponina ultrassensivel e HEART/TIMI disponiveis.</p>
        </div>
        <div className={styles.setupSummary}>
          <Chip state="active">PPCI</Chip>
          <Chip>hs-cTn 0/1h</Chip>
          <Chip>HEART + TIMI</Chip>
        </div>
      </section>

      <SectionLabel onInfo={() => setInfoSheetKey('paciente')}>Identifique o paciente</SectionLabel>
      <div className={styles.inputGrid}>
        <InputField label="Iniciais" value={patient.initials} onChange={(value) => updatePatient('initials', value.toUpperCase())} placeholder="JLS" />
        <InputField label="Idade" type="number" mono value={patient.age} onChange={(value) => updatePatient('age', value)} showUnit unit="anos" />
        <InputField label="Peso" type="number" mono value={patient.weight} onChange={(value) => updatePatient('weight', value)} showUnit unit="kg" />
        <InputField label="Inicio da dor" type="number" mono value={patient.onset} onChange={(value) => updatePatient('onset', value)} showUnit unit="min" />
      </div>

      <section className={styles.clinicalBlock}>
        <div className={styles.blockHeader}>
          <strong>Queixa principal</strong>
          <Tag variant="status" tone="critico">Manchester laranja</Tag>
        </div>
        <div className={styles.segmentGrid}>
          {['Dor toracica tipica', 'Dispneia', 'Sincope', 'Epigastralgia'].map((item) => (
            <SelectCard key={item} selected={patient.complaint === item} title={item} onClick={() => updatePatient('complaint', item)} />
          ))}
        </div>
      </section>

      <section className={styles.clinicalBlock}>
        <SectionLabel>Alertas que mudam conduta</SectionLabel>
        <div className={styles.checkboxList}>
          <Checkbox checked={flags.dissection} onChange={() => toggleFlag('dissection')} label="Suspeita de sindrome aortica aguda" />
          <Checkbox checked={flags.pde5} onChange={() => toggleFlag('pde5')} label="Uso recente de inibidor PDE5" />
          <Checkbox checked={flags.stroke} onChange={() => toggleFlag('stroke')} label="AVC/AIT previo" />
          <Checkbox checked={flags.anticoag} onChange={() => toggleFlag('anticoag')} label="Anticoagulante em uso" />
          <Checkbox checked={flags.diabetes} onChange={() => toggleFlag('diabetes')} label="Diabetes / alto risco aterotrombotico" />
        </div>
      </section>

      {(flags.dissection || flags.pde5 || flags.stroke) && (
        <AlertCard level="warning" title="Locks clinicos ja aplicados">
          {flags.dissection && 'Nao liberar AAS ate afastar sindrome aortica. '}
          {flags.pde5 && 'Nitrato bloqueado por PDE5 recente. '}
          {flags.stroke && 'Evitar prasugrel se AVC/AIT previo. '}
        </AlertCard>
      )}
    </>
  );

  const renderEcg = () => (
    <>
      <TimerCard
        label="Porta-ECG"
        value="08:40"
        description="Meta até 10 min. ECG registrado dentro da janela."
        tone={diagnosis.level === 'critical' ? 'critical' : 'primary'}
      />

      <SectionLabel onInfo={() => setInfoSheetKey('ecg')}>Classifique o ECG</SectionLabel>
      <div className={styles.segmentGrid}>
        <SelectCard selected={ecgClass === 'stemi'} title="STEMI classico" meta="Supra persistente" tone="critical" onClick={() => setEcgClass('stemi')}>
          Ativar reperfusao imediata.
        </SelectCard>
        <SelectCard selected={ecgClass === 'preocupante'} title="ECG preocupante" meta="Sem criterio claro" tone="warning" onClick={() => setEcgClass('preocupante')}>
          Observacao monitorizada e ECG seriado.
        </SelectCard>
        <SelectCard selected={ecgClass === 'omi'} title="Sem STEMI, checar OMI" meta="Detector IAM" tone="info" onClick={() => setEcgClass('omi')}>
          Procurar sinais de oclusao aguda.
        </SelectCard>
      </div>

      {ecgClass !== 'preocupante' && (
        <>
          <SectionLabel>Sinais OMI/IAM</SectionLabel>
          <div className={styles.omiGrid}>
            {OMI_SIGNS.map((sign) => {
              const selected = omiSigns.includes(sign.id);
              return (
                <button
                  key={sign.id}
                  type="button"
                  className={styles.omiCard}
                  data-selected={selected ? 'true' : 'false'}
                  onClick={() => toggleOmiSign(sign.id)}
                >
                  <MiniEcg active={selected} />
                  <span>
                    <strong>{sign.title}</strong>
                    <em>{sign.text}</em>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      <section className={styles.clinicalBlock}>
        <SectionLabel>Territorio / gates</SectionLabel>
        <div className={styles.segmentGrid}>
          {['Anterior', 'Inferior / posterior', 'Lateral', 'Indefinido'].map((item) => (
            <SelectCard key={item} selected={territory === item} title={item} onClick={() => setTerritory(item)} />
          ))}
        </div>
        {omiSigns.includes('posterior') && (
          <AlertCard level="warning" title="Pedir V7-V9">
            Espelho posterior ativo. Registrar derivacoes posteriores antes de fechar a decisao.
          </AlertCard>
        )}
        {omiSigns.includes('sgarbossa') && (
          <AlertCard level="info" title="Sgarbossa-Smith">
            Se BRE/marca-passo, calcular concordancia e razao ST/S. Positivo se a razao for 0,25 ou maior.
          </AlertCard>
        )}
      </section>
    </>
  );

  const renderEstratificar = () => (
    <>
      <SectionLabel>HEART / TIMI</SectionLabel>
      <ScoreBar value={score.heart} />
      <div className={styles.scoreControls}>
        <Button variant="secondary" size="sm" onClick={() => setScore((current) => ({ ...current, heart: Math.max(0, current.heart - 1) }))}>HEART -</Button>
        <Button variant="secondary" size="sm" onClick={() => setScore((current) => ({ ...current, heart: Math.min(10, current.heart + 1) }))}>HEART +</Button>
        <Button variant="secondary" size="sm" onClick={() => setScore((current) => ({ ...current, timi: Math.max(0, current.timi - 1) }))}>TIMI -</Button>
        <Button variant="secondary" size="sm" onClick={() => setScore((current) => ({ ...current, timi: Math.min(7, current.timi + 1) }))}>TIMI +</Button>
      </div>

      <section className={styles.clinicalBlock}>
        <div className={styles.blockHeader}>
          <strong>Troponina</strong>
          <Tag variant="status" tone={score.troponin === 'rule-in' ? 'critico' : 'atencao'}>
            {score.troponin === 'rule-in' ? 'Rule-in' : 'Zona cinzenta'}
          </Tag>
        </div>
        <div className={styles.segmentGrid}>
          <SelectCard selected={score.troponin === 'rule-out'} title="Rule-out" onClick={() => setScore((current) => ({ ...current, troponin: 'rule-out' }))} />
          <SelectCard selected={score.troponin === 'observacao'} title="Zona cinzenta" onClick={() => setScore((current) => ({ ...current, troponin: 'observacao' }))} />
          <SelectCard selected={score.troponin === 'rule-in'} title="Rule-in" tone="critical" onClick={() => setScore((current) => ({ ...current, troponin: 'rule-in' }))} />
        </div>
      </section>

      <AlertCard level={diagnosis.level} title={diagnosis.title}>
        {diagnosis.text}
      </AlertCard>

      <section className={styles.clinicalBlock}>
        <SectionLabel>Se houver duvida diagnostica</SectionLabel>
        <InfoGrid items={[
          { label: 'ECG seriado', value: '10-20 min' },
          { label: 'Troponina', value: '0/1h ou 0/3h' },
          { label: 'Leito', value: 'Monitorizado' },
          { label: 'Eco', value: 'Se disponivel' },
        ]} />
      </section>
    </>
  );

  const renderConduzir = () => (
    <>
      <AlertCard level={flags.dissection ? 'critical' : 'result'} title={flags.dissection ? 'AAS bloqueado' : 'AAS liberado'}>
        {flags.dissection ? 'Suspeita de sindrome aortica marcada na triagem.' : 'Administrar AAS mastigavel se nao houver alergia ou suspeita de aorta.'}
      </AlertCard>

      <section className={styles.medGrid}>
        <div className={styles.medCard}>
          <Tag variant="status" tone="recomendado">DAPT</Tag>
          <strong>P2Y12</strong>
          <p>Preferir ticagrelor ou clopidogrel conforme estrategia e risco.</p>
          {flags.stroke && <span>Prasugrel bloqueado por AVC/AIT previo.</span>}
        </div>
        <div className={styles.medCard}>
          <Tag variant="status" tone="premium">Heparina</Tag>
          <strong>Anticoagulacao</strong>
          <p>Escolher dose conforme peso, funcao renal e plano invasivo.</p>
        </div>
        <div className={styles.medCard}>
          <Tag variant="status" tone="novo">Estatina</Tag>
          <strong>Alta intensidade</strong>
          <p>Atorvastatina 80 mg ou equivalente se nao houver contraindicacao.</p>
        </div>
        <div className={styles.medCard}>
          <Tag variant="status" tone={flags.pde5 ? 'atencao' : 'gratuito'}>Nitrato</Tag>
          <strong>{flags.pde5 ? 'Bloqueado' : 'Considerar'}</strong>
          <p>{flags.pde5 ? 'PDE5 recente marcado na triagem.' : 'Se dor persistente e PA permite.'}</p>
        </div>
      </section>

      <SectionLabel>Reperfusao</SectionLabel>
      <div className={styles.segmentGrid}>
        <SelectCard selected={strategy === 'ppci'} title="PPCI" meta="Preferencial" tone="info" onClick={() => setStrategy('ppci')}>
          Ativar hemodinamica, tempo porta-balao e transporte.
        </SelectCard>
        <SelectCard selected={strategy === 'fibrinolise'} title="Fibrinolise" meta="Se atraso PCI" tone="warning" onClick={() => setStrategy('fibrinolise')}>
          Checar janela, peso e contraindicacoes absolutas.
        </SelectCard>
      </div>

      {strategy === 'fibrinolise' && (
        <section className={styles.clinicalBlock}>
          <Checkbox checked={fibrinolysisContra} onChange={setFibrinolysisContra} label="Ha contraindicacao absoluta para fibrinolitico" />
          <AlertCard level={fibrinolysisContra ? 'critical' : 'warning'} title={fibrinolysisContra ? 'Fibrinolise bloqueada' : 'Checagem obrigatoria'}>
            Confirmar sangramento ativo, AVC hemorragico previo, dissecao de aorta, trauma recente e PA sem controle.
          </AlertCard>
        </section>
      )}
    </>
  );

  const renderReavaliar = () => (
    <>
      <AlertCard level={diagnosis.level} title="Desfecho recomendado">
        {activeOutcome.title}. {diagnosis.text}
      </AlertCard>

      <SectionLabel>Internacao por tipo de IAM</SectionLabel>
      <div className={styles.outcomeStack}>
        {OUTCOME_CARDS.map((card) => (
          <article key={card.id} className={styles.outcomeCard} data-active={diagnosis.id === card.id ? 'true' : 'false'}>
            <div className={styles.blockHeader}>
              <Tag variant="status" tone={card.tone}>{card.label}</Tag>
              {diagnosis.id === card.id && <strong>Selecionado</strong>}
            </div>
            <h3>{card.title}</h3>
            <ul>
              {card.rows.map((row) => <li key={row}>{row}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <section className={styles.handoffCard}>
        <div>
          <span>Passe pronto</span>
          <strong>{patient.initials} - {diagnosis.title}</strong>
          <p>Inclui ECG, escore, troponina, locks e destino.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={copyHandoff} showLeftIcon leftIcon="copiar">
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </section>

      <PatientDetail
        initials={patient.initials}
        protocol="SCA / IAM"
        status={diagnosis.id === 'c2' ? 'Observacao' : 'Internado'}
        statusTone={diagnosis.id === 'c2' ? 'atencao' : 'novo'}
        summary={[
          { label: 'Tempo', value: elapsed },
          { label: 'Inicio dor', value: `${patient.onset} min` },
          { label: 'Peso', value: `${patient.weight} kg` },
        ]}
        sections={patientSections}
      />
    </>
  );

  const renderExecutar = () => (
    <>
      <main className={styles.content}>
        {step === 1 && renderTriagem()}
        {step === 2 && renderEcg()}
        {step === 3 && renderEstratificar()}
        {step === 4 && renderConduzir()}
        {step === 5 && renderReavaliar()}
      </main>
    </>
  );

  const renderHistorico = () => (
    <main className={styles.content}>
      <SectionLabel>Historico do aparelho</SectionLabel>
      <div className={styles.caseList}>
        {savedCases.map((item) => (
          <article key={item.id} className={styles.caseItem}>
            <div className={styles.caseAvatar}>{item.initials}</div>
            <div>
              <strong>{item.protocol} - {item.status}</strong>
              <span>{item.date} · {item.duration}</span>
            </div>
            <Tag variant="status" tone={item.status === 'Observacao' ? 'atencao' : 'novo'}>{item.status}</Tag>
          </article>
        ))}
      </div>
      <Timeline title="Linha do tempo do caso aberto" events={timelineEvents} />
      <PatientDetail
        initials={patient.initials}
        protocol="SCA / IAM"
        status={diagnosis.id === 'c2' ? 'Observacao' : 'Internado'}
        statusTone={diagnosis.id === 'c2' ? 'atencao' : 'novo'}
        summary={[
          { label: 'ECG', value: ecgClass.toUpperCase() },
          { label: 'Troponina', value: score.troponin },
          { label: 'Destino', value: activeOutcome.label },
        ]}
        sections={patientSections}
      />
    </main>
  );

  const renderTeoria = () => (
    <main className={styles.content}>
      <SectionLabel>Consulta rapida</SectionLabel>
      <div className={styles.theoryGrid}>
        {[
          ['Sinais OMI/IAM', 'T hiperaguda, De Winter, Wellens, Aslanger, posterior e Sgarbossa.'],
          ['Duvida diagnostica', 'Monitorizar, ECG seriado, troponina seriada e eco quando disponivel.'],
          ['Tipos de IAM', 'STEMI/OMI claro, NSTEMI/OMI sem supra e zona cinzenta tem destinos diferentes.'],
          ['Reperfusao', 'PPCI preferencial; fibrinolise exige janela e checagem de contraindicacoes.'],
          ['Locks de seguranca', 'SAA bloqueia AAS, PDE5 bloqueia nitrato, AVC/AIT bloqueia prasugrel.'],
        ].map(([title, text]) => (
          <ClinicalCard key={title} title={title} subtitle={text} />
        ))}
      </div>
    </main>
  );

  return (
    <div className={styles.flow}>
      <ProtocolHeader
        title="MODO SCA"
        compactLabel="SCA aberto há"
        timer={elapsed}
        timerVariant="stacked"
        actions={[
          { icon: 'edit', label: 'Copiar resumo do caso', onClick: copyHandoff },
          { icon: 'exit', label: 'Sair do protocolo', onClick: onBack },
        ]}
        domain="sca"
      />

      {tab === 'executar' && (
        <ProtocolSteps
          steps={STEPS}
          current={step}
          onStepClick={setStep}
          activePresentation="capsule"
          connectorStyle="dot"
        />
      )}

      {savedBanner && (
        <div className={styles.toast} aria-live="polite">
          {savedBanner}
          <button type="button" onClick={() => setSavedBanner('')}>Fechar</button>
        </div>
      )}

      <div className={styles.body}>
        {tab === 'executar' && renderExecutar()}
        {tab === 'historico' && renderHistorico()}
        {tab === 'teoria' && renderTeoria()}
      </div>

      {tab === 'executar' && (
        <ActionFooter
          hint={step === 2 ? 'Avanco bloqueia se ECG nao tiver uma classe valida.' : step === 5 ? 'Salve ou copie o passe antes de encerrar.' : diagnosis.title}
          meta={step <= 3 ? 'Diagnostico' : 'Tratamento'}
          secondary={step > 1 ? { label: 'Voltar', variant: 'secondary', onClick: goPrev } : { label: 'Historico', variant: 'secondary', onClick: () => setTab('historico') }}
          primary={step < 5
            ? { label: 'Continuar', onClick: goNext, disabled: !canAdvance, rightIcon: 'chevronRight' }
            : { label: 'Salvar caso', onClick: saveCurrentCase, leftIcon: 'salvar' }}
        />
      )}

      <TabBar items={TABS} activeId={tab} onChange={setTab} sticky />

      <InfoSheet
        open={Boolean(infoSheetKey)}
        onClose={() => setInfoSheetKey(null)}
        title={INFO_SHEETS[infoSheetKey]?.title}
        description={INFO_SHEETS[infoSheetKey]?.description}
        tone={INFO_SHEETS[infoSheetKey]?.tone}
      >
        {INFO_SHEETS[infoSheetKey]?.paragraphs.map((paragraph) => (
          <SheetText key={paragraph}>{paragraph}</SheetText>
        ))}
      </InfoSheet>
    </div>
  );
}
