import { useEffect, useMemo, useRef, useState } from 'react';
import { useCADState } from './hooks/useCADState';
import {
  fmtCronometro, fmtMMSS, fmtHMS, fmtDuracao, formatHora, fmtNum, parseNum,
  labelModo, POTASSIO_OPCOES,
  recomendacaoReaval, recomendacaoKReaval, anionGap, avaliarAG,
  subtituloResolucaoHgt, subtituloResolucaoHco3, subtituloResolucaoAg,
  EDEMA_DIAGNOSTICOS, EDEMA_MAIORES, EDEMA_MENORES, avaliarEdema,
  metaGlicemiaPediatrica, dentroSanity,
  AGUARDO_K_SEGUNDOS, REAVAL_SEGUNDOS, BLOQUEIO_PEDIATRICO_SEGUNDOS,
  HGT_REAVAL_MIN, HGT_REAVAL_MAX,
  IDADE_MAX, PESO_MAX,
} from './cadData';
import { CAD_MODAIS, CadModalBody } from './cadModais';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { Button } from '../../shared/components/atoms/Button';
import { Checkbox } from '../../shared/components/atoms/Checkbox';
import { InputField } from '../../shared/components/molecules/InputField';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { ResultDisplay } from '../../shared/components/molecules/ResultDisplay';
import { SheetSection, SheetDetailRow, SheetText } from '../../shared/components/molecules/sheet';
import { Toast } from '../../shared/components/molecules/Toast';
import { InfoSheet, ConfirmSheet, FormSheet, AnnotationSheet, DetailSheet, SavePatientSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './CADFlow.module.css';

const STEPS = ['Diagnóstico', 'Exames', 'Insulina', 'Controle', 'Alta'];

// tag de evento → status visual da Timeline.
const TAG_STATUS = { confirmado: 'success', k: 'info', insulina: 'success', medida: 'success', resolucao: 'success' };

const nivelAlerta = (nivel) => (nivel === 'critico' ? 'critical' : nivel === 'atencao' ? 'warning' : 'info');

export function CADFlow({ onBack }) {
  const s = useCADState();
  const [historico, setHistorico] = usePersistedState('cad_historico_casos', []);

  // UI local
  const [modalId, setModalId] = useState(null);
  const [anotarOpen, setAnotarOpen] = useState(false);
  const [sairOpen, setSairOpen] = useState(false);
  const [salvarOpen, setSalvarOpen] = useState(false);
  const [sexo, setSexo] = useState(null);
  const [observacoes, setObservacoes] = useState('');
  const [reporKOpen, setReporKOpen] = useState(false);
  const [relancarKOpen, setRelancarKOpen] = useState(false);
  const [relancarKFaixa, setRelancarKFaixa] = useState(null);
  const [medidaOpen, setMedidaOpen] = useState(false);
  const [agOpen, setAgOpen] = useState(false);
  const [edemaOpen, setEdemaOpen] = useState(false);
  const [casoIdxAberto, setCasoIdxAberto] = useState(null);
  const [excluirIdx, setExcluirIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  // form local · lançar reavaliação
  const [medHgtAnterior, setMedHgtAnterior] = useState('');
  const [medHgt, setMedHgt] = useState('');
  const [medInsulina, setMedInsulina] = useState('');
  const [medGaso, setMedGaso] = useState(false);
  const [medPh, setMedPh] = useState('');
  const [medHco3, setMedHco3] = useState('');
  const [medNa, setMedNa] = useState('');
  const [medCl, setMedCl] = useState('');
  const [medK, setMedK] = useState('');
  const [medBohb, setMedBohb] = useState('');
  // form local · calcular AG
  const [agNa, setAgNa] = useState('');
  const [agCl, setAgCl] = useState('');
  const [agHco3, setAgHco3] = useState('');
  // form local · edema
  const [edemaMarcados, setEdemaMarcados] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ====================== timers ======================
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  const elapsedStr = useMemo(
    () => (s.iniciadoEm ? fmtCronometro(now - Number(s.iniciadoEm)) : '00:00'),
    [s.iniciadoEm, now],
  );

  const reavalRestante = s.reavalProximoEm
    ? Math.max(0, Math.round((Number(s.reavalProximoEm) - now) / 1000))
    : REAVAL_SEGUNDOS;
  const aguardoKRestante = s.aguardoKIniciadoEm
    ? Math.max(0, AGUARDO_K_SEGUNDOS - Math.floor((now - Number(s.aguardoKIniciadoEm)) / 1000))
    : AGUARDO_K_SEGUNDOS;
  const bloqueioPedRestante = s.pediatricoFluidosEm
    ? Math.max(0, BLOQUEIO_PEDIATRICO_SEGUNDOS - Math.floor((now - Number(s.pediatricoFluidosEm)) / 1000))
    : 0;
  const bloqueioPedAtivo = s.isPediatric && s.pediatricoFluidosEm && bloqueioPedRestante > 0;

  // toca uma vez quando a reavaliação zera (golden tickCronometro).
  const reavalAvisado = useRef(false);
  useEffect(() => {
    if (s.telaAtual !== 4 || !s.reavalProximoEm) return;
    if (reavalRestante <= 0 && !reavalAvisado.current) {
      reavalAvisado.current = true;
      showToast('Hora da reavaliação. Colete glicemia capilar e gasometria.', 'info');
      s.reiniciarReaval();
    }
    if (reavalRestante > 0) reavalAvisado.current = false;
  }, [reavalRestante, s.telaAtual, s.reavalProximoEm]);

  // seed da resolução ao entrar na T5 (golden preencherTela5).
  const t5Entrou = useRef(false);
  useEffect(() => {
    if (s.telaAtual === 5 && !t5Entrou.current) {
      t5Entrou.current = true;
      s.seedResolucao();
    }
    if (s.telaAtual !== 5) t5Entrou.current = false;
  }, [s.telaAtual]);

  // ====================== chips header ======================
  const chips = [];
  if (s.numIdade != null && s.modo) {
    chips.push({ label: s.modoLabel, tone: s.isCriticalPediatric ? 'critico' : undefined });
    chips.push({ label: `${s.numIdade}a`, mono: true });
    const mostrarPeso = s.numPeso != null && (s.modo !== 'adulto' || (typeof s.telaAtual === 'number' && s.telaAtual >= 3));
    if (mostrarPeso) chips.push({ label: `${s.numPeso}kg`, mono: true });
  }

  // ====================== step states ======================
  const telaNum = s.telaAtual === '2k' ? 2 : s.telaAtual;
  const stepCompleto = {
    1: s.isDiagnosisConfirmed,
    2: s.potassio !== '' && !s.isInsulinBlocked,
    3: s.insulinaIniciada != null,
    4: (s.medidas || []).some((m) => m.hgt != null),
    5: s.resolucaoTodos,
  };
  const stepStates = [1, 2, 3, 4, 5].map((num) => {
    if (num === telaNum) return 'active';
    const visitado = num < telaNum || num <= (s.telaMaxVisitada || 1);
    if (visitado) return stepCompleto[num] ? 'completed' : 'warning';
    return 'pending';
  });

  // ====================== handlers ======================
  const handleSair = () => {
    if (s.iniciadoEm || s.idade || s.peso) setSairOpen(true);
    else onBack();
  };

  const abrirMedida = () => {
    const ultHgt = (s.medidas || []).filter((m) => m.hgt != null).slice(-1)[0];
    setMedHgtAnterior(ultHgt ? String(ultHgt.hgt) : '');
    setMedHgt('');
    // type=number rejeita vírgula; usa ponto decimal no value
    const doseNum = s.doseInsulinaUh != null ? s.doseInsulinaUh : (s.numPeso != null ? s.numPeso * 0.1 : null);
    setMedInsulina(doseNum != null ? Number(doseNum).toFixed(1) : '');
    setMedGaso(false);
    setMedPh(''); setMedHco3(''); setMedNa(''); setMedCl(''); setMedK(''); setMedBohb('');
    setMedidaOpen(true);
  };

  const medRec = recomendacaoReaval({ hgt: medHgt, hgtAnterior: medHgtAnterior, velAtual: medInsulina });
  const medKRec = recomendacaoKReaval(medK);
  const medHgtNum = parseFloat(String(medHgt).replace(',', '.'));
  const medHgtValido = !isNaN(medHgtNum) && medHgtNum >= HGT_REAVAL_MIN && medHgtNum <= HGT_REAVAL_MAX;

  const salvarMedida = () => {
    if (!medHgtValido) return;
    const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
    const medida = { hgt: medHgtNum };
    const vel = num(medInsulina);
    if (vel != null) { medida.insulinaUh = vel; s.setDoseInsulinaUh(vel); }
    if (medGaso) {
      const ph = num(medPh); const hco3 = num(medHco3); const na = num(medNa);
      const cl = num(medCl); const k = num(medK); const bohb = num(medBohb);
      if (ph != null) medida.ph = ph;
      if (hco3 != null) medida.hco3 = hco3;
      if (na != null) medida.na = na;
      if (cl != null) medida.cl = cl;
      if (k != null) medida.k = k;
      if (bohb != null) medida.bohb = bohb;
      if (na != null && cl != null && hco3 != null) medida.ag = na - (cl + hco3);
    }
    s.lancarMedida(medida);
    showToast(medRec ? medRec.titulo : 'Reavaliação lançada', medRec?.nivel === 'critico' ? 'error' : 'success');
    if (medida.k != null && medida.k < 3.5) s.irParaTela('2k');
  };

  const salvarAG = () => {
    const na = parseFloat(String(agNa).replace(',', '.'));
    const cl = parseFloat(String(agCl).replace(',', '.'));
    const hco3 = parseFloat(String(agHco3).replace(',', '.'));
    const ag = anionGap(na, cl, hco3);
    if (ag == null) return;
    s.registrarAG({ na, cl, hco3, ag });
    s.setResolucao((r) => ({ ...r, ag: ag < 12 }));
    showToast(`Ânion gap ${ag.toFixed(0)} mEq/L`);
  };
  const agPreview = anionGap(
    parseFloat(String(agNa).replace(',', '.')),
    parseFloat(String(agCl).replace(',', '.')),
    parseFloat(String(agHco3).replace(',', '.')),
  );

  const toggleEdema = (key) => setEdemaMarcados((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const edemaTratar = avaliarEdema(edemaMarcados, s.isCriticalPediatric);

  const DESFECHO_CAD = 'Alta'; // CAD resolvida → alta (desfecho automático · #7)

  const handleSalvarCaso = () => {
    if (s.iniciais.trim() === '') return;
    const dur = s.iniciadoEm ? Math.max(0, Date.now() - Number(s.iniciadoEm)) : 0;
    const novoCaso = {
      id: Date.now().toString(),
      initials: s.iniciais.toUpperCase().slice(0, 10),
      modo: s.modo,
      idade: s.idade,
      peso: s.peso,
      sexo,
      observacoes,
      desfecho: DESFECHO_CAD,
      date: new Date().toLocaleDateString('pt-BR'),
      duration: fmtDuracao(dur),
      duracaoMs: dur,
      status: DESFECHO_CAD,
      meta: labelModo(s.modo),
      reavaliacoes: (s.medidas || []).filter((m) => m.hgt != null).length,
      eventos: s.eventos || [],
      anotacao: s.anotacao,
    };
    setHistorico([novoCaso, ...historico]);
    s.resetProtocol();
    setSexo(null);
    setObservacoes('');
    showToast('Caso arquivado');
    s.setAbaAtual('historico');
  };

  // Finalizar sem salvar → reset ao estado padrão (ex.: nova PCR no mesmo paciente · #7).
  const handleFinalizarSemSalvar = () => {
    s.resetProtocol();
    setSexo(null);
    setObservacoes('');
    showToast('Protocolo reiniciado');
  };

  const handleExcluirConfirm = () => {
    if (excluirIdx == null) return;
    setHistorico(historico.filter((_, i) => i !== excluirIdx));
    setExcluirIdx(null);
    setCasoIdxAberto(null);
    showToast('Caso removido do histórico');
  };

  const modal = modalId ? CAD_MODAIS[modalId] : null;
  const metaPed = metaGlicemiaPediatrica(s.modo);
  const glicemiaImplausivel = s.glicemia !== '' && !dentroSanity('glicemia', parseFloat(String(s.glicemia).replace(',', '.')));

  // Validação faixa peso e idade (bloquear + erro inline).
  const numIdadeVal = parseNum(s.idade);
  const numPesoVal = parseNum(s.peso);
  const idadeForaFaixa = s.idade !== '' && (!isNaN(numIdadeVal)) && (numIdadeVal <= 0 || numIdadeVal > IDADE_MAX);
  const pesoForaFaixa = s.peso !== '' && (!isNaN(numPesoVal)) && (numPesoVal <= 0 || numPesoVal > PESO_MAX);

  const handleCompartilhar = (c) => {
    const texto = `CalcMed · CAD encerrada\nPaciente: ${c.initials}\nProtocolo: ${labelModo(c.modo)}\nDuração: ${c.duration}\nData: ${c.date}`;
    if (navigator.share) navigator.share({ title: 'Caso CAD', text: texto }).catch(() => {});
    else if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(texto); showToast('Texto do caso copiado'); }
  };

  // ====================== T1 · DIAGNÓSTICO ======================
  const t1 = (
    <div className={styles.tela}>
      <StepHeader title="Diagnóstico" subtitle="Confirme idade, peso e 2 dos 3 critérios da CAD." />

      <ClinicalCard variant="plain" title="Dados de triagem">
        <div className={styles.row2}>
          <InputField
            label="Idade"
            type="number"
            mono
            value={s.idade}
            onChange={s.setIdade}
            placeholder="Ex.: 32"
            unit="anos"
            showUnit
            state={idadeForaFaixa ? 'error' : 'default'}
            helperText={idadeForaFaixa ? `Valor fora da faixa (1–${IDADE_MAX} anos).` : undefined}
          />
          <InputField
            label="Peso"
            type="number"
            mono
            value={s.peso}
            onChange={s.setPeso}
            placeholder="Ex.: 70"
            unit="kg"
            showUnit
            state={pesoForaFaixa ? 'error' : 'default'}
            helperText={pesoForaFaixa ? `Valor fora da faixa (1–${PESO_MAX} kg).` : undefined}
          />
        </div>
      </ClinicalCard>

      {s.isCriticalPediatric && (
        <AlertCard level="critical" title="Emergência pediátrica (< 5a)">
          Alto risco de edema cerebral. Monitore a escala de Glasgow de hora em hora.
        </AlertCard>
      )}
      {s.isPediatric && !s.isCriticalPediatric && (
        <AlertCard level="info" title="Protocolo pediátrico">
          Doses por kg de peso real. Insulina IV inicia 1 hora após os fluidos.
        </AlertCard>
      )}

      <ClinicalCard variant="plain" title="Critérios diagnósticos" subtitle="2 de 3 fecham o diagnóstico." onInfo={() => setModalId('teoria-criterios')}>
        <InputField
          label="Glicemia capilar (HGT)"
          type="number"
          mono
          value={s.glicemia}
          onChange={s.setGlicemia}
          placeholder="Ex.: 350"
          unit="mg/dL"
          showUnit
          state={glicemiaImplausivel ? 'error' : (s.glicemia !== '' && Number(s.glicemia) > 200 ? 'sucesso' : 'default')}
          helperText={glicemiaImplausivel ? 'Valor implausível. Confira a leitura.' : undefined}
        />
        <div className={styles.group}>
          <Checkbox label="Acidose confirmada (pH < 7,30 ou HCO₃ < 18 mEq/L)" checked={s.acidoseConfirmada} onChange={s.setAcidoseConfirmada} />
          <Checkbox label="Cetose confirmada (BOHB ≥ 3 mmol/L ou cetonúria 2+)" checked={s.cetoseConfirmada} onChange={s.setCetoseConfirmada} />
        </div>
      </ClinicalCard>

      {s.isDiagnosisConfirmed && (
        <AlertCard level="result" title="Diagnóstico de CAD fechado">
          Critérios atendidos ({s.criteriosCount}/3). Reposição inicial: {s.soro.titulo}.
        </AlertCard>
      )}
    </div>
  );

  // ====================== T2 · EXAMES + GATE K ======================
  const t2 = (
    <div className={styles.tela}>
      <StepHeader title="Exames e gate do potássio" subtitle="O sódio define o cristaloide; o potássio libera ou bloqueia a insulina." />

      <AlertCard level="info" title="Reposição inicial">
        <strong className={styles.destaque}>{s.soro.titulo}</strong>
        <div className={styles.helper}>{s.soro.detalhe}</div>
      </AlertCard>

      <ClinicalCard variant="plain" title="Sódio sérico (Na)" onInfo={() => setModalId('por-que-sodio')}>
        <InputField
          label="Sódio"
          type="number"
          mono
          value={s.sodio}
          onChange={s.setSodio}
          placeholder="Ex.: 135"
          unit="mEq/L"
          showUnit
          helperText={s.naCorrigido ? `Sódio corrigido ${s.naCorrigido.valorFmt} mEq/L · ${s.naCorrigido.conduta}` : 'Define se o soro será NaCl 0,9% ou 0,45%.'}
        />
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Potássio sérico (K)" subtitle="Escolha a faixa para liberar (ou bloquear) a insulina." onInfo={() => setModalId('por-que-k')}>
        <RadioGroup name="potassio" options={POTASSIO_OPCOES} value={s.potassio} onChange={s.setPotassio} columns={1} />
      </ClinicalCard>

      {s.isInsulinBlocked && (
        <AlertCard level="critical" title={s.gate.titulo}>{s.gate.corpo}</AlertCard>
      )}
      {!s.isInsulinBlocked && s.potassio !== '' && (
        <AlertCard level="result" title={s.gate.titulo}>{s.gate.corpo}</AlertCard>
      )}
    </div>
  );

  // ====================== 2K · AGUARDO KCl ======================
  const t2k = (
    <div className={styles.tela}>
      <StepHeader title="Aguardando reposição de KCl" subtitle="Reavalie o potássio em 2 horas antes de liberar a insulina." />

      <TimerCard
        label="Reavaliar potássio em"
        value={fmtHMS(aguardoKRestante)}
        tone="warning"
        state={aguardoKRestante === 0 ? 'cycle-end' : 'running'}
        progress={(1 - aguardoKRestante / AGUARDO_K_SEGUNDOS) * 100}
        description="Colha novo K ao zerar e toque em Lançar novo K."
      >
        <Button variant="secondary" size="sm" onClick={() => s.setAguardoKIniciadoEm((p) => (p || Date.now()) - 5 * 60 * 1000)}>
          Pular 5 min (dev)
        </Button>
      </TimerCard>

      <AlertCard level="info" title="Prescrição de KCl">
        NaCl 0,9% 1000 mL + KCl 10% 20 mL (40 mEq). Correr em 2 horas.
      </AlertCard>
    </div>
  );

  // ====================== T3 · INSULINA IV ======================
  const t3 = (
    <div className={styles.tela}>
      <StepHeader title="Insulinoterapia IV" subtitle="Infusão contínua de 0,1 UI por kg por hora." />

      {bloqueioPedAtivo && (
        <TimerCard
          label="Liberação da insulina em"
          value={fmtMMSS(bloqueioPedRestante)}
          tone="warning"
          state="running"
          progress={(1 - bloqueioPedRestante / BLOQUEIO_PEDIATRICO_SEGUNDOS) * 100}
          description="Em pediatria, a insulina IV inicia 1 hora após os fluidos, para evitar hiponatremia e edema cerebral."
        >
          <Button variant="secondary" size="sm" onClick={() => s.setPediatricoFluidosEm((p) => (p || Date.now()) - 5 * 60 * 1000)}>
            Pular 5 min (dev)
          </Button>
        </TimerCard>
      )}

      <ResultDisplay value={s.doseUh ?? '0'} unit="U/h" label="Vazão da bomba de infusão" level="success" />

      <ClinicalCard variant="plain" title="Preparo da bomba" onInfo={() => setModalId('o-que-e-dose')}>
        <SheetText>
          Diluir 100 UI de insulina regular em 100 mL de NaCl 0,9% (1 UI/mL). A vazão em mL/h é igual à dose em UI/h.
          {metaPed && <> Meta de glicemia: <strong>{metaPed.min} a {metaPed.max} mg/dL</strong>.</>}
        </SheetText>
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Dose de ataque (opcional)" onInfo={() => setModalId('o-que-e-bolus')}>
        <Checkbox label="Aplicar bolus 0,1 U/kg antes da infusão" checked={s.bolus} onChange={s.setBolus} />
      </ClinicalCard>
    </div>
  );

  // ====================== T4 · CONTROLE HORÁRIO ======================
  const logMedidas = (s.medidas || []).filter((m) => m.hgt != null);
  const t4 = (
    <div className={styles.tela}>
      <StepHeader title="Reavaliação horária" subtitle="Reavalie o HGT a cada hora até a CAD resolver." />

      <TimerCard
        label="Próxima reavaliação"
        value={fmtMMSS(reavalRestante)}
        tone={reavalRestante < 300 ? 'critical' : 'primary'}
        state="running"
        progress={(1 - reavalRestante / REAVAL_SEGUNDOS) * 100}
        description="Colha novo HGT e gasometria ao zerar."
        onInfo={() => setModalId('o-que-e-reavaliacao')}
      >
        <Button variant="secondary" size="sm" onClick={() => s.setReavalProximoEm((p) => (p || Date.now()) - 5 * 60 * 1000)}>
          Pular 5 min (dev)
        </Button>
      </TimerCard>

      {s.isPediatric && (
        <AlertCard level={s.isCriticalPediatric ? 'critical' : 'warning'} title="Vigilância de edema cerebral">
          Principal causa de morte na CAD pediátrica. Avalie sinais a cada hora.
          <div className={styles.group}>
            <Button variant="secondary" onClick={() => { setEdemaMarcados([]); setEdemaOpen(true); }}>Avaliar sinais de alarme</Button>
          </div>
        </AlertCard>
      )}

      {s.insulinaSuspensa && (
        <AlertCard level="critical" title="Infusão suspensa">
          A insulina foi suspensa pela última reavaliação. Siga a conduta indicada antes de retomar.
        </AlertCard>
      )}

      <div>
        <SectionLabel>Log de reavaliações</SectionLabel>
        {logMedidas.length === 0 ? (
          <p className={styles.helper}>Nenhuma reavaliação lançada ainda.</p>
        ) : (
          <div className={styles.logList}>
            {logMedidas.map((m) => (
              <div key={m.hora} className={styles.logItem}>
                <span className={`${styles.logHora} mono`}>{formatHora(m.hora)}</span>
                <span className="mono">HGT {m.hgt} mg/dL</span>
                <span className={`${styles.logInsulina} mono`}>{m.insulinaUh != null ? `${fmtNum(m.insulinaUh)} U/h` : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button variant="secondary" onClick={abrirMedida}>Lançar reavaliação</Button>
    </div>
  );

  // ====================== T5 · RESOLUÇÃO ======================
  const resAuto = s.resolucaoAuto;
  const resCount = (s.resolucao.hgt ? 1 : 0) + (s.resolucao.hco3 ? 1 : 0) + (s.resolucao.ag ? 1 : 0);
  const t5 = (
    <div className={styles.tela}>
      <StepHeader title="Critérios de resolução" subtitle="Os três precisam fechar juntos para encerrar o protocolo." />

      <ClinicalCard variant="plain" title={`Resolução da CAD · ${resCount}/3`} onInfo={() => setModalId('teoria-resolucao')}>
        <div className={styles.criterio}>
          <Checkbox label="Glicemia < 200 mg/dL" checked={s.resolucao.hgt} onChange={() => s.toggleResolucao('hgt')} />
          <span className={styles.criterioSub}>{subtituloResolucaoHgt(resAuto.hgt.ult)}</span>
        </div>
        <div className={styles.criterio}>
          <Checkbox label="HCO₃ ≥ 18 mEq/L ou pH ≥ 7,30" checked={s.resolucao.hco3} onChange={() => s.toggleResolucao('hco3')} />
          <span className={styles.criterioSub}>{subtituloResolucaoHco3(resAuto.hco3.ultHco3, resAuto.hco3.ultPh)}</span>
        </div>
        <div className={styles.criterio}>
          <Checkbox label="Ânion gap < 12 mEq/L" checked={s.resolucao.ag} onChange={() => s.toggleResolucao('ag')} />
          <span className={styles.criterioSub}>{subtituloResolucaoAg(resAuto.ag.ult)}</span>
          <Button variant="secondary" size="sm" onClick={() => { setAgNa(''); setAgCl(''); setAgHco3(''); setAgOpen(true); }}>Calcular ânion gap</Button>
        </div>
      </ClinicalCard>

      {s.isPediatric && (
        <p className={styles.helper}>Critérios pediátricos (ISPAD): BOHB ≤ 1 mmol/L, AG 12 ± 2 mEq/L.</p>
      )}

      {s.resolucaoTodos && (
        <AlertCard level="result" title="CAD resolvida!">
          Todos os critérios fecharam. Libere a transição para insulina SC (primeira dose 1 hora antes de parar a infusão IV).
        </AlertCard>
      )}
    </div>
  );

  const telas = { 1: t1, 2: t2, '2k': t2k, 3: t3, 4: t4, 5: t5 };

  // ====================== footers ======================
  const voltar = (n) => ({ label: 'Voltar', variant: 'secondary', onClick: () => s.irParaTela(n) });
  const footers = {
    1: {
      hint: s.isDiagnosisConfirmed ? null : 'Preencha idade, peso e 2 dos 3 critérios.',
      primary: { label: `Confirmar diagnóstico (${s.criteriosCount}/3)`, onClick: s.confirmarDiagnostico, disabled: !s.isDiagnosisConfirmed, rightIcon: 'chevronRight' },
    },
    2: s.isInsulinBlocked
      ? {
        secondary: voltar(1),
        hint: 'Potássio < 3,5: reponha KCl antes de liberar a insulina.',
        primary: { label: 'Iniciar reposição de KCl', variant: 'danger', onClick: () => setReporKOpen(true) },
      }
      : {
        secondary: voltar(1),
        hint: s.potassio === '' ? 'Escolha a faixa de potássio para liberar a insulina.' : null,
        primary: { label: 'Iniciar insulina', onClick: () => s.irParaTela(3), disabled: s.potassio === '', rightIcon: 'chevronRight' },
      },
    '2k': {
      secondary: voltar(2),
      hint: 'Lance o novo K assim que a reposição terminar.',
      primary: { label: 'Lançar novo K', onClick: () => { setRelancarKFaixa(null); setRelancarKOpen(true); } },
    },
    3: {
      secondary: voltar(2),
      hint: bloqueioPedAtivo ? 'Aguardando 1h pós-fluidos (pediátrico).' : null,
      primary: { label: 'Iniciar infusão', onClick: s.iniciarBomba, disabled: bloqueioPedAtivo, rightIcon: 'chevronRight' },
    },
    4: {
      secondary: voltar(3),
      hint: 'Lance ao menos uma reavaliação antes de fechar.',
      primary: { label: 'Avançar para alta', onClick: () => s.irParaTela(5), rightIcon: 'chevronRight' },
    },
    5: {
      secondary: voltar(4),
      hint: s.resolucaoTodos ? null : 'Marque os 3 critérios — ou finalize mesmo assim.',
      primary: { label: 'Finalizar', onClick: () => setSalvarOpen(true), leftIcon: 'salvar' },
    },
  };

  // ====================== Histórico / Teoria ======================
  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;
  const renderCasoDetalhe = () => {
    if (!casoAberto) return null;
    const c = casoAberto;
    const events = (c.eventos || []).map((ev, i) => ({ id: `${ev.hora}-${i}`, time: formatHora(ev.hora), title: ev.acao, status: TAG_STATUS[ev.tag] || 'info' }));
    return (
      <>
        <SheetSection boxed title="Caso">
          <SheetDetailRow label="Encerrado em" value={c.date} />
          <SheetDetailRow label="Modo" value={labelModo(c.modo)} />
          <SheetDetailRow label="Duração" value={c.duration} />
          <SheetDetailRow label="Reavaliações" value={String(c.reavaliacoes ?? 0)} />
        </SheetSection>
        {events.length > 0 && <Timeline title="Linha do tempo" events={events} />}
        {c.anotacao && (
          <SheetSection boxed title="Anotação"><SheetText>{c.anotacao}</SheetText></SheetSection>
        )}
        <SheetText variant="auxiliary">Histórico salvo apenas neste aparelho. Não substitui prontuário oficial.</SheetText>
      </>
    );
  };

  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos arquivados neste aparelho."
      cases={historico}
      onCaseClick={(c) => setCasoIdxAberto(historico.indexOf(c))}
    />
  );

  const teoriaView = (
    <TheoryScreen
      title="Teoria"
      subtitle="Critérios, doses, fórmulas e condutas · SBD 2025 / UpToDate / ISPAD."
      items={[
        { title: 'Critérios diagnósticos', sub: 'Glicemia · acidose · cetose · 2 de 3 fecham.', onClick: () => setModalId('teoria-criterios') },
        { title: 'Doses padrão', sub: 'Insulina, fluidos, potássio e bicarbonato.', onClick: () => setModalId('teoria-doses') },
        { title: 'Fórmulas úteis', sub: 'Ânion gap, sódio corrigido, osmolaridade.', onClick: () => setModalId('teoria-formulas') },
        { title: 'Resolução e transição', sub: 'Critérios de alta e insulina SC.', onClick: () => setModalId('teoria-resolucao') },
        { title: 'Edema cerebral pediátrico', sub: 'Sinais de alarme e conduta imediata.', onClick: () => setModalId('teoria-edema') },
        { title: 'Glicemia capilar (HGT)', sub: 'HGT/Dextro · CAD euglicêmica.', onClick: () => setModalId('o-que-e-hgt') },
        { title: 'pH venoso', sub: 'Critério de acidose e severidade.', onClick: () => setModalId('o-que-e-ph') },
        { title: 'Cetonemia (BOHB)', sub: 'Critério de cetose e meta de resolução.', onClick: () => setModalId('o-que-e-bohb') },
        { title: 'Por que conferir o potássio', sub: 'Gate de segurança antes da insulina.', onClick: () => setModalId('por-que-k') },
        { title: 'Como funciona a reavaliação', sub: 'Loop horário até a resolução.', onClick: () => setModalId('o-que-e-reavaliacao') },
        { title: 'Como o ajuste é calculado', sub: 'Conduta por velocidade de queda do HGT.', onClick: () => setModalId('como-ajustar-insulina') },
      ]}
    />
  );

  return (
    <>
      <ProtocolShell
        domain="cad"
        title="Modo CAD"
        subtitle={s.iniciadoEm ? `Aberto há ${elapsedStr}` : 'Cetoacidose diabética'}
        timer={s.iniciadoEm ? elapsedStr : undefined}
        onBack={handleSair}
        actions={[{ icon: 'edit', label: 'Anotar', onClick: () => setAnotarOpen(true), active: !!s.anotacao?.trim() }]}
        chips={chips}
        steps={STEPS}
        currentStep={telaNum}
        onStepClick={(n) => { if (n < telaNum) s.irParaTela(n); }}
        stepStates={stepStates}
        activeTab={s.abaAtual}
        onTabChange={s.setAbaAtual}
        executar={telas[s.telaAtual] || t1}
        historico={historicoView}
        teoria={teoriaView}
        footer={footers[s.telaAtual]}
      />

      {/* Modais info / teoria */}
      <InfoSheet open={!!modal} onClose={() => setModalId(null)} title={modal?.title}>
        {modal && <CadModalBody blocks={modal.blocks} />}
      </InfoSheet>

      {/* Anotação */}
      <AnnotationSheet
        open={anotarOpen}
        onClose={() => setAnotarOpen(false)}
        value={s.anotacao}
        onChange={s.setAnotacao}
        onSave={() => { s.setAnotacaoEditadaEm(new Date().toISOString()); setAnotarOpen(false); }}
        onClear={() => { s.setAnotacao(''); s.setAnotacaoEditadaEm(null); }}
      />

      {/* Sair */}
      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do protocolo?"
        description="O CalcMed mantém o protocolo aberto. Você retoma de onde parou pelo hub."
        confirmLabel="Sair (mantém aberto)"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />

      {/* Salvar paciente · bottomsheet padrão (#7) */}
      <SavePatientSheet
        open={salvarOpen}
        onClose={() => setSalvarOpen(false)}
        iniciais={s.iniciais}
        onIniciais={(v) => s.setIniciais(v.toUpperCase())}
        idade={s.idade}
        onIdade={s.setIdade}
        peso={s.peso}
        onPeso={s.setPeso}
        sexo={sexo}
        onSexo={setSexo}
        observacoes={observacoes}
        onObservacoes={setObservacoes}
        desfecho={DESFECHO_CAD}
        onSave={handleSalvarCaso}
        onDiscard={handleFinalizarSemSalvar}
      />

      {/* Repor KCl */}
      <ConfirmSheet
        open={reporKOpen}
        onClose={() => setReporKOpen(false)}
        title="Prescrever reposição de KCl"
        description="NaCl 0,9% 1000 mL + KCl 10% 20 mL (40 mEq), correr em 2 horas. Ao confirmar, inicia o cronômetro de 2h e a reavaliação do potássio."
        confirmLabel="Confirmei a prescrição"
        cancelLabel="Cancelar"
        onConfirm={() => s.confirmarReposicaoK()}
      />

      {/* Relançar K (subtela aguardo) */}
      <FormSheet
        open={relancarKOpen}
        onClose={() => setRelancarKOpen(false)}
        title="Novo potássio"
        description="Em qual faixa caiu o novo exame? Se ficou ≥ 3,5, o CalcMed libera a insulina."
        saveLabel="Salvar resultado"
        canSave={!!relancarKFaixa}
        onSave={() => { if (relancarKFaixa) s.relancarK(relancarKFaixa); }}
      >
        <RadioGroup name="relancar-k" options={POTASSIO_OPCOES} value={relancarKFaixa} onChange={setRelancarKFaixa} columns={1} />
      </FormSheet>

      {/* Lançar reavaliação */}
      <FormSheet
        open={medidaOpen}
        onClose={() => setMedidaOpen(false)}
        title="Lançar reavaliação"
        description="HGT entra a cada 1 hora. Gasometria e eletrólitos a cada 2 a 4 horas."
        saveLabel="Salvar resultado"
        canSave={medHgtValido}
        onSave={salvarMedida}
      >
        <div className={styles.group}>
          <InputField label="HGT anterior" type="number" mono value={medHgtAnterior} onChange={setMedHgtAnterior} placeholder="—" unit="mg/dL" showUnit helperText="Puxado do último registro · edite se foi diferente." />
          <InputField label="HGT atual · agora" type="number" mono value={medHgt} onChange={setMedHgt} placeholder="Ex.: 220" unit="mg/dL" showUnit tagText="obrigatório" state={medHgt !== '' && !medHgtValido ? 'error' : 'default'} helperText="20 a 2000 mg/dL · HGT / Dextro" />
          <InputField label="Insulina rodando agora" type="number" mono value={medInsulina} onChange={setMedInsulina} placeholder="—" unit="U/h" showUnit helperText="Puxado da prescrição · edite se a enfermagem ajustou." />

          {medRec && (
            <AlertCard level={nivelAlerta(medRec.nivel)} title={medRec.titulo}>{medRec.corpo}</AlertCard>
          )}

          <Checkbox label="Lançar também gasometria e eletrólitos" checked={medGaso} onChange={setMedGaso} />
          {medGaso && (
            <div className={styles.group}>
              <div className={styles.row2}>
                <InputField label="pH venoso" type="number" mono value={medPh} onChange={setMedPh} placeholder="Ex.: 7,28" />
                <InputField label="Bicarbonato" type="number" mono value={medHco3} onChange={setMedHco3} placeholder="Ex.: 16" unit="mEq/L" showUnit />
              </div>
              <div className={styles.row2}>
                <InputField label="Sódio (Na)" type="number" mono value={medNa} onChange={setMedNa} placeholder="Ex.: 138" unit="mEq/L" showUnit />
                <InputField label="Cloro (Cl)" type="number" mono value={medCl} onChange={setMedCl} placeholder="Ex.: 105" unit="mEq/L" showUnit />
              </div>
              <div className={styles.row2}>
                <InputField label="Potássio (K)" type="number" mono value={medK} onChange={setMedK} placeholder="Ex.: 4,0" unit="mEq/L" showUnit helperText="K < 3,5 suspende a insulina." />
                <InputField label="BOHB" type="number" mono value={medBohb} onChange={setMedBohb} placeholder="Ex.: 1,2" unit="mmol/L" showUnit />
              </div>
              {medKRec && <AlertCard level="critical" title={medKRec.titulo}>{medKRec.corpo}</AlertCard>}
            </div>
          )}
        </div>
      </FormSheet>

      {/* Calcular ânion gap */}
      <FormSheet
        open={agOpen}
        onClose={() => setAgOpen(false)}
        title="Calcular ânion gap"
        description="AG = Na − (Cl + HCO₃). Critério de resolução: AG < 12 mEq/L."
        saveLabel="Aplicar resultado"
        canSave={agPreview != null}
        onSave={salvarAG}
      >
        <div className={styles.group}>
          <div className={styles.row2}>
            <InputField label="Sódio (Na)" type="number" mono value={agNa} onChange={setAgNa} placeholder="Ex.: 138" unit="mEq/L" showUnit />
            <InputField label="Cloro (Cl)" type="number" mono value={agCl} onChange={setAgCl} placeholder="Ex.: 105" unit="mEq/L" showUnit />
          </div>
          <InputField label="Bicarbonato (HCO₃)" type="number" mono value={agHco3} onChange={setAgHco3} placeholder="Ex.: 18" unit="mEq/L" showUnit />
          {agPreview != null && (
            <ResultDisplay value={agPreview.toFixed(0)} unit="mEq/L" label="Ânion gap" level={agPreview < 12 ? 'success' : 'warning'} />
          )}
          <SheetText variant="auxiliary">{avaliarAG(agPreview).texto}</SheetText>
        </div>
      </FormSheet>

      {/* Edema cerebral (pediátrico) */}
      <FormSheet
        open={edemaOpen}
        onClose={() => setEdemaOpen(false)}
        title="Edema cerebral · sinais de alarme"
        description={s.isCriticalPediatric ? 'Em crianças < 5 anos, 1 maior + 1 menor já gatilha tratamento.' : '1 critério diagnóstico, 2 maiores ou 1 maior + 2 menores gatilham tratamento.'}
        saveLabel="Fechar"
        onSave={() => {}}
      >
        <div className={styles.group}>
          <SectionLabel>Critérios diagnósticos</SectionLabel>
          {EDEMA_DIAGNOSTICOS.map((c) => <Checkbox key={c.key} label={c.label} checked={edemaMarcados.includes(c.key)} onChange={() => toggleEdema(c.key)} />)}
          <SectionLabel>Critérios maiores</SectionLabel>
          {EDEMA_MAIORES.map((c) => <Checkbox key={c.key} label={c.label} checked={edemaMarcados.includes(c.key)} onChange={() => toggleEdema(c.key)} />)}
          <SectionLabel>Critérios menores</SectionLabel>
          {EDEMA_MENORES.map((c) => <Checkbox key={c.key} label={c.label} checked={edemaMarcados.includes(c.key)} onChange={() => toggleEdema(c.key)} />)}
          {edemaTratar && (
            <AlertCard level="critical" title="Tratar agora · NÃO aguardar TC">
              Manitol 20% 0,5 a 1 g/kg IV em 15 min (repetir em 30 min se sem resposta) ou salina 3% 2,5 a 5 mL/kg em 10-15 min. Cabeceira 30°, reduzir fluidos para 2/3 da manutenção, considerar intubação se Glasgow &lt; 8.
            </AlertCard>
          )}
        </div>
      </FormSheet>

      {/* Detalhe do caso (histórico) */}
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

      {/* Excluir caso */}
      <ConfirmSheet
        open={excluirIdx != null}
        onClose={() => setExcluirIdx(null)}
        title="Apagar este caso?"
        description="A ação não pode ser desfeita."
        confirmLabel="Apagar"
        cancelLabel="Manter"
        perigo
        onConfirm={handleExcluirConfirm}
      />

      {toast && (
        <div className={styles.toastWrap}>
          <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
