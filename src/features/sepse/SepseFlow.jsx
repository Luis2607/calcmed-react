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
import { ToggleField } from '../../shared/components/molecules/ToggleField';
import { InputField } from '../../shared/components/molecules/InputField';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { ToggleTab } from '../../shared/components/molecules/ToggleTab';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { DetailRow } from '../../shared/components/molecules/DetailRow/DetailRow';
import { ScoreResult } from '../../shared/components/molecules/ScoreResult/ScoreResult';
import { ScoreRangeTable } from '../../shared/components/molecules/ScoreRangeTable';
import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup/ScoreCriterionGroup';
import { ScoreCriterion } from '../../shared/components/organisms/ScoreCriterion/ScoreCriterion';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { PatientDetail } from '../../shared/components/organisms/PatientDetail';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { Toast } from '../../shared/components/molecules/Toast';
import { InfoSheet, ConfirmSheet, FormSheet, AnnotationSheet, DetailSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './SepseFlow.module.css';

const STEPS = ['Triagem', '1ª hora', 'ATB', 'Vaso', 'Metas'];
const SCORE_TABS = [
  { value: 'sirs', label: 'SIRS' },
  { value: 'news', label: 'NEWS' },
  { value: 'mews', label: 'MEWS' },
  { value: 'sofa', label: 'SOFA' },
];
const SCORE_TITULO = {
  sirs: 'SIRS · Resposta Inflamatória Sistêmica',
  news: 'NEWS · Early Warning Score',
  mews: 'MEWS · Modified Early Warning',
  sofa: 'SOFA · Sepsis-3',
};
// Interpretação por faixa de pontos (golden statusScoreAtivo → ScoreRangeTable)
const SCORE_FAIXAS = {
  sirs: [
    { points: '0-1', label: 'SIRS improvável' },
    { points: '2', label: 'SIRS presente' },
    { points: '3', label: 'Resposta inflamatória importante' },
    { points: '4', label: 'Resposta inflamatória intensa' },
  ],
  news: [
    { points: '0-4', label: 'Baixo risco de deterioração' },
    { points: '5-6', label: 'Risco moderado · avaliar SOFA' },
    { points: '≥7', label: 'Risco alto · avaliar sepse' },
  ],
  mews: [
    { points: '0-4', label: 'Baixo risco' },
    { points: '≥5', label: 'Risco alto · avaliar SOFA' },
  ],
  sofa: [
    { points: '0', label: 'Aguardando preenchimento' },
    { points: '<2', label: 'Sem disfunção · vigilância' },
    { points: '2-5', label: 'Disfunção · iniciar Bundle 1h' },
    { points: '≥6', label: 'Disfunção grave · Bundle + choque' },
  ],
};
// Versão NEWS — OptionCard 2-col (§2.6: 2 opções com descrição clínica importante).
// A recomendação SSC 2026 fica visível na description sem quebrar o label.
const NEWS_VERSAO_CARDS = [
  { value: 'news2', title: 'NEWS2', description: 'Recomendado SSC 2026 · escala 2 SpO₂' },
  { value: 'news', title: 'NEWS', description: 'Versão original 2012' },
];

// Veredito clínico — OptionCard 1-col com descrição do ramo (§2.6 + conselho unânime).
const VEREDITO_CARDS = [
  { value: 'definida', title: 'Sepse definida', description: 'ATB em até 1 hora · diagnóstico alternativo muito improvável.', tone: 'critical' },
  { value: 'provavel', title: 'Sepse provável', description: 'ATB em até 1 hora · diagnóstico alternativo menos provável.', tone: 'critical' },
  { value: 'possivel', title: 'Sepse possível', description: 'ATB ≤ 1 h se choque; até 3 h se suspeita persistir.', tone: 'warning' },
  { value: 'improvavel', title: 'Sepse improvável', description: 'Manter investigação · diagnóstico alternativo mais provável.', tone: 'default' },
];

// MODAL ID por descritor de cada escore (para info-button do header do bloco)
const SCORE_DESCRITOR_MODAL = {
  sirs: 'descritor-sirs',
  news: 'descritor-news',
  mews: 'descritor-mews',
  sofa: 'descritor-sofa',
};

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
  // Histórico · detalhe + excluir + toast (§11.H da matriz)
  const [casoIdxAberto, setCasoIdxAberto] = useState(null);
  const [excluirIdx, setExcluirIdx] = useState(null);
  const [toast, setToast] = useState(null); // { type, message }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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
      ? VEREDITO_CARDS.find((v) => v.value === s.classificacao)?.title
      : 'Sepse';
    // §11.H · caso salvo com dados ricos pro detalhe (PatientDetail + Timeline)
    const bundleFeitosKeys = Object.keys(s.bundle || {}).filter((k) => s.bundle[k]);
    const novoCaso = {
      id: Date.now().toString(),
      initials: (iniciais || '—').toUpperCase().slice(0, 10),
      date: new Date().toLocaleDateString('pt-BR'),
      iniciadoEm: s.iniciadoEm,
      duration: durationStr,
      duracaoMs: dur,
      status: 'Concluído',
      meta,
      sofa: sofaTotal,
      idade: s.idade,
      peso: s.peso,
      foco: s.foco,
      classificacao: s.classificacao,
      bundleFeitosKeys,
      horaAtb: s.horaAtb,
      metasN: s.metasN,
      icuN: s.icuN,
      anotacao: s.anotacao,
      eventos: s.eventos || [],
    };
    setHistorico([novoCaso, ...historico]);
    setEncerrarOpen(false);
    setIniciais('');
    s.resetProtocol();
    showToast('Caso arquivado', 'success');
    setTimeout(() => onBack(), 600);
  };

  // §11.H.3 · excluir caso (com ConfirmSheet perigo)
  const handleExcluirConfirm = () => {
    if (excluirIdx == null) return;
    const novoHist = historico.filter((_, i) => i !== excluirIdx);
    setHistorico(novoHist);
    setExcluirIdx(null);
    setCasoIdxAberto(null);
    showToast('Caso removido do histórico', 'success');
  };

  // §11.H.4 · compartilhar caso (clipboard + Toast)
  const handleCompartilhar = (caso) => {
    const linhas = [
      'CalcMed · Sepse encerrada',
      `Paciente: ${caso.initials}`,
      caso.classificacao ? `Classificação: ${VEREDITO_CARDS.find((v) => v.value === caso.classificacao)?.title}` : null,
      caso.sofa != null ? `SOFA: ${caso.sofa} pts` : null,
      caso.foco ? `Foco: ${caso.foco}` : null,
      `Duração: ${caso.duration}`,
      `Data: ${caso.date}`,
    ].filter(Boolean).join('\n');
    if (navigator.share) {
      navigator.share({ title: 'Caso Sepse', text: linhas }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(linhas);
      showToast('Resumo copiado', 'success');
    }
  };

  const modal = modalId ? SEPSE_MODAIS[modalId] : null;

  // ====================== T1 · TRIAGEM ======================
  // NEWS sem o2supl (vira ScoreCriterion checkbox embaixo) — separa pro accordion
  const newsAccordionSistemas = NEWS_SISTEMAS.filter((sis) => sis.key !== 'o2supl');
  const newsO2supl = NEWS_SISTEMAS.find((sis) => sis.key === 'o2supl');
  const o2suplChecked = s.news.o2supl === 1;

  const t1 = (
    <div className={styles.tela}>
      <StepHeader
        title="Triagem e classificação"
        subtitle="Escore de screening + veredito clínico. Sepse é diagnóstico clínico."
        onInfo={() => setModalId('o-que-e-sepse')}
      />

      <ClinicalCard variant="plain" title={SCORE_TITULO[s.scoreAtivo]}>
        <div className={styles.group}>
          {/* Sub-tabs SIRS/NEWS/MEWS/SOFA · ToggleTab × 4 (§2.4 · Material 3: tabs comutam vista) */}
          <div className={styles.scoreTabs} role="tablist">
            {SCORE_TABS.map((tab) => (
              <ToggleTab
                key={tab.value}
                label={tab.label}
                active={s.scoreAtivo === tab.value}
                onClick={() => s.setScoreAtivo(tab.value)}
              />
            ))}
          </div>
          <div className={styles.descritorRow}>
            <AlertCard level="info" showIcon>{SCORE_DESCRITORES[s.scoreAtivo]}</AlertCard>
            <InfoButton onClick={() => setModalId(SCORE_DESCRITOR_MODAL[s.scoreAtivo])} size={20} />
          </div>
        </div>

        {s.scoreAtivo === 'sirs' && (
          <div className={styles.group}>
            {SIRS_ITENS.map((it) => (
              <ScoreCriterion
                key={it.key}
                type="checkbox"
                label={it.label}
                points="+1"
                checked={!!s.sirs[it.key]}
                onChange={() => s.toggleSirs(it.key)}
              />
            ))}
          </div>
        )}

        {s.scoreAtivo === 'news' && (
          <div className={styles.group}>
            {/* Versão NEWS · OptionCard 2-col (§2.6: 2 opções com descrição clínica importante) */}
            <SectionLabel>Versão</SectionLabel>
            <div className={styles.versaoGrid}>
              {NEWS_VERSAO_CARDS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  title={opt.title}
                  description={opt.description}
                  selected={(s.news.versao || 'news2') === opt.value}
                  onClick={() => s.setNews({ ...s.news, versao: opt.value })}
                />
              ))}
            </div>
            <ScoreCriterion
              type="checkbox"
              label={newsO2supl.nome}
              points={`+${newsO2supl.niveis[1].pts}`}
              checked={o2suplChecked}
              onChange={(next) => {
                s.marcarInicio();
                s.setNews({ ...s.news, o2supl: next ? 1 : null });
              }}
            />
            <ScoreAccordion sistemas={newsAccordionSistemas} stateObj={s.news} onSelect={s.setNewsNivel} namePrefix="news" />
          </div>
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

        <ScoreRangeTable title="Interpretação" rows={SCORE_FAIXAS[s.scoreAtivo]} />
      </ClinicalCard>

      <AlertCard level="critical" title="Sepse é diagnóstico clínico">
        Nenhum escore isolado decide. Combine o escore com a avaliação clínica e o seu julgamento à beira-leito.
      </AlertCard>

      <div className={styles.group}>
        <div className={styles.progressHead}>
          <SectionLabel>Veredito clínico</SectionLabel>
          <InfoButton onClick={() => setModalId('o-que-e-classificacao')} size={20} />
        </div>
        {/* Veredito · OptionCard 1 col com descrição do ramo clínico (§2.6 · conselho unânime) */}
        <div className={styles.vereditoStack}>
          {VEREDITO_CARDS.map((v) => (
            <OptionCard
              key={v.value}
              title={v.title}
              description={v.description}
              tone={v.tone}
              selected={s.classificacao === v.value}
              onClick={() => s.definirVeredito(v.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // ====================== T2 · BUNDLE 1ª HORA ======================
  const vasopressorLabel = s.numIdade != null && s.numIdade > 65
    ? 'Vasopressor para PAM ≥ 60 mmHg (60-65 em > 65 anos)'
    : 'Vasopressor para PAM ≥ 65 mmHg';

  // ATB com hora embutida (§11.T2.6) — item label dinâmico e onToggle especial
  const horaAtbStr = s.horaAtb
    ? new Date(s.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;
  const atbLabel = horaAtbStr
    ? `Antibiótico IV · registrado às ${horaAtbStr}`
    : 'Antibiótico IV de amplo espectro';

  const bundlePHItems = [
    { key: 'hemocultura', label: 'Hemocultura × 2 (aeróbio + anaeróbio)' },
    { key: 'lactato', label: 'Lactato sérico' },
    { key: 'atb', label: atbLabel },
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
      <StepHeader
        title="Bundle da 1ª hora"
        subtitle="Ações que salvam vidas na primeira hora da sepse."
        onInfo={() => setModalId('o-que-e-bundle')}
      />

      {/* §11.T2.1 + §1.11: card-first · "Paciente" consolida idade+peso+alerta≥65+IMC+sub-grupo obeso */}
      <ClinicalCard variant="plain" title="Paciente">
        <div className={styles.row2}>
          <InputField label="Idade" type="text" mono inputMode="numeric" value={s.idade} onChange={(v) => { s.marcarInicio(); s.setIdade(v); }} placeholder="" showUnit unit="anos" />
          <InputField label="Peso" type="text" mono inputMode="decimal" value={s.peso} onChange={(v) => { s.marcarInicio(); s.setPeso(v); }} placeholder="" showUnit unit="kg" />
        </div>
        {s.numIdade != null && s.numIdade >= 65 && (
          <AlertCard level="info" title="Paciente ≥ 65 anos">
            PAM alvo passa a ser 60 a 65 mmHg (SSC 2026 · alvo permissivo em idoso).
          </AlertCard>
        )}
        {/* §11.T2.2 · ToggleField (linha label + Toggle inline, golden `.toggle-row`) */}
        <ToggleField label="Obeso · IMC ≥ 30 (usar peso ajustado)" checked={s.imcObeso} onChange={s.setImcObeso} />
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

      <ChecklistBlock
        tagLabel="1ª linha"
        tagTone="critico"
        count={`${s.bundlePH}/4`}
        subtitle="Em até 1 hora"
        onInfo={() => setModalId('o-que-e-primeira-hora')}
        items={bundlePHItems.map((it) => ({ label: it.label, checked: !!s.bundle[it.key] }))}
        onToggle={(i) => {
          const key = bundlePHItems[i].key;
          // §11.T2.6 · ATB clicado registra hora (e desmarca limpa) — bom senso golden
          if (key === 'atb') s.toggleAtbWithTime();
          else s.toggleBundle(key);
        }}
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
      <StepHeader
        title="Antibioticoterapia empírica"
        subtitle="Foco + risco MRSA/MDR definem o esquema. ATB IV em ≤ 1 h."
        onInfo={() => setModalId('o-que-e-atb')}
      />

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
          {/* §3.3 da matriz · ChecklistBlock cobre TODA lista de itens com contador
              (bundle clínico OU fatores de risco). Risco MRSA/MDR tem contador n/5 →
              ChecklistBlock, não CheckboxGroup (que é só pra lista sem contador). */}
          <ChecklistBlock
            tagLabel="Risco MRSA"
            tagTone="critico"
            count={`${s.mrsaN}/5`}
            onInfo={() => setModalId('o-que-e-mrsa')}
            items={RISCO_MRSA.map((r) => ({ label: r.label, checked: !!s.riscoMrsa[r.key] }))}
            onToggle={(i) => s.toggleRiscoMrsa(RISCO_MRSA[i].key)}
          />

          <ChecklistBlock
            tagLabel="Risco MDR"
            tagTone="critico"
            count={`${s.mdrN}/5`}
            onInfo={() => setModalId('o-que-e-mdr')}
            items={RISCO_MDR.map((r) => ({ label: r.label, checked: !!s.riscoMdr[r.key] }))}
            onToggle={(i) => s.toggleRiscoMdr(RISCO_MDR[i].key)}
          />

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

  // §11.T4.4 · Prescrição em AlertCard (decisão Luis 2026-05-28: doses ficam em AlertCard).
  // funções de render (NÃO componentes inline — evitam remount/perda de foco no input).
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
      <StepHeader
        title="Metas de ressuscitação"
        subtitle="Avaliação dinâmica + bundle de cuidados intensivos."
        onInfo={() => setModalId('o-que-e-metas')}
      />

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
      onCaseClick={(c) => setCasoIdxAberto(historico.indexOf(c))}
    />
  );

  // §11.H.2 · construção do detalhe (PatientDetail + Timeline) a partir do caso aberto
  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;
  const renderCasoDetalhe = () => {
    if (!casoAberto) return null;
    const c = casoAberto;
    const protocolLabel = c.classificacao
      ? `Sepse · ${VEREDITO_CARDS.find((v) => v.value === c.classificacao)?.title?.toLowerCase() || ''}`
      : 'Sepse';
    const summary = [
      { label: 'Encerrado em', value: c.date },
      { label: 'Duração', value: c.duration },
      ...(c.idade ? [{ label: 'Idade', value: `${c.idade} anos` }] : []),
      ...(c.peso ? [{ label: 'Peso', value: `${c.peso} kg` }] : []),
    ];
    const desfechoRows = [];
    if (c.sofa != null) desfechoRows.push({ label: 'SOFA', value: `${c.sofa} pts` });
    if (c.foco) desfechoRows.push({ label: 'Foco', value: c.foco });
    if (c.horaAtb) desfechoRows.push({ label: 'ATB', value: new Date(c.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) });
    const bundleRows = [];
    if (typeof c.metasN === 'number') bundleRows.push({ label: 'Metas atingidas', value: `${c.metasN}/5` });
    if (typeof c.icuN === 'number') bundleRows.push({ label: 'Checklist ICU', value: `${c.icuN}/6` });
    if (Array.isArray(c.bundleFeitosKeys)) bundleRows.push({ label: 'Bundle 1h+acomp', value: `${c.bundleFeitosKeys.length}/9` });
    const sections = [
      ...(desfechoRows.length ? [{ title: 'Desfecho clínico', rows: desfechoRows }] : []),
      ...(bundleRows.length ? [{ title: 'Bundle', rows: bundleRows }] : []),
    ];

    // Timeline · eventos do caso (tag → status)
    const tStart = c.iniciadoEm || (c.date ? null : null);
    const offsetHora = (ts) => {
      if (!tStart || !ts) return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const diffMin = Math.floor((ts - tStart) / 60000);
      if (diffMin < 60) return `T+${diffMin}min`;
      return `T+${Math.floor(diffMin / 60)}h${String(diffMin % 60).padStart(2, '0')}`;
    };
    const tagToStatus = { veredito: 'success', bundle: 'info', atb: 'success' };
    const events = (c.eventos || []).map((ev, i) => ({
      id: `${ev.hora}-${i}`,
      time: offsetHora(ev.hora),
      title: ev.acao,
      status: tagToStatus[ev.tag] || 'info',
    }));
    if (c.horaAtb) {
      events.push({ id: `atb-${c.horaAtb}`, time: offsetHora(c.horaAtb), title: `ATB administrado às ${new Date(c.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, status: 'success' });
    }

    return (
      <>
        <PatientDetail
          initials={c.initials}
          protocol={protocolLabel}
          status={c.status}
          statusTone="novo"
          summary={summary}
          sections={sections}
        />
        {events.length > 0 && <Timeline title="Linha do tempo" events={events} />}
        {c.anotacao && (
          <AlertCard level="footnote" title="Anotação">
            {c.anotacao}
          </AlertCard>
        )}
      </>
    );
  };

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
        actions={[{ icon: 'edit', label: 'Anotar', onClick: () => setAnotarOpen(true), active: !!s.anotacao?.trim() }]}
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
        onClear={() => { s.setAnotacao(''); s.setAnotacaoEditadaEm(null); }}
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

      {/* §11.H.2 · Detalhe do caso (PatientDetail + Timeline) */}
      <DetailSheet
        open={casoAberto != null}
        onClose={() => setCasoIdxAberto(null)}
        title={casoAberto?.initials || ''}
        description="Caso arquivado · histórico LGPD-compliant deste aparelho"
        footer={casoAberto ? {
          secondary: { label: 'Excluir', variant: 'danger', onClick: () => setExcluirIdx(casoIdxAberto) },
          primary: { label: 'Compartilhar', onClick: () => handleCompartilhar(casoAberto) },
        } : undefined}
      >
        {renderCasoDetalhe()}
      </DetailSheet>

      {/* §11.H.3 · Excluir confirmação (perigo) */}
      <ConfirmSheet
        open={excluirIdx != null}
        onClose={() => setExcluirIdx(null)}
        title="Excluir do histórico?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Manter"
        perigo
        onConfirm={handleExcluirConfirm}
      />

      {/* §11.H.6 · Toast feedback efêmero (auto-dismiss 3.5s) */}
      {toast && (
        <div className={styles.toastWrap}>
          <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
