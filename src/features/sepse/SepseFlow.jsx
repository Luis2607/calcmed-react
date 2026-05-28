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
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { DetailRow } from '../../shared/components/molecules/DetailRow/DetailRow';
import { ScoreResult } from '../../shared/components/molecules/ScoreResult/ScoreResult';
import { ScoreRangeTable } from '../../shared/components/molecules/ScoreRangeTable';
import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup/ScoreCriterionGroup';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { SheetSection, SheetDetailRow, SheetText } from '../../shared/components/molecules/sheet';
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
// Título FIXO do container (Luis 2026-05-28): o nome do escore ativo já aparece
// nas ToggleTabs abaixo — duplicar no título do card é redundante. "Escores" deixa
// claro o intent da seção. O InfoButton ao lado continua dinâmico (abre o modal
// descritor do escore atualmente selecionado).
const SCORE_CARD_TITULO = 'Escores';
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
// Versão NEWS — RadioGroup card + description (Luis 2026-05-28: extensão do DS):
// affordance de radio + descrição da recomendação SSC 2026 visível inline.
const NEWS_VERSAO_OPCOES = [
  { value: 'news2', label: 'NEWS2', description: 'Recomendado SSC 2026 · escala 2 SpO₂' },
  { value: 'news', label: 'NEWS', description: 'Versão original 2012' },
];

// Veredito clínico — RadioGroup card + description (Luis 2026-05-28: extensão do DS):
// affordance de radio circle + ramo clínico explícito embaixo.
const VEREDITO_OPCOES = [
  { value: 'definida', label: 'Sepse definida', description: 'ATB em até 1 hora · diagnóstico alternativo muito improvável.' },
  { value: 'provavel', label: 'Sepse provável', description: 'ATB em até 1 hora · diagnóstico alternativo menos provável.' },
  { value: 'possivel', label: 'Sepse possível', description: 'ATB ≤ 1 h se choque; até 3 h se suspeita persistir.' },
  { value: 'improvavel', label: 'Sepse improvável', description: 'Manter investigação · diagnóstico alternativo mais provável.' },
];

// Ramo clínico pós-veredito → footer hint T1 (golden `proximo-hint-t1` · auditoria 2026-05-28).
const VEREDITO_RAMOS = {
  definida: 'ATB em até 1 hora',
  provavel: 'ATB em até 1 hora',
  possivel: 'ATB ≤ 1 h se choque · até 3 h se persistir',
  improvavel: 'Manter investigação · vigilância clínica',
};

// MODAL ID por descritor de cada escore (para info-button do header do bloco)
const SCORE_DESCRITOR_MODAL = {
  sirs: 'descritor-sirs',
  news: 'descritor-news',
  mews: 'descritor-mews',
  sofa: 'descritor-sofa',
};

// §11.T4 · DRUG_INFO — Luis 2026-05-28: tag de papel clínico + subtitle rica +
// InfoButton opcional (só onde há modal específico). Tone de tag varia por escala
// (golden tons calmos pra primário, mais frios pra resgate/refratário).
const DRUG_INFO = {
  ne: {
    linha: '1ª linha',
    tone: 'novo',
    subtitle: 'Acesso venoso calibroso · CVC em até 6 h · titular até PAM alvo. Dose 0,05–3,3 mcg/kg/min.',
    modal: 'o-que-e-ne',
  },
  vaso: {
    linha: '2ª linha',
    tone: 'premium',
    subtitle: 'Após Nora ≥ 0,25 mcg/kg/min. Dose fixa 0,03 U/min IV (não titular).',
    modal: null,
  },
  epi: {
    linha: '3ª linha',
    tone: 'atencao',
    subtitle: 'Choque refratário · considerar com Nora ≥ 0,5 mcg/kg/min. Dose 0,01–0,5 mcg/kg/min.',
    modal: null,
  },
  dob: {
    linha: 'Disfunção cardíaca',
    tone: 'novo',
    subtitle: 'Hipoperfusão com PAM adequada. Dose 2–20 mcg/kg/min.',
    modal: null,
  },
  hidro: {
    linha: 'Refratário',
    tone: 'critico',
    subtitle: 'Choque refratário com Nora ou Adre ≥ 0,25 mcg/kg/min por > 4 h. 200 mg/dia (50 mg 6/6h ou 8 mg/h infusão).',
    modal: 'o-que-e-hidrocortisona',
  },
};

/** Detecção golden 1:1 — critério com ≤3 opções curtas vira alwaysOpen + horizontal. */
function autoBehavior(niveis = []) {
  const totalChars = niveis.reduce((acc, n) => acc + (n.desc?.length || 0), 0);
  const anyTooLong = niveis.some((n) => (n.desc?.length || 0) > 10);
  const alwaysOpen = niveis.length === 2 || niveis.length === 3;
  const optionsLayout =
    alwaysOpen && totalChars <= 24 && !anyTooLong ? 'horizontal' : 'vertical';
  return { alwaysOpen, optionsLayout };
}

/** Acordeão de um escore (SOFA/NEWS/MEWS) via ScoreCriterionGroup (DS). */
function ScoreAccordion({ sistemas, stateObj, onSelect, namePrefix }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className={styles.group}>
      {sistemas.map((sis) => {
        const niveis = sis.niveis || [];
        const { alwaysOpen, optionsLayout } = autoBehavior(niveis);
        return (
          <ScoreCriterionGroup
            key={sis.key}
            systemName={sis.nome}
            parameter={sis.parametro}
            options={niveis.map((n) => ({ label: n.desc, points: n.pts }))}
            value={typeof stateObj[sis.key] === 'number' ? stateObj[sis.key] : null}
            onChange={(idx) => onSelect(sis.key, idx)}
            expanded={expanded === sis.key}
            onToggle={() => setExpanded(expanded === sis.key ? null : sis.key)}
            name={`${namePrefix}-${sis.key}`}
            alwaysOpen={alwaysOpen}
            optionsLayout={optionsLayout}
          />
        );
      })}
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
  const [atbReregisterOpen, setAtbReregisterOpen] = useState(false); // Confirm re-registro ATB

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

  // ====================== Step gates (Gustavo 2026-05-28) ======================
  // Warning stepper: step visitado mas com itens pendentes vira 'warning' (laranja "!").
  // Itens pendentes do step ganham highlight vermelho (ChecklistBlock.highlightPending).
  // §Gustavo · screenshot 2: feedback visual quando user pula sem completar.
  const stepCompleto = {
    1: s.tela1Liberada,           // score preenchido + veredito
    2: s.bundlePH >= 4,            // 4 ações da 1ª hora
    3: !!s.foco,                   // foco infeccioso selecionado
    4: true,                       // sem gate forte (vasopressores opcionais por clínica)
    5: s.metasN >= 5 && s.icuN >= 6, // metas + checklist UTI
  };
  // Estado por step. 'warning' = num < telaAtual OU num <= telaMaxVisitada, e !completo.
  const stepStates = [1, 2, 3, 4, 5].map((num) => {
    if (num === s.telaAtual) return 'active';
    const visitado = num < s.telaAtual || num <= (s.telaMaxVisitada || 1);
    if (visitado) return stepCompleto[num] ? 'completed' : 'warning';
    return 'pending';
  });
  // §11.S6.warn · highlight de itens pendentes persiste enquanto o user já passou pelo step
  // (mesmo que esteja de volta nele — feedback continua até completar).
  const pendenciaT2 = (s.telaMaxVisitada || 1) > 2 && !stepCompleto[2];
  const pendenciaT5 = (s.telaMaxVisitada || 1) >= 5 && !stepCompleto[5] && s.telaAtual !== 5;

  // chips do header (idade/peso + Sepse + bundle% sempre visível a partir de T2 · Nielsen N1)
  const chips = [];
  if (s.idade !== '') chips.push({ label: `${s.idade}a`, mono: true });
  if (s.peso !== '') chips.push({ label: `${s.peso}kg`, mono: true });
  if (sofaTotal >= 2) chips.push({ label: 'Sepse', tone: 'critico' });
  if (s.telaAtual >= 2) chips.push({ label: `Bundle ${bundlePct}%`, mono: true });

  // doses (string → número, com defaults) — clamp em ranges clínicos (Nielsen N3 conselho).
  // Nora 0.01–5 mcg/kg/min · Adre 0.01–1 · Dobuta 1–30. Evita renderizar prescrição absurda
  // se médico digitar dose fora-do-range (UX warning fica no AlertCard "Próximo passo Nora").
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const neNum = (() => { const v = parseNum(s.neDose); return isNaN(v) ? 0.10 : clamp(v, 0.01, 5); })();
  const epiNum = (() => { const v = parseNum(s.epiDose); return isNaN(v) ? 0.05 : clamp(v, 0.01, 1); })();
  const dobNum = (() => { const v = parseNum(s.dobDose); return isNaN(v) ? 5 : clamp(v, 1, 30); })();

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
    // §B1 (P0) · 600ms → 1500ms: feedback do toast precisa ser visto antes de sair da tela.
    setTimeout(() => onBack(), 1500);
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
      caso.classificacao ? `Classificação: ${VEREDITO_OPCOES.find((v) => v.value === caso.classificacao)?.label}` : null,
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
  // NEWS sem o2supl (vira ScoreCriterionGroup binary embaixo) — separa pro accordion
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

      <ClinicalCard
        variant="plain"
        title={SCORE_CARD_TITULO}
        onInfo={() => setModalId(SCORE_DESCRITOR_MODAL[s.scoreAtivo])}
      >
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
          <AlertCard level="info" showIcon>{SCORE_DESCRITORES[s.scoreAtivo]}</AlertCard>
        </div>

        {s.scoreAtivo === 'sirs' && (
          <div className={styles.group}>
            {/* SIRS · cada critério em ScoreCriterionGroup binary (Luis 2026-05-28):
                container consistente com os outros escores, checkbox interno,
                sem chevron, sem body — apenas linha com nome + Checkbox + badge "+1". */}
            {SIRS_ITENS.map((it) => (
              <ScoreCriterionGroup
                key={it.key}
                systemName={it.label}
                binary
                binaryChecked={!!s.sirs[it.key]}
                onBinaryChange={() => s.toggleSirs(it.key)}
                points="+1"
              />
            ))}
          </div>
        )}

        {s.scoreAtivo === 'news' && (
          <div className={styles.group}>
            {/* Versão NEWS · RadioGroup card 1-col + description (Luis 2026-05-28: descrição
                quebrava em 2-col; padrão consistente com Veredito/Foco). */}
            <RadioGroup
              label="Versão"
              name="news-versao"
              options={NEWS_VERSAO_OPCOES}
              value={s.news.versao || 'news2'}
              onChange={(v) => s.setNews({ ...s.news, versao: v })}
              columns={1}
            />
            {/* O₂ suplementar · ScoreCriterionGroup binary (mesma anatomia do SIRS) */}
            <ScoreCriterionGroup
              systemName={newsO2supl.nome}
              binary
              binaryChecked={o2suplChecked}
              onBinaryChange={(next) => {
                s.marcarInicio();
                s.setNews({ ...s.news, o2supl: next ? 1 : null });
              }}
              points={`+${newsO2supl.niveis[1].pts}`}
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
        {/* Veredito · RadioGroup card 1 col + description (extensão DS — Luis 2026-05-28).
            Affordance forte de radio circle + ramo clínico explícito embaixo. */}
        <RadioGroup
          name="veredito"
          options={VEREDITO_OPCOES}
          value={s.classificacao}
          onChange={s.definirVeredito}
          columns={1}
        />
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
    // Hidrocortisona com gate clínico inline (auditoria 2026-05-28 · golden tinha o gate aqui).
    { key: 'hidrocort', label: 'Hidrocortisona 200 mg/dia se Nora ≥ 0,25 mcg/kg/min > 4 h refratária' },
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
            {s.pesoAjustado != null ? (
              <DetailRow label="Peso ajustado" value={`${s.pesoAjustado} kg`} />
            ) : (
              // §F12 auditoria: quando falta sexo/altura, sinaliza ao médico (golden `imc-formula-hint`).
              <AlertCard level="info">
                Informe sexo e altura para usar peso ajustado no cálculo de volume.
              </AlertCard>
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
        highlightPending={pendenciaT2}
        items={bundlePHItems.map((it) => ({ label: it.label, checked: !!s.bundle[it.key] }))}
        onToggle={(i) => {
          const key = bundlePHItems[i].key;
          // §11.T2.6 + §9 auditoria · ATB: 1º clique marca + registra hora;
          // re-clique em ATB JÁ marcado abre ConfirmSheet "atualizar hora?" (paridade golden).
          if (key === 'atb') {
            if (s.bundle.atb) setAtbReregisterOpen(true);
            else s.toggleAtbWithTime();
          } else {
            s.toggleBundle(key);
          }
        }}
      />

      {s.volume ? (
        <AlertCard level="result" title="Cristaloide 30 mL/kg" showValue value={s.volume.volumeMl.toLocaleString('pt-BR')} unit="mL">
          Ringer Lactato · 30 mL/kg em 1-3 h · peso {s.volume.pesoUsado} kg
          {s.pesoAjustado != null && s.numPeso ? ` (ajustado de ${s.numPeso} kg reais)` : ''}.
        </AlertCard>
      ) : (
        <AlertCard level="info" title="Volume aguardando peso">
          Preencha o peso do paciente para calcular o volume de cristaloide (30 mL/kg).
        </AlertCard>
      )}
      {/* §3 auditoria · alerta de individualização e escolha do cristaloide (golden 1:1) */}
      <AlertCard level="warning" title="Individualize">
        Em cardiopatas, DRC, cirróticos e outras comorbidades limitantes — evitar sobrecarga volêmica.
        Ringer Lactato/PlasmaLyte preferidos sobre SF 0,9% (exceto TCE).
      </AlertCard>

      <ChecklistBlock
        tagLabel="Acompanhamento"
        tagTone="novo"
        count={`${s.bundleAC}/5`}
        subtitle="Após a 1ª hora"
        onInfo={() => setModalId('o-que-e-acompanhamento')}
        items={bundleACItems.map((it) => ({ label: it.label, checked: !!s.bundle[it.key] }))}
        onToggle={(i) => s.toggleBundle(bundleACItems[i].key)}
      />

      {/* §G1 conselho · label acompanha o estado (Gabriela): em 100% vira "Bundle completo"
          pra manter coerência visual com a barra verde. */}
      <div className={styles.group}>
        <div className={styles.progressHead}>
          <span className={styles.progressLabel}>{s.bundleFeitos === s.bundleTotal ? 'Bundle completo' : 'Progresso do bundle'}</span>
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
        {/* Foco · RadioGroup card 1-col com description (Luis 2026-05-28).
            Consistência com Veredito T1 e NEWS versão — affordance radio + descrição.
            1-col evita quebra de copy clínica (PAC/abdominal/SNC têm 2 linhas cada). */}
        <RadioGroup
          name="foco-infeccioso"
          options={FOCOS}
          value={s.foco}
          onChange={(v) => s.setFoco(v)}
          columns={1}
        />
      </div>

      {!s.foco && (
        // §13 auditoria · placeholder didático quando ainda sem foco (golden `atb-empty`)
        <AlertCard level="info">
          Selecione o foco infeccioso acima para ver o esquema empírico recomendado.
        </AlertCard>
      )}

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

  const renderDrugCard = (tipo, nome, ativa, painel) => {
    const info = DRUG_INFO[tipo];
    return (
      <ClinicalCard
        state={ativa ? 'ativo' : 'inativo'}
        tags={[{ label: info.linha, tone: info.tone }]}
        title={nome}
        subtitle={info.subtitle}
        onInfo={info.modal ? () => setModalId(info.modal) : undefined}
      >
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
  };

  const t4 = (
    <div className={styles.tela}>
      <StepHeader title="Vasopressores" subtitle="Noradrenalina é 1ª linha. Titule pela PAM alvo." />

      {renderDrugCard('ne', 'Noradrenalina', s.neAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.neDose} onChange={s.setNeDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(ne)}
          <AlertCard level="info" title="Próximo passo">{proximoPassoNE(neNum)}</AlertCard>
        </>
      ))}

      {renderDrugCard('vaso', 'Vasopressina', s.vasoAtiva, (
        <>
          <AlertCard level="result" title="Prescrição — Vasopressina">
            Vasopressina · <span className={styles.destaque}>0,03 U/min IV</span>, dose fixa (não titular).
          </AlertCard>
          <AlertCard level="info" title="Próximo passo">
            Manter dose fixa · reavaliar lactato e enchimento capilar em 2 h.
          </AlertCard>
        </>
      ))}

      {renderDrugCard('epi', 'Adrenalina', s.epiAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.epiDose} onChange={s.setEpiDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(epi)}
        </>
      ))}

      {renderDrugCard('dob', 'Dobutamina', s.dobAtiva, (
        <>
          <InputField label="Dose desejada" type="text" mono inputMode="decimal" value={s.dobDose} onChange={s.setDobDose} showUnit unit="mcg/kg/min" />
          {renderPrescricao(dob)}
        </>
      ))}

      {renderDrugCard('hidro', 'Hidrocortisona', s.hidroAtiva, (
        <>
          <AlertCard level="result" title="Prescrição — Hidrocortisona">
            <span className={styles.destaque}>50 mg IV 6/6h</span> (200 mg/dia) ou 8 mg/h em infusão contínua.
          </AlertCard>
          <AlertCard level="info" title="Próximo passo">
            Manter por 5-7 dias · suspender com desmame de noradrenalina.
          </AlertCard>
        </>
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
        highlightPending={pendenciaT5}
        items={metasItensView.map((it) => ({ label: it.label, checked: !!s.metas[it.key] }))}
        onToggle={(i) => s.toggleMeta(METAS_ITENS[i].key)}
      />

      <ChecklistBlock
        tagLabel="Checklist UTI"
        tagTone="novo"
        count={`${s.icuN}/6`}
        onInfo={() => setModalId('o-que-e-checklist-icu')}
        highlightPending={pendenciaT5}
        items={ICU_ITENS.map((it) => ({ label: it.label, checked: !!s.icu[it.key] }))}
        onToggle={(i) => s.toggleIcu(ICU_ITENS[i].key)}
      />

      <AlertCard level="info" title="Remoção ativa de fluido">
        Após a estabilização, considere balanço hídrico negativo guiado por perfusão.
      </AlertCard>
    </div>
  );

  // ====================== Footers por tela ======================
  // Hint = informação CLÍNICA que NÃO está no botão (Luis 2026-05-28: nunca duplicar).
  // Quando não há info clínica nova, hint=null (footer mostra só o button).
  // Button size='lg'. A partir de T2, botão "Voltar" SECUNDÁRIO ao lado do primary
  // (Luis 2026-05-28 PM: link textual "← Voltar" estava fora do padrão; voltar = botão
  // secondary ao lado do primary, mesmo footer do golden).
  const voltarSecondary = (toTela) => ({ label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(toTela) });
  // §2 auditoria · hint T1 pós-veredito com 4 ramos clínicos (golden `proximo-hint-t1`)
  const hintT1 = s.tela1Liberada
    ? (s.classificacao ? VEREDITO_RAMOS[s.classificacao] : null)
    : (s.total === 0 ? 'Preencher um escore' : 'Dar veredito clínico abaixo');

  // §7 auditoria · skip T3 quando ATB já registrado em T2 (golden `btn-bundle-prox`)
  const atbJaRegistrado = !!s.bundle.atb || !!s.horaAtb;
  const t2Primary = atbJaRegistrado
    ? { label: 'Vasopressores', size: 'lg', onClick: () => s.irParaTela(4) }
    : { label: 'Antibioticoterapia', size: 'lg', onClick: () => s.irParaTela(3) };

  // §11 auditoria · hint T3 com adições MRSA/MDR ativos (golden `atualizarProximoHintT3`)
  const t3HintAtivos = (() => {
    if (!s.foco) return 'Selecionar foco infeccioso';
    const adds = [];
    if (s.mrsaAtivo) adds.push('Vancomicina');
    if (s.mdrAtivo) adds.push('Pip-tazo');
    return adds.length
      ? `Esquema + ${adds.join(' + ')} · prescrever ATB IV`
      : 'Esquema definido · prescrever ATB IV';
  })();

  const footers = {
    1: {
      hint: hintT1,
      primary: { label: 'Iniciar Bundle 1ª hora', size: 'lg', onClick: () => s.irParaTela(2), disabled: !s.tela1Liberada },
    },
    2: {
      secondary: voltarSecondary(1),
      // <4 itens: indica falta concreta. Completos: botão já diz "Antibioticoterapia" / "Vasopressores" — sem hint.
      hint: s.bundlePH < 4 ? `Marcar ${4 - s.bundlePH} ${4 - s.bundlePH === 1 ? 'ação' : 'ações'} da 1ª hora` : null,
      primary: t2Primary,
    },
    3: {
      secondary: voltarSecondary(2),
      hint: t3HintAtivos,
      primary: { label: 'Vasopressores', size: 'lg', onClick: () => s.irParaTela(4), disabled: !s.foco },
    },
    4: {
      secondary: voltarSecondary(3),
      // Hints clínicos FACTUAIS sobre o estado atual da Nora — não imperativos que
      // contradigam o button "Metas de ressuscitação" (Lia L1 conselho 2026-05-28).
      hint: neNum < 0.25 ? 'Titular Nora até PAM ≥ 65 mmHg' : neNum < 0.5 ? 'Nora alta · considere Vasopressina' : 'Refratário · Adre + Hidrocortisona indicadas',
      primary: { label: 'Metas de ressuscitação', size: 'lg', onClick: () => s.irParaTela(5) },
    },
    5: {
      secondary: voltarSecondary(4),
      // Metas incompletas: indica falta. Tudo completo: botão já diz "Encerrar caso" — sem hint.
      hint: s.metasN < 5
        ? `Atingir ${5 - s.metasN} ${5 - s.metasN === 1 ? 'meta' : 'metas'}`
        : s.icuN < 6 ? 'Completar checklist UTI' : null,
      primary: { label: 'Encerrar caso', size: 'lg', onClick: () => setEncerrarOpen(true), variant: 'primary' },
    },
  };

  const telas = { 1: t1, 2: t2, 3: t3, 4: t4, 5: t5 };

  // ====================== Histórico / Teoria ======================
  // §11.H.1 · clicar num caso abre detalhe (replace inline; voltar = back no topo do detalhe).
  // §Luis 2026-05-28: "Limpar Tudo" REMOVIDO da listagem (golden não tem); golden remove caso
  // a caso via botão Excluir dentro do detalhe.
  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;

  // §11.H.2 · Detalhe do caso = body do DetailSheet, montado SÓ com peças DS de sheet
  // (Luis 2026-05-28 PM: PatientDetail dentro do sheet duplicava o header das iniciais —
  // anti-pattern "componente dentro de componente"; Rafael: sheet-pieces são pra body de
  // sheet, PatientDetail é pra tela. Não misturar). Estrutura espelha golden 1:1:
  //   SheetSection "Caso" / "Desfecho clínico" / "Bundle" + Timeline "Linha do tempo"
  //   + Anotação opcional + helper LGPD.
  const renderCasoDetalhe = () => {
    if (!casoAberto) return null;
    const c = casoAberto;
    const veredito = c.classificacao
      ? VEREDITO_OPCOES.find((v) => v.value === c.classificacao)?.label
      : null;
    const focoLabel = c.foco ? (FOCOS.find((f) => f.value === c.foco)?.label || c.foco) : null;
    const horaAtbStr = c.horaAtb
      ? new Date(c.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : null;

    // Timeline · eventos do caso (tag → status)
    const tStart = c.iniciadoEm || null;
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
      events.push({ id: `atb-${c.horaAtb}`, time: offsetHora(c.horaAtb), title: `ATB administrado às ${horaAtbStr}`, status: 'success' });
    }

    const temDesfecho = c.sofa != null || veredito || focoLabel || horaAtbStr;
    const temBundle = typeof c.metasN === 'number' || typeof c.icuN === 'number' || Array.isArray(c.bundleFeitosKeys);

    return (
      <>
        <SheetSection title="Caso">
          <SheetDetailRow label="Encerrado em" value={c.date} />
          <SheetDetailRow label="Duração" value={c.duration} />
          {c.idade && <SheetDetailRow label="Idade" value={`${c.idade} anos`} />}
          {c.peso && <SheetDetailRow label="Peso" value={`${c.peso} kg`} />}
        </SheetSection>

        {temDesfecho && (
          <SheetSection title="Desfecho clínico">
            {c.sofa != null && <SheetDetailRow label="SOFA" value={`${c.sofa} pts`} />}
            {veredito && <SheetDetailRow label="Veredito" value={veredito} />}
            {focoLabel && <SheetDetailRow label="Foco" value={focoLabel} />}
            {horaAtbStr && <SheetDetailRow label="ATB administrado" value={horaAtbStr} />}
          </SheetSection>
        )}

        {temBundle && (
          <SheetSection title="Bundle">
            {typeof c.metasN === 'number' && <SheetDetailRow label="Metas atingidas" value={`${c.metasN}/5`} />}
            {typeof c.icuN === 'number' && <SheetDetailRow label="Checklist UTI" value={`${c.icuN}/6`} />}
            {Array.isArray(c.bundleFeitosKeys) && <SheetDetailRow label="Bundle 1h+acomp" value={`${c.bundleFeitosKeys.length}/9`} />}
          </SheetSection>
        )}

        {events.length > 0 && <Timeline title="Linha do tempo" events={events} />}

        {c.anotacao && (
          <SheetSection title="Anotação">
            <SheetText>{c.anotacao}</SheetText>
          </SheetSection>
        )}

        <SheetText variant="auxiliary">
          Histórico salvo apenas neste aparelho. Não substitui prontuário oficial.
        </SheetText>
      </>
    );
  };

  // Lista só mostra a lista — o detalhe abre via <DetailSheet> abaixo (padrão golden).
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos concluídos neste aparelho."
      cases={historico}
      onCaseClick={(c) => setCasoIdxAberto(historico.indexOf(c))}
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
        { title: 'Escalonamento de vasopressores', sub: 'Nora → Vaso → Adre → Dobuta', onClick: () => setModalId('teoria-vaso') },
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
        stepStates={stepStates}
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
      {/* DetailSheet só com iniciais no header (golden 1:1: "GUSTAVO" sem subtítulo;
          helper LGPD viaja no fim do body como SheetText auxiliary). */}
      <DetailSheet
        open={casoAberto != null}
        onClose={() => setCasoIdxAberto(null)}
        title={casoAberto?.initials || ''}
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

      {/* §9 auditoria · re-registro ATB (golden `confirmarAcao` em `registrarHoraAtb`) */}
      <ConfirmSheet
        open={atbReregisterOpen}
        onClose={() => setAtbReregisterOpen(false)}
        title="ATB já registrado"
        description={s.horaAtb ? `Registro atual: ${new Date(s.horaAtb).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Quer atualizar a hora pra agora?` : 'Atualizar hora pra agora?'}
        confirmLabel="Atualizar hora"
        cancelLabel="Manter atual"
        onConfirm={() => { s.registrarHoraAtb(); }}
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
