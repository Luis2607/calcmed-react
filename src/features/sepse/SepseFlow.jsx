import { useEffect, useMemo, useState } from 'react';
import { useSepseState } from './hooks/useSepseState';
import {
  SOFA_SISTEMAS, NEWS_SISTEMAS, MEWS_SISTEMAS, SIRS_ITENS, SCORE_DESCRITORES,
  ESQUEMAS, FOCOS, RISCO_MRSA, RISCO_MDR,
  METAS_ITENS, ICU_ITENS,
  parseNum, somaSofa, sevToRisk,
  prescricaoNoradrenalina, prescricaoAdrenalina, prescricaoDobutamina, proximoPassoNE,
} from './sepseData';
import { SEPSE_MODAIS, SepseModalBody } from './sepseModais';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { InfoButton } from '../../shared/components/atoms/InfoButton';
import { Button } from '../../shared/components/atoms/Button';
import { Toggle } from '../../shared/components/atoms/Toggle/Toggle';
import { InputField } from '../../shared/components/molecules/InputField';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { CheckboxGroup } from '../../shared/components/molecules/CheckboxGroup';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { DetailRow } from '../../shared/components/molecules/DetailRow/DetailRow';
import { ScoreResult } from '../../shared/components/molecules/ScoreResult/ScoreResult';
import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup/ScoreCriterionGroup';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { InfoSheet, ConfirmSheet, FormSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './SepseFlow.module.css';

const STEPS = ['Triagem', '1ª hora', 'ATB', 'Vaso', 'Metas'];
const SCORE_TABS = [
  { value: 'sirs', label: 'SIRS' },
  { value: 'news', label: 'NEWS' },
  { value: 'mews', label: 'MEWS' },
  { value: 'sofa', label: 'SOFA' },
];
const VEREDITO_OPCOES = [
  { value: 'definida', label: 'Sepse definida' },
  { value: 'provavel', label: 'Sepse provável' },
  { value: 'possivel', label: 'Sepse possível' },
  { value: 'improvavel', label: 'Sepse improvável' },
];

/** Acordeão de um escore (SOFA/NEWS/MEWS) via ScoreCriterionGroup (DS). */
function ScoreAccordion({ sistemas, stateObj, onSelect, namePrefix }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className={styles.group}>
      {sistemas.map((sis) => (
        <ScoreCriterionGroup
          key={sis.key}
          systemName={sis.nome}
          parameter={sis.parametro}
          options={sis.niveis.map((n) => ({ label: n.desc, points: n.pts }))}
          value={typeof stateObj[sis.key] === 'number' ? stateObj[sis.key] : null}
          onChange={(idx) => onSelect(sis.key, idx)}
          expanded={expanded === sis.key}
          onToggle={() => setExpanded(expanded === sis.key ? null : sis.key)}
          name={`${namePrefix}-${sis.key}`}
        />
      ))}
    </div>
  );
}

export function SepseFlow({ onBack }) {
  const s = useSepseState();
  const [historico, setHistorico] = usePersistedState('sepse_historico', []);

  const [modalId, setModalId] = useState(null);
  const [anotarOpen, setAnotarOpen] = useState(false);
  const [sairOpen, setSairOpen] = useState(false);
  const [encerrarOpen, setEncerrarOpen] = useState(false);
  const [iniciais, setIniciais] = useState('');
  const [now, setNow] = useState(() => Date.now());

  // cronômetro do caso (texto pequeno no header)
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  const elapsedStr = useMemo(() => {
    if (!s.iniciadoEm) return null;
    const diff = Math.max(0, now - Number(s.iniciadoEm));
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, [s.iniciadoEm, now]);

  const sofaTotal = somaSofa(s.sofa);
  const bundlePct = Math.round((s.bundleFeitos / s.bundleTotal) * 100);

  // chips do header (idade/peso + Sepse + bundle%)
  const chips = [];
  if (s.idade !== '') chips.push({ label: `${s.idade}a`, mono: true });
  if (s.peso !== '') chips.push({ label: `${s.peso}kg`, mono: true });
  if (sofaTotal >= 2) chips.push({ label: 'Sepse', tone: 'critico' });
  if (s.telaAtual >= 2 && s.bundleFeitos > 0) chips.push({ label: `Bundle ${bundlePct}%`, mono: true });

  // doses (string → número, com defaults)
  const neNum = (() => { const v = parseNum(s.neDose); return isNaN(v) ? 0.10 : v; })();
  const epiNum = (() => { const v = parseNum(s.epiDose); return isNaN(v) ? 0.05 : v; })();
  const dobNum = (() => { const v = parseNum(s.dobDose); return isNaN(v) ? 5 : v; })();

  const handleSair = () => {
    const temDados = s.iniciadoEm || s.idade || s.peso || sofaTotal > 0;
    if (temDados) setSairOpen(true);
    else onBack();
  };

  const handleEncerrar = () => {
    const dur = s.iniciadoEm ? Math.max(0, Date.now() - Number(s.iniciadoEm)) : 0;
    const h = Math.floor(dur / 3600000);
    const m = Math.floor((dur % 3600000) / 60000);
    const durationStr = h > 0 ? `${h}h ${m}min` : `${m} min`;
    const meta = s.classificacao
      ? VEREDITO_OPCOES.find((v) => v.value === s.classificacao)?.label
      : 'Sepse';
    const novoCaso = {
      id: Date.now().toString(),
      initials: (iniciais || '—').toUpperCase().slice(0, 10),
      date: new Date().toLocaleDateString('pt-BR'),
      duration: durationStr,
      status: 'Concluído',
      meta,
      sofa: sofaTotal,
    };
    setHistorico([novoCaso, ...historico]);
    setEncerrarOpen(false);
    setIniciais('');
    s.resetProtocol();
    onBack();
  };

  const modal = modalId ? SEPSE_MODAIS[modalId] : null;

  // ====================== T1 · TRIAGEM ======================
  const t1 = (
    <div className={styles.tela}>
      <StepHeader
        title="Triagem e classificação"
        subtitle="Escore de screening + veredito clínico. Sepse é diagnóstico clínico."
      />

      <div className={styles.stack}>
        <Segmented options={SCORE_TABS} value={s.scoreAtivo} onChange={s.setScoreAtivo} />
        <AlertCard level="info" showIcon>{SCORE_DESCRITORES[s.scoreAtivo]}</AlertCard>

        {s.scoreAtivo === 'sirs' && (
          <CheckboxGroup
            options={SIRS_ITENS.map((it) => ({ value: it.key, label: it.label }))}
            value={SIRS_ITENS.filter((it) => s.sirs[it.key]).map((it) => it.key)}
            onChange={(arr) => SIRS_ITENS.forEach((it) => {
              if (!!s.sirs[it.key] !== arr.includes(it.key)) s.toggleSirs(it.key);
            })}
          />
        )}

        {s.scoreAtivo === 'news' && (
          <>
            <Segmented
              label="Versão"
              options={[{ value: 'news2', label: 'NEWS2' }, { value: 'news', label: 'NEWS' }]}
              value={s.news.versao || 'news2'}
              onChange={(v) => s.setNews({ ...s.news, versao: v })}
            />
            <ScoreAccordion sistemas={NEWS_SISTEMAS} stateObj={s.news} onSelect={s.setNewsNivel} namePrefix="news" />
          </>
        )}

        {s.scoreAtivo === 'mews' && (
          <ScoreAccordion sistemas={MEWS_SISTEMAS} stateObj={s.mews} onSelect={s.setMewsNivel} namePrefix="mews" />
        )}

        {s.scoreAtivo === 'sofa' && (
          <ScoreAccordion sistemas={SOFA_SISTEMAS} stateObj={s.sofa} onSelect={s.setSofaNivel} namePrefix="sofa" />
        )}

        <ScoreResult
          value={s.total}
          risk={sevToRisk(s.status.sev)}
          riskLabel={s.status.texto}
          pointsLabel={s.total === 1 ? 'ponto' : 'pontos'}
        />
      </div>

      <AlertCard level="critical" title="Sepse é diagnóstico clínico">
        Nenhum escore isolado decide. Combine o escore com a avaliação clínica e o seu julgamento à beira-leito.
      </AlertCard>

      <div className={styles.group}>
        <div className={styles.progressHead}>
          <SectionLabel>Veredito clínico</SectionLabel>
          <InfoButton onClick={() => setModalId('o-que-e-classificacao')} size={20} />
        </div>
        <RadioGroup
          name="veredito"
          options={VEREDITO_OPCOES}
          value={s.classificacao}
          onChange={s.definirVeredito}
        />
      </div>
    </div>
  );

  // ====================== T2 · BUNDLE 1ª HORA ======================
  const vasopressorLabel = s.numIdade != null && s.numIdade > 65
    ? 'Vasopressor para PAM ≥ 60 mmHg (60-65 em > 65 anos)'
    : 'Vasopressor para PAM ≥ 65 mmHg';

  const bundlePHItems = [
    { key: 'hemocultura', label: 'Hemocultura × 2 (aeróbio + anaeróbio)' },
    { key: 'lactato', label: 'Lactato sérico' },
    { key: 'atb', label: 'Antibiótico IV de amplo espectro' },
    { key: 'cristaloide', label: 'Cristaloide 30 mL/kg' },
  ];
  const bundleACItems = [
    { key: 'vasopressor', label: vasopressorLabel },
    { key: 'reavaliacao', label: 'Reavaliar lactato em 2-4h' },
    { key: 'procal', label: 'Procalcitonina (opcional)' },
    { key: 'foco', label: 'Identificar foco infeccioso' },
    { key: 'hidrocort', label: 'Considerar hidrocortisona' },
  ];

  const t2 = (
    <div className={styles.tela}>
      <StepHeader title="Bundle da 1ª hora" subtitle="Ações que salvam vidas na primeira hora da sepse." />

      <div className={styles.group}>
        <SectionLabel>Paciente</SectionLabel>
        <div className={styles.row2}>
          <InputField label="Idade" type="text" mono inputMode="numeric" value={s.idade} onChange={(v) => { s.marcarInicio(); s.setIdade(v); }} placeholder="" showUnit unit="anos" />
          <InputField label="Peso" type="text" mono inputMode="decimal" value={s.peso} onChange={(v) => { s.marcarInicio(); s.setPeso(v); }} placeholder="" showUnit unit="kg" />
        </div>
        {s.numIdade != null && s.numIdade >= 65 && (
          <AlertCard level="info"><strong>Paciente ≥ 65 anos.</strong> PAM alvo passa a ser 60 a 65 mmHg (SSC 2026).</AlertCard>
        )}
      </div>

      <ClinicalCard variant="plain" title="Obeso? (IMC ≥ 30)">
        <Toggle checked={s.imcObeso} onChange={s.setImcObeso} label="Usar peso ajustado no cálculo de volume" />
        {s.imcObeso && (
          <div className={styles.group}>
            <Segmented
              label="Sexo"
              options={[{ value: 'masc', label: 'Masculino' }, { value: 'fem', label: 'Feminino' }]}
              value={s.sexo}
              onChange={s.setSexo}
            />
            <InputField label="Altura" type="text" mono inputMode="numeric" value={s.altura} onChange={s.setAltura} placeholder="170" showUnit unit="cm" />
            {s.pesoAjustado != null && (
              <DetailRow label="Peso ajustado" value={`${s.pesoAjustado} kg`} />
            )}
          </div>
        )}
      </ClinicalCard>

      <Button variant={s.horaAtb ? 'secondary' : 'primary'} onClick={s.registrarHoraAtb}>
        {s.horaAtb
          ? `✓ ATB registrado às ${new Date(s.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          : 'Registrar hora do ATB'}
      </Button>

      <ChecklistBlock
        tagLabel="1ª linha"
        tagTone="critico"
        count={`${s.bundlePH}/4`}
        subtitle="Em até 1 hora"
        onInfo={() => setModalId('o-que-e-primeira-hora')}
        items={bundlePHItems.map((it) => ({ label: it.label, checked: !!s.bundle[it.key] }))}
        onToggle={(i) => s.toggleBundle(bundlePHItems[i].key)}
      />

      {s.volume ? (
        <AlertCard level="result" title="Cristaloide 30 mL/kg" showValue value={s.volume.volumeMl.toLocaleString('pt-BR')} unit="mL">
          Ringer Lactato · 30 mL/kg em 1-3 h · peso {s.volume.pesoUsado} kg
          {s.pesoAjustado != null && s.numPeso ? ` (ajustado de ${s.numPeso} kg reais)` : ''}. Individualize conforme resposta.
        </AlertCard>
      ) : (
        <AlertCard level="info" title="Volume aguardando peso">
          Preencha o peso do paciente para calcular o volume de cristaloide (30 mL/kg).
        </AlertCard>
      )}

      <ChecklistBlock
        tagLabel="Acompanhamento"
        tagTone="novo"
        count={`${s.bundleAC}/5`}
        subtitle="Após a 1ª hora"
        onInfo={() => setModalId('o-que-e-acompanhamento')}
        items={bundleACItems.map((it) => ({ label: it.label, checked: !!s.bundle[it.key] }))}
        onToggle={(i) => s.toggleBundle(bundleACItems[i].key)}
      />

      <div className={styles.group}>
        <div className={styles.progressHead}>
          <span className={styles.progressLabel}>Progresso do bundle</span>
          <span className={styles.progressMeta}>{s.bundleFeitos}/{s.bundleTotal} · {bundlePct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${bundlePct}%` }} data-completo={s.bundleFeitos === s.bundleTotal ? 'true' : 'false'} />
        </div>
      </div>
    </div>
  );

  // ====================== T3 · ATB ======================
  const esquema = s.foco ? ESQUEMAS[s.foco] : null;
  const t3 = (
    <div className={styles.tela}>
      <StepHeader title="Antibioticoterapia empírica" subtitle="Foco + risco MRSA/MDR definem o esquema. ATB IV em ≤ 1 h." />

      <div className={styles.group}>
        <div className={styles.progressHead}>
          <SectionLabel>Foco infeccioso</SectionLabel>
          <InfoButton onClick={() => setModalId('o-que-e-foco')} size={20} />
        </div>
        <div className={styles.focoGrid}>
          {FOCOS.map((f) => (
            <OptionCard
              key={f.value}
              title={f.label}
              description={f.desc}
              selected={s.foco === f.value}
              onClick={() => s.setFoco(f.value)}
            />
          ))}
        </div>
      </div>

      {s.foco && (
        <>
          <div className={styles.group}>
            <div className={styles.progressHead}>
              <SectionLabel>Risco MRSA</SectionLabel>
              <span className={styles.progressMeta}>{s.mrsaN}/5</span>
            </div>
            <CheckboxGroup
              options={RISCO_MRSA.map((r) => ({ value: r.key, label: r.label }))}
              value={RISCO_MRSA.filter((r) => s.riscoMrsa[r.key]).map((r) => r.key)}
              onChange={(arr) => RISCO_MRSA.forEach((r) => { if (!!s.riscoMrsa[r.key] !== arr.includes(r.key)) s.toggleRiscoMrsa(r.key); })}
            />
          </div>

          <div className={styles.group}>
            <div className={styles.progressHead}>
              <SectionLabel>Risco MDR</SectionLabel>
              <span className={styles.progressMeta}>{s.mdrN}/5</span>
            </div>
            <CheckboxGroup
              options={RISCO_MDR.map((r) => ({ value: r.key, label: r.label }))}
              value={RISCO_MDR.filter((r) => s.riscoMdr[r.key]).map((r) => r.key)}
              onChange={(arr) => RISCO_MDR.forEach((r) => { if (!!s.riscoMdr[r.key] !== arr.includes(r.key)) s.toggleRiscoMdr(r.key); })}
            />
          </div>

          <div className={styles.group}>
            <div className={styles.progressHead}>
              <SectionLabel>Esquema empírico</SectionLabel>
              <InfoButton onClick={() => setModalId('o-que-e-atb')} size={20} />
            </div>
            <ClinicalCard variant="plain" title={esquema.nome}>
              {esquema.drogas.map((d, i) => <DetailRow key={i} label={d.nome} value={d.dose} />)}
            </ClinicalCard>
            {s.mrsaAtivo && (
              <ClinicalCard variant="plain" title="+ Cobertura MRSA" tags={[{ label: 'MRSA', tone: 'critico' }]}>
                <DetailRow label="Vancomicina" value="15 a 20 mg/kg IV q8 a 12h." />
              </ClinicalCard>
            )}
            {s.mdrAtivo && (
              <ClinicalCard variant="plain" title="+ Cobertura MDR" tags={[{ label: 'MDR', tone: 'critico' }]}>
                <DetailRow label="Piperacilina-tazobactam" value="4,5 g IV q6h." />
              </ClinicalCard>
            )}
            <AlertCard level="warning" title="Consulte a SCIH/CCIH">
              Cada hospital tem perfil de resistência próprio. Reavalie em 48-72h e de-escalone conforme culturas.
            </AlertCard>
          </div>
        </>
      )}
    </div>
  );

  // ====================== T4 · VASOPRESSORES ======================
  const ne = prescricaoNoradrenalina(neNum, s.numPeso);
  const epi = prescricaoAdrenalina(epiNum, s.numPeso);
  const dob = prescricaoDobutamina(dobNum, s.numPeso);

  // funções de render (NÃO componentes inline — evitam remount/perda de foco no input)
  const renderPrescricao = (p) => (
    <AlertCard level="result" title={`Prescrição — ${p.droga}`}>
      {p.droga} ({p.amp}) · <span className={styles.destaque}>{p.preparo}</span> EV em BIC
      {p.vazao
        ? <> a <span className={styles.destaque}>{p.vazao} mL/h</span></>
        : <> · informe o peso (T2) para a vazão</>}
      {' · '}<span className={styles.destaque}>{p.doseFmt} mcg/kg/min</span>
      {s.numPeso ? ` · peso ${s.peso} kg` : ''}
    </AlertCard>
  );

  const renderDrugCard = (tipo, nome, role, ativa, painel) => (
    <ClinicalCard state={ativa ? 'ativo' : 'inativo'} title={nome} subtitle={role}>
      {ativa ? (
        <div className={styles.drugPainel}>{painel}</div>
      ) : (
        <div className={styles.drugInativaRow}>
          <span className={styles.drugInativaTexto}>Inativa</span>
          <Button variant="secondary" onClick={() => s.ativarDroga(tipo)}>+ Iniciar</Button>
        </div>
      )}
    </ClinicalCard>
  );

  const t4 = (
    <div className={styles.tela}>
      <StepHeader title="Vasopressores" subtitle="Noradrenalina é 1ª linha. Titule pela PAM alvo." />

      {renderDrugCard('ne', 'Noradrenalina', '1ª linha', s.neAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.neDose} onChange={s.setNeDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(ne)}
          <AlertCard level="info" title="Próximo passo">{proximoPassoNE(neNum)}</AlertCard>
        </>
      ))}

      {renderDrugCard('vaso', 'Vasopressina', '2ª linha · dose fixa', s.vasoAtiva, (
        <AlertCard level="result" title="Prescrição — Vasopressina">
          Vasopressina · <span className={styles.destaque}>0,03 U/min IV</span>, dose fixa (não titular).
        </AlertCard>
      ))}

      {renderDrugCard('epi', 'Adrenalina', '3ª linha', s.epiAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.epiDose} onChange={s.setEpiDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(epi)}
        </>
      ))}

      {renderDrugCard('dob', 'Dobutamina', 'Disfunção cardíaca', s.dobAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.dobDose} onChange={s.setDobDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(dob)}
        </>
      ))}

      {renderDrugCard('hidro', 'Hidrocortisona', 'Choque refratário', s.hidroAtiva, (
        <AlertCard level="result" title="Prescrição — Hidrocortisona">
          <span className={styles.destaque}>50 mg IV 6/6h</span> (200 mg/dia) ou 8 mg/h em infusão contínua.
        </AlertCard>
      ))}
    </div>
  );

  // ====================== T5 · METAS ======================
  const metasItensView = METAS_ITENS.map((it) => {
    if (it.key === 'du' && s.numPeso) {
      return { ...it, label: `Débito urinário ≥ 0,5 mL/kg/h (${Math.round(s.numPeso * 0.5)} mL/h)` };
    }
    return it;
  });

  const t5 = (
    <div className={styles.tela}>
      <StepHeader title="Metas de ressuscitação" subtitle="Avaliação dinâmica + bundle de cuidados intensivos." />

      <ChecklistBlock
        tagLabel="Metas"
        tagTone="novo"
        count={`${s.metasN}/5`}
        onInfo={() => setModalId('o-que-e-metas')}
        items={metasItensView.map((it) => ({ label: it.label, checked: !!s.metas[it.key] }))}
        onToggle={(i) => s.toggleMeta(METAS_ITENS[i].key)}
      />

      <ChecklistBlock
        tagLabel="Checklist ICU"
        tagTone="novo"
        count={`${s.icuN}/6`}
        onInfo={() => setModalId('o-que-e-checklist-icu')}
        items={ICU_ITENS.map((it) => ({ label: it.label, checked: !!s.icu[it.key] }))}
        onToggle={(i) => s.toggleIcu(ICU_ITENS[i].key)}
      />

      <AlertCard level="info" title="Remoção ativa de fluido">
        Após a estabilização, considere balanço hídrico negativo guiado por perfusão.
      </AlertCard>
    </div>
  );

  // ====================== Footers por tela ======================
  const footers = {
    1: {
      hint: s.tela1Liberada ? 'Iniciar Bundle da 1ª hora' : (s.total === 0 ? 'Preencher um escore' : 'Dar veredito clínico abaixo'),
      primary: { label: 'Iniciar Bundle 1ª hora', onClick: () => s.irParaTela(2), disabled: !s.tela1Liberada },
    },
    2: {
      hint: s.bundlePH < 4 ? `Marcar ${4 - s.bundlePH} ${4 - s.bundlePH === 1 ? 'ação' : 'ações'} da 1ª hora` : 'Seguir para antibioticoterapia',
      primary: { label: 'Antibioticoterapia', onClick: () => s.irParaTela(3) },
    },
    3: {
      hint: !s.foco ? 'Selecionar foco infeccioso' : 'Esquema definido · prescrever ATB IV',
      primary: { label: 'Vasopressores', onClick: () => s.irParaTela(4), disabled: !s.foco },
    },
    4: {
      hint: neNum < 0.25 ? 'Titular NE até PAM ≥ 65 mmHg' : neNum < 0.5 ? 'NE alta · associar Vasopressina' : 'Choque refratário · Adrenalina + Hidrocortisona',
      primary: { label: 'Metas de ressuscitação', onClick: () => s.irParaTela(5) },
    },
    5: {
      hint: s.metasN < 5 ? `Atingir ${5 - s.metasN} ${5 - s.metasN === 1 ? 'meta' : 'metas'}` : s.icuN < 6 ? 'Completar checklist ICU' : 'Caso estabilizado · encerrar',
      primary: { label: 'Encerrar caso', onClick: () => setEncerrarOpen(true), variant: 'primary' },
    },
  };

  const telas = { 1: t1, 2: t2, 3: t3, 4: t4, 5: t5 };

  // ====================== Histórico / Teoria ======================
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos concluídos neste aparelho. Não substitui prontuário (LGPD)."
      cases={historico}
      onClear={() => { if (window.confirm('Limpar todo o histórico de sepse?')) setHistorico([]); }}
    />
  );

  const teoriaView = (
    <TheoryScreen
      title="Consulta rápida"
      subtitle="Referência clínica do protocolo de sepse (SSC 2026)."
      items={[
        { title: 'Score SOFA e Sepsis-3', sub: 'Disfunção orgânica em 6 sistemas', onClick: () => setModalId('teoria-sofa') },
        { title: 'Bundle de 1 hora', sub: 'As ações que salvam vidas', onClick: () => setModalId('teoria-bundle') },
        { title: 'Antibioticoterapia empírica', sub: 'Foco + MRSA + MDR', onClick: () => setModalId('teoria-atb') },
        { title: 'Escalonamento de vasopressores', sub: 'NE → Vaso → Adre → Dobuta', onClick: () => setModalId('teoria-vaso') },
        { title: 'Metas de ressuscitação', sub: 'Avaliação dinâmica', onClick: () => setModalId('teoria-metas') },
      ]}
    />
  );

  return (
    <>
      <ProtocolShell
        domain="sepse"
        title="Modo Sepse"
        subtitle={elapsedStr ? `Aberto há ${elapsedStr}` : 'Protocolo de sepse'}
        onBack={handleSair}
        actions={[{ icon: 'edit', label: 'Anotar', onClick: () => setAnotarOpen(true) }]}
        chips={chips}
        steps={STEPS}
        currentStep={s.telaAtual}
        onStepClick={(n) => s.irParaTela(n)}
        activeTab={s.abaAtual}
        onTabChange={s.setAbaAtual}
        executar={telas[s.telaAtual] || t1}
        historico={historicoView}
        teoria={teoriaView}
        footer={footers[s.telaAtual]}
      />

      <InfoSheet
        open={!!modal}
        onClose={() => setModalId(null)}
        title={modal?.title}
        leadingIcon="i"
      >
        {modal && <SepseModalBody blocks={modal.blocks} />}
      </InfoSheet>

      <AnnotationSheet
        open={anotarOpen}
        onClose={() => setAnotarOpen(false)}
        value={s.anotacao}
        onChange={s.setAnotacao}
        onSave={() => { s.setAnotacaoEditadaEm(new Date().toISOString()); setAnotarOpen(false); }}
      />

      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do protocolo?"
        description="O caso continua aberto neste aparelho · você retoma pelo hub."
        confirmLabel="Sair (mantém aberto)"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />

      <FormSheet
        open={encerrarOpen}
        onClose={() => setEncerrarOpen(false)}
        title="Arquivar caso"
        description="Iniciais do paciente · apoio à memória, sem dados sensíveis (LGPD)."
        saveLabel="Arquivar"
        canSave={iniciais.trim().length > 0}
        onSave={handleEncerrar}
      >
        <InputField label="Iniciais" value={iniciais} onChange={setIniciais} placeholder="ex.: H.G.V." />
      </FormSheet>
    </>
  );
}
