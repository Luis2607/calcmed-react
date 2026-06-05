import { useEffect, useMemo, useState } from 'react';
import { useAVCState } from './hooks/useAVCState';
import {
  NIHSS_DOMINIOS, NIHSS_TOTAL_PASSOS,
  CINCINNATI_ITENS, CINCINNATI_OPCOES, SINTOMAS_OPCOES,
  CONTRA_ABSOLUTAS, CONTRA_PATOLOGIA, CONTRA_RELATIVAS,
  BYPASS_GATES, PESO_ESTIMATIVAS, TROMBOLITICO_OPCOES,
  DISFAGIA_OPCOES, TROMBEC_VASO_OPCOES, TROMBEC_MRS_OPCOES,
  janelaInfo, janelaMinDe, limitePA, avaliarGlicemia, avaliarTrombectomia,
  paAcima, formatHora, pad2, PA_MONITOR_RANGE,
} from './avcData';
import { AVC_MODAIS, AvcModalBody } from './avcModais';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { Button } from '../../shared/components/atoms/Button';
import { InputField } from '../../shared/components/molecules/InputField';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { SheetSection, SheetDetailRow, SheetText } from '../../shared/components/molecules/sheet';
import { Toast } from '../../shared/components/molecules/Toast';
import { InfoSheet, ConfirmSheet, FormSheet, AnnotationSheet, DetailSheet, SavePatientSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './AVCFlow.module.css';

const STEPS = ['Triagem', 'NIHSS', 'Elegib.', 'Dose', 'Monitor'];

// tag de evento → status visual da Timeline (DS aceita success/info).
const TAG_STATUS = { dose: 'success', nihss: 'success', disfagia: 'success', abertura: 'info' };

export function AVCFlow({ onBack }) {
  const s = useAVCState();
  const [historico, setHistorico] = usePersistedState('avc_historico_casos', []);
  const [histFiltro, setHistFiltro] = useState('todas');

  // UI local
  const [modalId, setModalId] = useState(null);
  const [anotarOpen, setAnotarOpen] = useState(false);
  const [sairOpen, setSairOpen] = useState(false);
  const [bypassOpen, setBypassOpen] = useState(false);
  const [bypassGates, setBypassGates] = useState([]);
  const [janelaConfirmOpen, setJanelaConfirmOpen] = useState(false);
  const [voltarNihssOpen, setVoltarNihssOpen] = useState(false);
  const [paMonitorPas, setPaMonitorPas] = useState('');
  const [paMonitorPad, setPaMonitorPad] = useState('');
  const [paErro, setPaErro] = useState(null);
  const [casoIdxAberto, setCasoIdxAberto] = useState(null);
  const [excluirIdx, setExcluirIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [salvarOpen, setSalvarOpen] = useState(false);
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState(null);

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
    return h > 0 ? `${h}h${pad2(m)}` : `${pad2(m)}:${pad2(sec)}`;
  }, [s.iniciadoEm, now]);

  // Janela VIVA: recomputada do horário de início vs agora (tick de 1s), em vez
  // de um snapshot congelado — numa central tempo-dependente a janela tem de subir
  // sozinha conforme o tempo passa (corrige C1).
  const janelaMin = useMemo(
    () => (s.horarioInicio ? janelaMinDe(s.horarioInicio) : null),
    [s.horarioInicio, now],
  );
  const fora = janelaMin != null && janelaMin > 1440;
  const janela = janelaInfo(janelaMin);

  // ====================== chips header ======================
  const chips = [];
  if (s.hemorragico) chips.push({ label: 'Hemorrágico', tone: 'critico' });
  else if (s.iniciadoEm) chips.push({ label: 'Isquêmico' });
  if (s.nihssTotal > 0) chips.push({ label: `NIHSS ${s.nihssTotal}`, mono: true });
  if (janelaMin != null) chips.push({ label: `Janela ${Math.floor(janelaMin / 60)}h${pad2(janelaMin % 60)}`, mono: true });

  // ====================== step states ======================
  const stepCompleto = {
    1: s.cincinnatiRespondidos >= 3 || s.bypassUsado,
    2: Object.keys(s.nihssScores).length >= NIHSS_TOTAL_PASSOS || s.bypassUsado,
    3: true,
    4: s.doseTotal != null || s.hemorragico,
    5: s.iniciais.trim().length >= 2 && s.disfagia && s.disfagia !== 'nao-feito',
  };
  const stepStates = [1, 2, 3, 4, 5].map((num) => {
    if (num === s.telaAtual) return 'active';
    const visitado = num < s.telaAtual || num <= (s.telaMaxVisitada || 1);
    if (visitado) return stepCompleto[num] ? 'completed' : 'warning';
    return 'pending';
  });

  // ====================== handlers ======================
  const handleSair = () => {
    const temDados = s.iniciadoEm || s.sintomasPresenciado || s.cincinnatiRespondidos > 0;
    if (temDados) setSairOpen(true);
    else onBack();
  };

  const confirmarTriagem = () => { s.registrarEvento('Triagem confirmada', 't1'); s.irParaTela(2); };

  const toggleBypassGate = (i) => {
    const key = BYPASS_GATES[i].value;
    setBypassGates((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };
  const confirmarBypass = () => {
    s.marcarInicio();
    s.setBypassUsado(true);
    s.registrarEvento('Bypass · médico confirmou os 4 gates (DOAC/sangramento/PA/HGT)', 'bypass');
    setBypassOpen(false);
    setBypassGates([]);
    s.irParaTela(4);
  };

  const nihssDom = NIHSS_DOMINIOS[s.nihssDominio - 1];
  const nihssAvancarOuConcluir = () => {
    if (s.nihssDominio === NIHSS_TOTAL_PASSOS) {
      s.registrarEvento(`NIHSS: ${s.nihssTotal} pontos`, 'nihss');
      s.irParaTela(3);
      return;
    }
    s.nihssAvancar();
  };

  const confirmarElegibilidade = () => { s.registrarEvento('Elegibilidade confirmada · avanço pra dose', 't3'); s.irParaTela(4); };

  const confirmarDose = () => {
    if (s.hemorragico) {
      // sem trombólise no hemorrágico — segue direto pro monitoramento (PA agressiva)
      s.registrarEvento('Conduta hemorrágica · sem trombólise · monitoramento de PA', 'hemorragico');
      s.irParaTela(5);
      return;
    }
    const nome = s.trombolitico === 'tnk' ? 'TNK' : 'Alteplase';
    if (janelaMin != null && janelaMin > 270 && !s.janelaConfirmada) {
      setJanelaConfirmOpen(true);
      return;
    }
    s.registrarEvento(`Dose ${nome}: ${s.doseTotal} mg`, 'dose');
    s.irParaTela(5);
  };
  const confirmarJanelaEstendida = () => {
    s.setJanelaConfirmada(true);
    const nome = s.trombolitico === 'tnk' ? 'TNK' : 'Alteplase';
    s.registrarEvento(`Janela estendida confirmada · perfusão/RM avaliada`, 'janela');
    s.registrarEvento(`Dose ${nome}: ${s.doseTotal} mg`, 'dose');
    setJanelaConfirmOpen(false);
    s.irParaTela(5);
  };

  const handleRegistrarPA = () => {
    const pasV = parseInt(paMonitorPas, 10);
    const padV = parseInt(paMonitorPad, 10);
    if (isNaN(pasV) || isNaN(padV)) { setPaErro('Preencha PAS e PAD para registrar.'); return; }
    if (pasV < PA_MONITOR_RANGE.pasMin || pasV > PA_MONITOR_RANGE.pasMax || padV < PA_MONITOR_RANGE.padMin || padV > PA_MONITOR_RANGE.padMax) {
      setPaErro(`Valor incomum (${pasV}/${padV}). PAS aceita 60-260, PAD 30-160. Verifique a digitação.`);
      return;
    }
    setPaErro(null);
    s.registrarPA(pasV, padV);
    setPaMonitorPas('');
    setPaMonitorPad('');
    showToast('PA registrada');
  };

  const disfagiaOk = s.disfagia && s.disfagia !== 'nao-feito';
  const desfechoAvc = s.doseTotal
    ? `${s.trombolitico === 'tnk' ? 'TNK' : 'Alteplase'} ${s.doseTotal} mg`
    : (s.hemorragico ? 'Hemorrágico · sem trombólise' : 'Sem trombólise');

  const handleFinalizar = () => {
    const dur = s.iniciadoEm ? Math.max(0, Date.now() - Number(s.iniciadoEm)) : 0;
    const h = Math.floor(dur / 3600000);
    const m = Math.floor((dur % 3600000) / 60000);
    const durationStr = h > 0 ? `${h}h ${pad2(m)}min` : `${m} min`;
    const meta = desfechoAvc;
    const novoCaso = {
      id: Date.now().toString(),
      initials: (s.iniciais || '—').toUpperCase().slice(0, 10),
      date: new Date().toLocaleDateString('pt-BR'),
      iniciadoEm: s.iniciadoEm,
      duration: durationStr,
      duracaoMs: dur,
      status: 'Concluído',
      meta,
      desfecho: meta,
      idade,
      sexo,
      nihss: s.nihssTotal,
      janelaMin: janelaMin,
      peso: s.peso,
      trombolitico: s.trombolitico,
      doseTotal: s.doseTotal,
      cincinnati: { ...s.cincinnati },
      disfagia: s.disfagia,
      hemorragico: s.hemorragico,
      glicemia: s.glicemia,
      anotacao: s.anotacao,
      eventos: s.eventos || [],
    };
    setHistorico([novoCaso, ...historico]);
    s.resetProtocol();
    setIdade('');
    setSexo(null);
    showToast('Caso arquivado', 'success');
    s.setAbaAtual('historico');
  };

  // Finalizar sem salvar → reset ao estado padrão (#7).
  const handleFinalizarSemSalvar = () => {
    s.resetProtocol();
    setIdade('');
    setSexo(null);
    showToast('Protocolo reiniciado');
  };

  const handleExcluirConfirm = () => {
    if (excluirIdx == null) return;
    setHistorico(historico.filter((_, i) => i !== excluirIdx));
    setExcluirIdx(null);
    setCasoIdxAberto(null);
    showToast('Caso removido do histórico', 'success');
  };

  const modal = modalId ? AVC_MODAIS[modalId] : null;

  // ====================== T1 · TRIAGEM ======================
  const t1 = (
    <div className={styles.tela}>
      <StepHeader title="Triagem" subtitle="Confirme o horário de início e aplique Cincinnati." />

      <ClinicalCard variant="plain" title="Início dos sintomas" subtitle="Foi presenciado? Quando começou?" onInfo={() => setModalId('por-que-horario')}>
        <RadioGroup
          name="sintomas-presenciado"
          options={SINTOMAS_OPCOES}
          value={s.sintomasPresenciado}
          onChange={s.setSintomasPresenciado}
          columns={1}
        />
        {s.sintomasPresenciado && (
          <div className={styles.group}>
            <InputField
              label={s.sintomasPresenciado === 'sim' ? 'Horário do início' : 'Última vez visto normal (usaremos como início)'}
              value={s.horarioInicio}
              onChange={s.setHorarioInicio}
              placeholder="HH:MM"
              inputMode="numeric"
              maxLength={5}
              mono
              showUnit
              unit="hoje"
            />
            <span className={styles.janelaHelper}>{janela.texto}</span>
            {s.sintomasPresenciado === 'nao' && (
              <Button variant="secondary" onClick={() => setModalId('wake-up-info')}>
                Sobre wake-up · RM DWI-FLAIR pode estender até 9h
              </Button>
            )}
          </div>
        )}
      </ClinicalCard>

      <ClinicalCard
        variant="plain"
        title="Escala de Cincinnati"
        subtitle="Marque Alterado para cada sinal com assimetria ou déficit. Um sinal alterado já abre o Código AVC."
        onInfo={() => setModalId('cincinnati-info')}
      >
        {CINCINNATI_ITENS.map((item) => (
          <div key={item.key} className={styles.cincinnatiItem}>
            <span className={styles.cincinnatiTitulo}>{item.titulo}</span>
            <span className={styles.cincinnatiHelper}>{item.helper}</span>
            <Segmented
              options={CINCINNATI_OPCOES}
              value={s.cincinnati[item.key]}
              onChange={(v) => s.setCincinnatiItem(item.key, v)}
              block
            />
          </div>
        ))}
      </ClinicalCard>

      {s.cincinnatiAlterados >= 1 && !fora && (
        <AlertCard level="critical" title="Código AVC · Acione agora">
          Encaminhe pra TC de crânio sem contraste imediatamente. Colete laboratórios em paralelo, acione neurologia.
        </AlertCard>
      )}
      {s.cincinnatiAlterados >= 1 && !fora && (
        <div className={styles.tcGate}>
          <SectionLabel>Resultado da TC sem contraste</SectionLabel>
          <Segmented
            block
            value={s.tcResultado}
            onChange={s.definirTcResultado}
            options={[
              { value: 'isquemico', label: 'Isquêmico' },
              { value: 'hemorragico', label: 'Hemorrágico' },
            ]}
          />
          {s.hemorragico && (
            <AlertCard level="critical" title="AVC hemorrágico — abortar trombólise">
              Trombólise e trombectomia contraindicadas. Meta de PA agressiva (ver Monitor), reverter
              anticoagulação se em uso e acionar neurocirurgia.
            </AlertCard>
          )}
        </div>
      )}
      {fora && (
        <AlertCard level="info" title="Fora de janela aguda">
          Sintomas &gt; 24h não são candidatos a trombólise aguda. Siga avaliação neurológica eletiva e ABCD² se déficit transitório.
        </AlertCard>
      )}
    </div>
  );

  // ====================== T2 · NIHSS ======================
  const t2 = (
    <div className={styles.tela}>
      <StepHeader title="NIHSS" subtitle="Aplique os 15 itens da escala na ordem oficial." />

      <ClinicalCard variant="plain" title={nihssDom.titulo} onInfo={() => setModalId(`nihss-info-${nihssDom.id}`)}>
        <div className={styles.group}>
          <div className={styles.nihssStepperInfo}>
            <span className={styles.nihssPasso}>Passo {nihssDom.num} de {NIHSS_TOTAL_PASSOS}</span>
            <span className={styles.nihssDominioNome}>{s.nihssTotal} pts parciais</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${(s.nihssDominio / NIHSS_TOTAL_PASSOS) * 100}%` }} />
          </div>
          <span className={styles.cincinnatiHelper}>{nihssDom.helper}</span>
          <RadioGroup
            name={`nihss-${nihssDom.id}`}
            options={nihssDom.opcoes.map((o, i) => ({ value: i, label: `${o.un ? '—' : `${o.v} ·`} ${o.l}` }))}
            value={typeof s.nihssScores[nihssDom.id] === 'number' ? s.nihssScores[nihssDom.id] : null}
            onChange={(idx) => s.setNihssIdx(nihssDom.id, idx)}
            columns={1}
          />
        </div>
      </ClinicalCard>

      <div className={styles.parcial}>
        <span className={styles.parcialLabel}>Parcial NIHSS</span>
        <span className={styles.parcialValor}>{s.nihssTotal}</span>
      </div>
    </div>
  );

  // ====================== T3 · ELEGIBILIDADE ======================
  const el = s.elegibilidade;
  const t3 = (
    <div className={styles.tela}>
      <StepHeader title="Elegibilidade" subtitle="Marque contraindicações e confirme a pressão arterial." />

      <ChecklistBlock
        tagLabel="Histórico recente e DOAC"
        tagTone="critico"
        count={`${s.contras.absolutas.length}/${CONTRA_ABSOLUTAS.length}`}
        items={CONTRA_ABSOLUTAS.map((c) => ({ label: c.label, checked: s.contras.absolutas.includes(c.key) }))}
        onToggle={(i) => s.toggleContra('absolutas', CONTRA_ABSOLUTAS[i].key)}
      />
      <ChecklistBlock
        tagLabel="Patologia cerebral prévia"
        tagTone="critico"
        count={`${s.contras.patologia.length}/${CONTRA_PATOLOGIA.length}`}
        items={CONTRA_PATOLOGIA.map((c) => ({ label: c.label, checked: s.contras.patologia.includes(c.key) }))}
        onToggle={(i) => s.toggleContra('patologia', CONTRA_PATOLOGIA[i].key)}
      />
      <ChecklistBlock
        tagLabel="Cirurgia, IAM e gestação"
        tagTone="novo"
        count={`${s.contras.relativas.length}/${CONTRA_RELATIVAS.length}`}
        items={CONTRA_RELATIVAS.map((c) => ({ label: c.label, checked: s.contras.relativas.includes(c.key) }))}
        onToggle={(i) => s.toggleContra('relativas', CONTRA_RELATIVAS[i].key)}
      />

      <ClinicalCard variant="plain" title="Pressão arterial atual" subtitle="Pré-trombólise: limite 185/110 mmHg. Se acima, baixe antes." onInfo={() => setModalId('pa-gate-info')}>
        <div className={styles.row2}>
          <InputField label="Sistólica" value={s.pas} onChange={s.setPas} placeholder="Ex.: 170" inputMode="numeric" maxLength={3} mono showUnit unit="mmHg" />
          <InputField label="Diastólica" value={s.pad} onChange={s.setPad} placeholder="Ex.: 100" inputMode="numeric" maxLength={3} mono showUnit unit="mmHg" />
        </div>
        {paAcima(s.numPas, s.numPad) && (
          <AlertCard level="warning" title="PA acima do limite">
            Reduza a PA abaixo de 185/110 antes da trombólise. Inicie Nitroprussiato de Sódio IV ou Labetalol.
          </AlertCard>
        )}
      </ClinicalCard>

      {el.blocked ? (
        <AlertCard level="critical" title="Inelegível para trombólise IV">{el.motivo}</AlertCard>
      ) : el.doacIncerto ? (
        <AlertCard level="warning" title="Elegibilidade pendente · checar labs">
          Solicite TTPa, TP e anti-Xa antes de prosseguir. Só inicie trombólise se exames normais ou após reversor específico.
        </AlertCard>
      ) : (
        <AlertCard level="result" title="Elegível para trombólise IV">
          Avance para a dose. Tenecteplase (TNK) é o trombolítico preferencial pela diretriz AHA/ASA 2026.
        </AlertCard>
      )}
    </div>
  );

  // ====================== T4 · POSOLOGIA ======================
  const dose = s.dose;
  const t4 = (
    <div className={styles.tela}>
      <StepHeader title="Terapia de Reperfusão" subtitle="Confirme o peso e escolha o trombolítico." />

      {s.hemorragico && (
        <AlertCard level="critical" title="Trombólise contraindicada — AVC hemorrágico">
          Não administrar trombolítico nem indicar trombectomia. Siga para o monitoramento: meta de PA
          agressiva, reversão de anticoagulação e neurocirurgia.
        </AlertCard>
      )}

      {s.bypassUsado && (
        <AlertCard level="warning" title="Atalho de dose ativo">
          Você pulou NIHSS e contraindicações. Antes de administrar, revise.
          <div className={styles.group}>
            <Button variant="secondary" onClick={() => s.irParaTela(3)}>Revisar contraindicações</Button>
          </div>
        </AlertCard>
      )}

      <ClinicalCard variant="plain" title="Peso do paciente" onInfo={() => setModalId('peso-info')}>
        <InputField
          value={s.peso}
          onChange={s.setPesoManual}
          placeholder="Ex.: 75"
          inputMode="decimal"
          maxLength={5}
          mono
          showUnit
          unit="kg"
          state={s.numPeso != null && !s.pesoValido ? 'error' : 'default'}
          helperText={s.numPeso != null && !s.pesoValido ? 'Valor fora da faixa permitida. Insira entre 10 kg e 250 kg.' : undefined}
        />
        <div className={styles.group}>
          <SectionLabel>Sem peso? Estimar:</SectionLabel>
          <div className={styles.pesoChips}>
            {PESO_ESTIMATIVAS.map((p) => (
              <Button key={p.biotipo} variant="secondary" onClick={() => s.setPesoPorBiotipo(p.peso, p.biotipo)}>
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Trombolítico" onInfo={() => setModalId('tnk-vs-alteplase')}>
        <RadioGroup
          name="trombolitico"
          options={TROMBOLITICO_OPCOES}
          value={s.trombolitico}
          onChange={s.setTrombolitico}
          columns={1}
        />
      </ClinicalCard>

      {dose && (
        <AlertCard level="result" title={dose.nome} showValue value={dose.valorFmt} unit="mg">
          {dose.modo}
          {dose.detalhe && (
            <div className={styles.group}>
              {dose.detalhe.map((d, i) => (
                <div key={i} className={styles.doseSplit}>
                  <span className={styles.doseSplitLabel}>{d.label}</span>
                  <span className={styles.doseSplitValor}><span className={styles.destaque}>{d.valor}</span> {d.sufixo}</span>
                </div>
              ))}
            </div>
          )}
          {dose.capada && <div className={styles.cincinnatiHelper}>{dose.badge}</div>}
          {s.pesoEstimado && <div className={styles.cincinnatiHelper}>Peso estimado · confirme assim que possível.</div>}
        </AlertCard>
      )}
    </div>
  );

  // ====================== T5 · MONITORAMENTO ======================
  const lim = limitePA({ hemorragico: s.hemorragico, doseTotal: s.doseTotal });
  const glic = avaliarGlicemia(s.glicemia !== '' ? parseInt(s.glicemia, 10) : null);
  const eventosTimeline = (s.eventos || []).map((ev, i) => ({
    id: `${ev.hora}-${i}`,
    time: formatHora(ev.hora),
    title: ev.acao,
    status: TAG_STATUS[ev.tag] || 'info',
  }));
  const t5 = (
    <div className={styles.tela}>
      <StepHeader title="Monitoramento" subtitle="Acompanhe PA, glicemia e deglutição nas primeiras 24h." />

      <ClinicalCard variant="plain" title="Meta PA" onInfo={() => setModalId('pa-meta-info')}>
        <div className={styles.parcial}>
          <span className={styles.destaque}>{s.meta.valor}</span>
        </div>
        <span className={styles.cincinnatiHelper}>{s.meta.modo}</span>
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Registrar PA agora">
        <div className={styles.row2}>
          <InputField label="Sistólica" value={paMonitorPas} onChange={setPaMonitorPas} placeholder="—" inputMode="numeric" maxLength={3} mono showUnit unit="mmHg" />
          <InputField label="Diastólica" value={paMonitorPad} onChange={setPaMonitorPad} placeholder="—" inputMode="numeric" maxLength={3} mono showUnit unit="mmHg" />
        </div>
        <Button variant="secondary" onClick={handleRegistrarPA}>Registrar</Button>
        {paErro && <AlertCard level="warning">{paErro}</AlertCard>}
        {s.paAfericoes.length > 0 && (
          <div className={styles.paHistorico}>
            {s.paAfericoes.slice().reverse().slice(0, 5).map((a, i) => {
              const acima = a.pas > lim.pas || a.pad > lim.pad;
              return (
                <div key={i} className={[styles.paHistoricoItem, acima ? styles.paHistoricoItemAcima : ''].filter(Boolean).join(' ')}>
                  <span>{formatHora(a.hora)}</span>
                  <span>{a.pas}/{a.pad}</span>
                </div>
              );
            })}
          </div>
        )}
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Glicemia capilar" subtitle="Meta 140-180 mg/dL." onInfo={() => setModalId('glicemia-info')}>
        <InputField value={s.glicemia} onChange={s.setGlicemia} placeholder="Ex.: 150" inputMode="numeric" maxLength={3} mono showUnit unit="mg/dL" />
        {glic && <AlertCard level="warning" title={glic.titulo}>{glic.corpo}</AlertCard>}
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Teste de deglutição" subtitle="50 mL de água. Tossiu, engasgou ou voz molhada = dieta zero." onInfo={() => setModalId('disfagia-info')}>
        <RadioGroup name="disfagia" options={DISFAGIA_OPCOES} value={s.disfagia} onChange={s.definirDisfagia} columns={1} />
      </ClinicalCard>

      {eventosTimeline.length > 0 && <Timeline title="Linha do tempo" events={eventosTimeline} />}
    </div>
  );

  // ====================== T6 · TROMBECTOMIA (desvio) ======================
  const trombec = avaliarTrombectomia({ vaso: s.trombecVaso, aspects: s.numAspects, mrs: s.trombecMRS, nihss: s.nihssTotal });
  const t6 = (
    <div className={styles.tela}>
      <StepHeader title="Trombectomia mecânica" subtitle="Desvio · trombólise contraindicada. Avalie critérios AHA/ASA 2026 expandidos." />

      <ClinicalCard variant="plain" title="Oclusão de grande vaso confirmada na angioTC?">
        <RadioGroup name="trombec-vaso" options={TROMBEC_VASO_OPCOES} value={s.trombecVaso} onChange={s.setTrombecVaso} columns={1} />
      </ClinicalCard>

      <ClinicalCard variant="plain" title="ASPECTS na TC sem contraste (0 a 10)">
        <InputField value={s.trombecAspects} onChange={s.setTrombecAspects} placeholder="Ex.: 8" inputMode="numeric" maxLength={2} mono showUnit unit="pts" helperText="≥ 6 padrão · 0-5 expandido (SELECT2/ANGEL-ASPECT)." />
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Rankin modificado (mRS) prévio">
        <RadioGroup name="trombec-mrs" options={TROMBEC_MRS_OPCOES} value={s.trombecMRS} onChange={s.setTrombecMRS} columns={1} />
      </ClinicalCard>

      {trombec && <AlertCard level="info" title={trombec.titulo}>{trombec.corpo}</AlertCard>}
    </div>
  );

  const telas = { 1: t1, 2: t2, 3: t3, 4: t4, 5: t5, 6: t6 };

  // ====================== footers por tela ======================
  const voltar = (n) => ({ label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(n) });

  const footers = {
    1: {
      hint: 'Use "Pular pra dose" só se neurologista já avaliou NIHSS à beira-leito.',
      secondary: { label: 'Pular pra dose', variant: 'secondary', size: 'lg', onClick: () => setBypassOpen(true) },
      primary: { label: 'Aplicar NIHSS', size: 'lg', onClick: confirmarTriagem, disabled: s.cincinnatiRespondidos < 3 },
    },
    2: {
      secondary: { label: 'Voltar', variant: 'secondary', size: 'lg', disabled: s.nihssDominio === 1, onClick: () => setVoltarNihssOpen(true) },
      hint: s.nihssScores[nihssDom.id] == null ? 'Pontue este item para avançar' : null,
      primary: {
        label: s.nihssDominio === NIHSS_TOTAL_PASSOS ? 'Concluir NIHSS' : 'Avançar',
        size: 'lg',
        onClick: nihssAvancarOuConcluir,
        disabled: s.nihssScores[nihssDom.id] == null,
      },
    },
    3: el.blocked
      ? {
        secondary: voltar(2),
        hint: 'Trombólise contraindicada · avaliar trombectomia mecânica',
        primary: { label: 'Avaliar Trombectomia', size: 'lg', onClick: () => s.irParaTela(6) },
      }
      : {
        secondary: voltar(2),
        hint: paAcima(s.numPas, s.numPad) ? 'Reduza a PA abaixo de 185/110 antes de avançar.' : null,
        primary: { label: 'Calcular dose', size: 'lg', onClick: confirmarElegibilidade, disabled: paAcima(s.numPas, s.numPad) },
      },
    4: {
      secondary: voltar(3),
      hint: s.pesoEstimado ? 'Peso estimado · confirme assim que possível' : null,
      primary: { label: 'Iniciar monitoramento', size: 'lg', onClick: confirmarDose, disabled: s.doseTotal == null && !s.hemorragico },
    },
    5: {
      secondary: voltar(4),
      hint: disfagiaOk ? null : 'Teste de deglutição é obrigatório antes de finalizar.',
      primary: { label: 'Finalizar', size: 'lg', onClick: () => setSalvarOpen(true), disabled: !disfagiaOk },
    },
    6: {
      secondary: voltar(3),
      primary: { label: 'Registrar e ir ao monitoramento', size: 'lg', onClick: () => s.irParaTela(5) },
    },
  };

  // ====================== Histórico / Teoria ======================
  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;

  const renderCasoDetalhe = () => {
    if (!casoAberto) return null;
    const c = casoAberto;
    const trombo = c.doseTotal ? `${c.trombolitico === 'tnk' ? 'Tenecteplase' : 'Alteplase'} ${c.doseTotal} mg` : '—';
    const cincinnatiStr = Object.entries(c.cincinnati || {}).map(([k, v]) => `${k}: ${v || '—'}`).join(' · ');
    const tStart = c.iniciadoEm || null;
    const offsetHora = (ts) => {
      if (!tStart || !ts) return formatHora(ts);
      const dmin = Math.floor((ts - tStart) / 60000);
      if (dmin < 60) return `T+${dmin}min`;
      return `T+${Math.floor(dmin / 60)}h${pad2(dmin % 60)}`;
    };
    const events = (c.eventos || []).map((ev, i) => ({
      id: `${ev.hora}-${i}`,
      time: offsetHora(ev.hora),
      title: ev.acao,
      status: TAG_STATUS[ev.tag] || 'info',
    }));
    return (
      <>
        <SheetSection boxed title="Caso">
          <SheetDetailRow label="Encerrado em" value={c.date} />
          <SheetDetailRow label="Duração" value={c.duration} />
          <SheetDetailRow label="NIHSS" value={`${c.nihss ?? 0} pts`} />
          <SheetDetailRow label="Janela" value={c.janelaMin != null ? `${Math.floor(c.janelaMin / 60)}h ${pad2(c.janelaMin % 60)}min` : '—'} />
          {c.peso && <SheetDetailRow label="Peso" value={`${c.peso} kg`} />}
        </SheetSection>

        <SheetSection boxed title="Conduta">
          <SheetDetailRow label="Trombolítico" value={trombo} />
          {cincinnatiStr && <SheetDetailRow label="Cincinnati" value={cincinnatiStr} />}
          <SheetDetailRow label="Disfagia" value={c.disfagia || '—'} />
          <SheetDetailRow label="Hemorrágico" value={c.hemorragico ? 'Sim' : 'Não'} />
        </SheetSection>

        {events.length > 0 && <Timeline title="Linha do tempo" events={events} />}

        {c.anotacao && (
          <SheetSection boxed title="Anotação">
            <SheetText>{c.anotacao}</SheetText>
          </SheetSection>
        )}

        <SheetText variant="auxiliary">
          Histórico salvo apenas neste aparelho. Não substitui prontuário oficial.
        </SheetText>
      </>
    );
  };

  // §filtro por categoria de reperfusão (regra Rafael · ≥2 desfechos reais · Luis 2026-05-29).
  // Categoria derivada dos campos salvos (desfecho é string livre tipo "TNK 18 mg").
  const categoriaAvc = (c) => (c.hemorragico ? 'hemorragico' : c.doseTotal ? 'trombolise' : 'sem-reperfusao');
  const AVC_FILTROS = [
    { value: 'todas', label: 'Todos' },
    { value: 'trombolise', label: 'Trombólise' },
    { value: 'hemorragico', label: 'Hemorrágico' },
    { value: 'sem-reperfusao', label: 'Sem reperfusão' },
  ];
  const historicoFiltradoAvc = histFiltro === 'todas'
    ? historico
    : historico.filter((c) => categoriaAvc(c) === histFiltro);

  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos arquivados neste aparelho."
      cases={historicoFiltradoAvc}
      filters={historico.length > 0 ? { options: AVC_FILTROS, value: histFiltro, onChange: setHistFiltro } : undefined}
      onCaseClick={(c) => setCasoIdxAberto(historico.indexOf(c))}
    />
  );

  const teoriaView = (
    <TheoryScreen
      title="Teoria"
      subtitle="Escalas, gates, janelas e protocolos · AHA/ASA Stroke Guideline 2026."
      items={[
        { title: 'NIHSS completa', sub: '11 domínios · pontuação 0-42 · gravidade clínica.', onClick: () => setModalId('teoria-nihss') },
        { title: 'Cincinnati pré-hospitalar', sub: 'Face · braço · fala · abertura do código AVC.', onClick: () => setModalId('teoria-cincinnati') },
        { title: 'Janelas terapêuticas', sub: '< 4.5h · 4.5-9h estendida · wake-up por RM.', onClick: () => setModalId('teoria-janelas') },
        { title: 'Gates de pressão arterial', sub: '185/110 · 180/105 · 220/120 · 130-140 (hemorrágico).', onClick: () => setModalId('teoria-pa') },
        { title: 'Trombectomia mecânica', sub: 'ACI/M1/M2/Basilar · ASPECTS · janelas estendidas.', onClick: () => setModalId('teoria-trombec') },
        { title: 'ABCD² · AIT/Minor', sub: 'Estratificação + DAPT 21 dias.', onClick: () => setModalId('teoria-abcd2') },
        { title: 'ELAN 2023 · DOAC', sub: 'Quando retornar anticoagulação pós-AVC cardioembólico.', onClick: () => setModalId('teoria-elan') },
        { title: 'AVC hemorrágico', sub: 'Desvio do fluxo · meta PA agressiva 130-140.', onClick: () => setModalId('teoria-hemorragico') },
      ]}
    />
  );

  return (
    <>
      <ProtocolShell
        domain="avc"
        title="Modo AVC"
        subtitle={elapsedStr ? `Aberto há ${elapsedStr}` : 'Protocolo de AVC'}
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

      <InfoSheet open={!!modal} onClose={() => setModalId(null)} title={modal?.title}>
        {modal && <AvcModalBody blocks={modal.blocks} />}
      </InfoSheet>

      <AnnotationSheet
        open={anotarOpen}
        onClose={() => setAnotarOpen(false)}
        value={s.anotacao}
        onChange={s.setAnotacao}
        onSave={() => { s.setAnotacaoEditadaEm(new Date().toISOString()); s.registrarEvento('Anotação editada', 'anotacao'); setAnotarOpen(false); }}
        onClear={() => { s.setAnotacao(''); s.setAnotacaoEditadaEm(null); }}
      />

      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do protocolo?"
        description="O caso continua salvo neste aparelho · você pode retomar quando quiser."
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
        idade={idade}
        onIdade={setIdade}
        peso={s.peso}
        onPeso={s.setPesoManual}
        sexo={sexo}
        onSexo={setSexo}
        observacoes={s.anotacao}
        onObservacoes={s.setAnotacao}
        desfecho={desfechoAvc}
        onSave={handleFinalizar}
        onDiscard={handleFinalizarSemSalvar}
      />

      <FormSheet
        open={bypassOpen}
        onClose={() => { setBypassOpen(false); setBypassGates([]); }}
        title="Confirmar bypass · 4 gates"
        description="Você está pulando NIHSS e a checagem de contraindicações. Marque cada gate que você avaliou pessoalmente antes de seguir."
        saveLabel="Avaliei os 4 · seguir"
        canSave={bypassGates.length === BYPASS_GATES.length}
        onSave={confirmarBypass}
      >
        <ChecklistBlock
          tagLabel="Gates de segurança"
          tagTone="critico"
          count={`${bypassGates.length}/${BYPASS_GATES.length}`}
          items={BYPASS_GATES.map((g) => ({ label: g.label, checked: bypassGates.includes(g.value) }))}
          onToggle={toggleBypassGate}
        />
      </FormSheet>

      <ConfirmSheet
        open={janelaConfirmOpen}
        onClose={() => setJanelaConfirmOpen(false)}
        title="Janela estendida · confirmar mismatch"
        description={`A janela está em ${janelaMin != null ? `${Math.floor(janelaMin / 60)}h ${pad2(janelaMin % 60)}min` : '—'} · fora da janela padrão de 4,5h. A trombólise só é indicada com perfusão TC/RM com mismatch core-penumbra (DAWN/DEFUSE 3) ou RM DWI-FLAIR (wake-up até 9h). Confirme que avaliou a neuroimagem.`}
        confirmLabel="Confirmei mismatch · seguir"
        cancelLabel="Voltar e revisar"
        onConfirm={confirmarJanelaEstendida}
      />

      <ConfirmSheet
        open={voltarNihssOpen}
        onClose={() => setVoltarNihssOpen(false)}
        title="Voltar ao passo anterior?"
        description="Você pode revisar e ajustar a pontuação. A NIHSS oficial registra a primeira impressão; se for reavaliação real, anote no campo de observações."
        confirmLabel="Voltar e revisar"
        cancelLabel="Ficar neste passo"
        onConfirm={() => { s.nihssVoltar(); setVoltarNihssOpen(false); }}
      />

      <DetailSheet
        open={casoAberto != null}
        onClose={() => setCasoIdxAberto(null)}
        title={casoAberto?.initials || ''}
        footer={casoAberto ? {
          secondary: { label: 'Excluir', variant: 'danger', onClick: () => setExcluirIdx(casoIdxAberto) },
          primary: { label: 'Fechar', onClick: () => setCasoIdxAberto(null) },
        } : undefined}
      >
        {renderCasoDetalhe()}
      </DetailSheet>

      <ConfirmSheet
        open={excluirIdx != null}
        onClose={() => setExcluirIdx(null)}
        title="Apagar este caso?"
        description="A ação não pode ser desfeita."
        confirmLabel="Apagar"
        cancelLabel="Manter"
        destructive
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
