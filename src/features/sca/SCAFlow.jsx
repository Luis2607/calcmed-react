// SCA · fluxo data-driven (Wave 4 · padronizado com AVC/Sepse/CAD/PCR · 2026-05-29).
import { useEffect, useState } from 'react';
import { useSCAState } from './hooks/useSCAState';
import {
  SETUP_TROP_OPCOES, SETUP_ESCORE_OPCOES, FLAGS_ANAMNESE, labelQueixa, OPCOES_QUEIXA,
  ECG_CLASSES, STEMI_LOCALIZACOES, SINAIS_OMI, algumSinalOmi,
  HEART_ITEMS, TIMI_ITEMS, HEAR_ITEMS, calcularEscore, interpretarTroponina,
  decisaoEstratificacao, doseTNK, doseAnticoag, reperfusaoDecisao,
  ONDE_REPERFUNDIR_OPCOES, p2y12Sugestao, P2Y12_OPCOES,
  detectarTipoIam, CONDUTAS_INTERNACAO, statusCaso, HISTORICO_FILTROS,
  CONTRA_FIBRINOLITICO, fibrinoliticoBloqueado, alertasTriagem, montarPasse,
  formatarHoraMin, formatarMinSeg, faixaCrono, parseNum, tela2Valida,
} from './scaData';
import { SgarbossaSheet, SinalOmiInfoSheet, InfoSCASheet } from './scaModais';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { Button } from '../../shared/components/atoms/Button';
import { InputField } from '../../shared/components/molecules/InputField';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { Select } from '../../shared/components/molecules/Select/Select';
import { SelectSheet } from '../../shared/components/overlays/patterns/SelectSheet';
import { ScoreResult } from '../../shared/components/molecules/ScoreResult/ScoreResult';
import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup/ScoreCriterionGroup';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { BannerContextual } from '../../shared/components/organisms/BannerContextual';
import { SheetSection, SheetDetailRow, SheetText } from '../../shared/components/molecules/sheet';
import { Toast } from '../../shared/components/molecules/Toast';
import { ConfirmSheet, AnnotationSheet, DetailSheet, SavePatientSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './SCAFlow.module.css';

const STEPS = ['Triagem', 'ECG', 'Estratificar', 'Conduzir', 'Reavaliar'];

const ALERT_LEVEL = { warning: 'warning', info: 'info', critico: 'critical', atencao: 'warning', sucesso: 'result' };

export function SCAFlow({ onBack }) {
  const s = useSCAState();
  const [historico, setHistorico] = usePersistedState('sca_historico', []);

  // master timer
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  // UI state
  const [queixaOpen, setQueixaOpen] = useState(false);
  const [sgarbossaOpen, setSgarbossaOpen] = useState(false);
  const [p2y12Open, setP2y12Open] = useState(false);
  const [ondeOpen, setOndeOpen] = useState(false);
  const [sinalInfo, setSinalInfo] = useState(null);
  const [infoSheet, setInfoSheet] = useState(null);
  const [anotarOpen, setAnotarOpen] = useState(false);
  const [salvarOpen, setSalvarOpen] = useState(false);
  const [sairOpen, setSairOpen] = useState(false);
  const [casoIdxAberto, setCasoIdxAberto] = useState(null);
  const [excluirIdx, setExcluirIdx] = useState(null);
  const [histFiltro, setHistFiltro] = useState('todas');
  const [scoreExpandido, setScoreExpandido] = useState(null); // qual critério HEART/HEAR está aberto
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  // ============================================================
  // DERIVADOS CLÍNICOS (scaData puro)
  // ============================================================
  const elapsedMs = s.iniciadoEm ? now - s.iniciadoEm : 0;
  const elapsed = formatarHoraMin(elapsedMs);
  const idadeNum = parseNum(s.paciente.idade);
  const pesoNum = parseNum(s.paciente.peso);

  const escore = calcularEscore({ tipo: s.escoreEscolhido, heart: s.heart, timi: s.timi, hear: s.hear });
  const trop = interpretarTroponina({
    tropTipo: s.setupTrop, tropInicial: parseNum(s.tropInicial),
    tropSeriada: parseNum(s.tropSeriada), tropPulada: s.tropPulada,
  });
  const decisao = decisaoEstratificacao({
    ecgClasse: s.ecgClasse, escoreTipo: s.escoreEscolhido, escoreTotal: escore.total,
    escorePreenchido: escore.preenchido, trop, tropInicial: parseNum(s.tropInicial), tropPulada: s.tropPulada,
  });
  const reperf = reperfusaoDecisao({ ondeReperfundir: s.ondeReperfundir, tempoPCI: parseNum(s.tempoPCI) });
  const tipoIam = detectarTipoIam({ ecgClasse: s.ecgClasse, sinaisOmi: s.sinaisOmi, trop });
  const conduta = tipoIam ? CONDUTAS_INTERNACAO[tipoIam] : null;
  const alertas = alertasTriagem({ flags: s.flags, idade: idadeNum, queixa: s.paciente.queixa });
  const isReperfusao = s.ecgClasse === 'stemi' || s.ecgClasse === 'omi';

  // Cronômetro porta-ECG (manual-start)
  const cEcg = s.cronoPortaEcg;
  const portaEcgMs = cEcg.finalMs != null ? cEcg.finalMs
    : cEcg.iniciadoEm ? now - cEcg.iniciadoEm + (cEcg.acumulado || 0) : (cEcg.acumulado || 0);
  const portaEcgFaixa = faixaCrono(portaEcgMs, 10, 15);

  // ============================================================
  // AÇÕES
  // ============================================================
  const handleSair = () => {
    if (s.iniciadoEm) setSairOpen(true); else onBack();
  };

  const setPacienteCampo = (campo, valor) => s.setPaciente({ ...s.paciente, [campo]: valor });

  // Validação de faixa: peso > 0 e ≤ 350 kg; idade > 0 e ≤ 120 anos.
  const idadeValida = !isNaN(idadeNum) && idadeNum > 0 && idadeNum <= 120;
  const pesoValido = !isNaN(pesoNum) && pesoNum > 0 && pesoNum <= 350;
  const idadeErro = s.paciente.idade !== '' && s.paciente.idade != null && !idadeValida
    ? 'Idade deve estar entre 1 e 120 anos.' : null;
  const pesoErro = s.paciente.peso !== '' && s.paciente.peso != null && !pesoValido
    ? 'Peso deve estar entre 1 e 350 kg.' : null;

  const dadosT1Ok = idadeValida && pesoValido && !!s.paciente.queixa;
  const t2Ok = tela2Valida({ ecgClasse: s.ecgClasse, stemiLocalizacao: s.stemiLocalizacao, sinaisOmi: s.sinaisOmi, lockSoftOmiConfirmado: s.lockSoftOmiConfirmado });

  // Gate T3: exige escore preenchido E troponina informada (ou pulada).
  const tropInformada = (s.tropInicial !== null && s.tropInicial !== '') || s.tropPulada;
  const t3Ok = escore.preenchido && tropInformada;
  const t3Hint = !escore.preenchido && !tropInformada
    ? 'Preencha o escore e informe a troponina para continuar.'
    : !escore.preenchido
      ? 'Preencha ao menos 1 escore para continuar.'
      : !tropInformada
        ? 'Informe a troponina (ou pulse) para continuar.'
        : decisao.titulo;

  // Gate T4: exige escolha do antiagregante P2Y12.
  const t4Ok = !!s.p2y12Escolhido;
  const t4Hint = t4Ok ? 'Conduta definida' : 'Escolha o antiagregante P2Y12 para continuar.';

  const condutaTitulo = conduta?.titulo || decisao.titulo;

  const salvarCaso = () => {
    if (!(s.paciente.iniciais || '').trim()) return;
    const novoCaso = {
      id: `sca-${Date.now()}`,
      initials: (s.paciente.iniciais || '—').toUpperCase().slice(0, 10),
      status: statusCaso(tipoIam),
      statusTone: tipoIam === 'zona-cinzenta' || tipoIam == null ? 'atencao' : 'novo',
      desfecho: condutaTitulo,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      duration: elapsed,
      iniciadoEm: s.iniciadoEm,
      idade: s.paciente.idade,
      peso: s.paciente.peso,
      sexo: s.paciente.sexo,
      ecgClasse: s.ecgClasse,
      escoreTipo: s.escoreEscolhido,
      escoreTotal: escore.total,
      tropTexto: trop.texto,
      tipoIam,
      observacoes: s.observacoes,
      eventos: [...s.eventos],
    };
    setHistorico([novoCaso, ...historico]);
    setSalvarOpen(false);
    s.resetProtocol();
    showToast('Caso arquivado no histórico');
    s.setAbaAtual('historico');
  };

  const handleFinalizarSemSalvar = () => {
    setSalvarOpen(false);
    s.resetProtocol();
    showToast('Protocolo reiniciado', 'success');
  };

  const handleExcluirCaso = () => {
    if (excluirIdx == null) return;
    setHistorico(historico.filter((_, i) => i !== excluirIdx));
    setExcluirIdx(null);
    setCasoIdxAberto(null);
    showToast('Caso removido do histórico');
  };

  // ============================================================
  // T1 · TRIAGEM
  // ============================================================
  const t1 = (
    <div className={styles.tela}>
      <StepHeader title="Triagem" subtitle="Configure a realidade do serviço e os dados mínimos do paciente." />

      <ClinicalCard variant="plain" title="Realidade do serviço">
        <RadioGroup name="sca-setup-trop" label="Troponina disponível" options={SETUP_TROP_OPCOES} value={s.setupTrop} onChange={s.setSetupTrop} columns={1} />
        <RadioGroup name="sca-setup-escore" label="Escore de risco" options={SETUP_ESCORE_OPCOES} value={s.setupEscore} onChange={s.setSetupEscore} columns={1} />
      </ClinicalCard>

      <ClinicalCard variant="plain" title="Dados do paciente" onInfo={() => setInfoSheet('paciente')}>
        <div className={styles.row2}>
          <InputField
            label="Idade" type="text" mono inputMode="numeric" maxLength={3}
            value={s.paciente.idade ?? ''} onChange={(v) => setPacienteCampo('idade', v)}
            showUnit unit="anos"
            state={idadeErro ? 'error' : 'default'}
            helperText={idadeErro ?? undefined}
          />
          <InputField
            label="Peso" type="text" mono inputMode="decimal" maxLength={5}
            value={s.paciente.peso ?? ''} onChange={(v) => setPacienteCampo('peso', v)}
            showUnit unit="kg"
            state={pesoErro ? 'error' : 'default'}
            helperText={pesoErro ?? undefined}
          />
        </div>
        <Select
          label="Queixa principal"
          value={labelQueixa(s.paciente.queixa)}
          placeholder="Selecione a apresentação..."
          onClick={() => setQueixaOpen(true)}
        />
      </ClinicalCard>

      <ChecklistBlock
        tagLabel="Anamnese"
        tagTone="novo"
        count={`${FLAGS_ANAMNESE.filter((f) => s.flags[f.key]).length}/${FLAGS_ANAMNESE.length}`}
        subtitle="Marque o que muda a conduta · alguns viram travas de segurança adiante."
        items={FLAGS_ANAMNESE.map((f) => ({ label: f.label, checked: !!s.flags[f.key] }))}
        onToggle={(i) => s.toggleFlag(FLAGS_ANAMNESE[i].key)}
      />

      {alertas.map((a) => (
        <AlertCard key={a.key} level={ALERT_LEVEL[a.tipo] || 'info'} title={a.titulo}>{a.corpo}</AlertCard>
      ))}
    </div>
  );

  // ============================================================
  // T2 · ECG
  // ============================================================
  const t2 = (
    <div className={styles.tela}>
      <StepHeader title="ECG" subtitle="Marque o tempo porta-ECG e classifique o traçado." />

      {!cEcg.iniciadoEm && cEcg.finalMs == null ? (
        <TimerCard label="Porta-ECG" value="--:--" meta="Meta < 10 min" description="Inicie ao receber o paciente. Marque quando o ECG for registrado." state="idle">
          <Button variant="primary" size="lg" onClick={s.iniciarCronoPortaEcg}>Iniciar cronômetro</Button>
        </TimerCard>
      ) : (
        <TimerCard
          label="Porta-ECG"
          value={formatarMinSeg(portaEcgMs)}
          meta={cEcg.finalMs != null ? 'ECG registrado' : 'Meta < 10 min'}
          description={cEcg.finalMs != null ? 'ECG marcado dentro do caso.' : 'Verde < 10 · amarelo 10-15 · vermelho > 15 (SBC 2025).'}
          tone={portaEcgFaixa === 'critical' ? 'critical' : portaEcgFaixa === 'warning' ? 'warning' : undefined}
        >
          {cEcg.finalMs == null && (
            <Button variant="primary" size="md" onClick={s.marcarEcgRealizado}>Marcar ECG realizado</Button>
          )}
        </TimerCard>
      )}

      <SectionLabel onInfo={() => setInfoSheet('ecg')}>Classifique o ECG</SectionLabel>
      <div className={styles.group}>
        {ECG_CLASSES.map((c) => (
          <OptionCard
            key={c.value}
            title={c.titulo}
            meta={c.meta}
            description={c.sub}
            tone={c.tone === 'critical' ? 'critical' : c.tone === 'warning' ? 'warning' : 'info'}
            selected={s.ecgClasse === c.value}
            onClick={() => s.setEcgClasse(c.value)}
          />
        ))}
      </div>

      {s.ecgClasse === 'stemi' && (
        <ClinicalCard variant="plain" title="Localização do STEMI">
          <RadioGroup name="sca-stemi-loc" options={STEMI_LOCALIZACOES} value={s.stemiLocalizacao} onChange={s.setStemiLocalizacao} columns={1} />
          {s.stemiLocalizacao === 'inferior' && (
            <AlertCard level="warning" title="STEMI inferior · cheque aVL e VD">
              Em STEMI inferior, busque infra recíproca em aVL e considere derivações direitas (V3R-V4R) para infarto de VD.
            </AlertCard>
          )}
        </ClinicalCard>
      )}

      {s.ecgClasse === 'omi' && (
        <>
          <SectionLabel>Sinais OMI / oclusão aguda</SectionLabel>
          <div className={styles.group}>
            {SINAIS_OMI.map((sinal) => (
              <OptionCard
                key={sinal.id}
                title={sinal.nome}
                description={sinal.criterio}
                tone="critical"
                selected={!!s.sinaisOmi[sinal.id]}
                onClick={() => s.toggleSinalOmi(sinal.id)}
              />
            ))}
          </div>
          {s.sinaisOmi.espelhoPosterior && (
            <AlertCard level="warning" title="Pedir V7-V9">
              Espelho posterior ativo. Registrar derivações posteriores antes de fechar a decisão.
            </AlertCard>
          )}
          {s.sinaisOmi.sgarbossaSmith && (
            <Button variant="secondary" size="lg" className={styles.fieldTrigger} onClick={() => setSgarbossaOpen(true)}>
              Abrir calculadora Sgarbossa-Smith
            </Button>
          )}
          {!algumSinalOmi(s.sinaisOmi) && (
            <ChecklistBlock
              tagLabel="Nenhum sinal"
              tagTone="atencao"
              items={[{ label: 'Confirmo que revisei os 8 sinais e nenhum está presente', checked: s.lockSoftOmiConfirmado }]}
              onToggle={() => s.setLockSoftOmiConfirmado(!s.lockSoftOmiConfirmado)}
            />
          )}
        </>
      )}

      {s.ecgClasse === 'preocupante' && (
        <AlertCard level="warning" title="Observação monitorizada">
          Sem critério claro de STEMI/OMI. Mantenha o paciente monitorizado, repita o ECG em 10-20 min e considere uma segunda opinião.
        </AlertCard>
      )}
    </div>
  );

  // ============================================================
  // T3 · ESTRATIFICAR
  // ============================================================
  const SCORE_TABS = [
    { value: 'heart', label: 'HEART' },
    { value: 'timi', label: 'TIMI' },
    { value: 'hear', label: 'HEAR' },
  ];
  const trocaUnidade = s.setupTrop === 'conv' ? 'ng/mL' : 'ng/L';

  const t3 = (
    <div className={styles.tela}>
      <StepHeader title="Estratificar" subtitle="Calcule o escore de risco e interprete a troponina." />

      <Segmented options={SCORE_TABS} value={s.escoreEscolhido} onChange={s.setEscoreEscolhido} block />

      {(s.escoreEscolhido === 'heart' || s.escoreEscolhido === 'hear') && (
        <div className={styles.group}>
          {(s.escoreEscolhido === 'heart' ? HEART_ITEMS : HEAR_ITEMS).map((item) => {
            const stateObj = s.escoreEscolhido === 'heart' ? s.heart : s.hear;
            const setItem = s.escoreEscolhido === 'heart' ? s.setHeartItem : s.setHearItem;
            const key = `${s.escoreEscolhido}-${item.id}`;
            return (
              <ScoreCriterionGroup
                key={key}
                systemName={item.label}
                options={item.opcoes.map((o) => ({ label: o.texto, points: `+${o.val}` }))}
                value={typeof stateObj[item.id] === 'number' ? stateObj[item.id] : null}
                onChange={(idx) => setItem(item.id, item.opcoes[idx].val)}
                expanded={scoreExpandido === key}
                onToggle={() => setScoreExpandido(scoreExpandido === key ? null : key)}
                name={`sca-${key}`}
              />
            );
          })}
        </div>
      )}

      {s.escoreEscolhido === 'timi' && (
        <div className={styles.group}>
          {TIMI_ITEMS.map((item) => (
            <ScoreCriterionGroup
              key={item.id}
              systemName={item.label}
              binary
              binaryChecked={!!s.timi[item.id]}
              onBinaryChange={() => s.toggleTimi(item.id)}
              points="+1"
            />
          ))}
        </div>
      )}

      {escore.preenchido && (
        <ScoreResult
          value={escore.total}
          risk={escore.categoria === 'medio' ? 'moderado' : escore.categoria}
          riskLabel={`${s.escoreEscolhido.toUpperCase()} · ${escore.categoria === 'alto' ? 'Alto risco' : escore.categoria === 'medio' ? 'Risco intermediário' : 'Baixo risco'}`}
          pointsLabel={`de ${escore.max} pontos`}
        />
      )}

      <ClinicalCard variant="plain" title="Troponina" subtitle={`Kit: ${SETUP_TROP_OPCOES.find((o) => o.value === s.setupTrop)?.label}`}>
        <InputField label="1ª dosagem" type="text" mono inputMode="decimal" value={s.tropInicial ?? ''} onChange={s.setTropInicial} showUnit unit={trocaUnidade} placeholder="Ex.: 12" />
        {s.setupTrop !== 'poct' && (
          <InputField label="2ª dosagem (seriada)" type="text" mono inputMode="decimal" value={s.tropSeriada ?? ''} onChange={s.setTropSeriada} showUnit unit={trocaUnidade} placeholder="Ex.: 30" />
        )}
        {!s.tropPulada && (s.tropInicial == null || s.tropInicial === '') && (
          <Button variant="secondary" size="md" onClick={() => s.setTropPulada(true)}>Pular troponina (decisão preliminar)</Button>
        )}
      </ClinicalCard>

      <AlertCard level={decisao.tipo === 'critico' ? 'critical' : decisao.tipo === 'atencao' ? 'warning' : 'info'} title={decisao.titulo}>
        {decisao.corpo}
      </AlertCard>
    </div>
  );

  // ============================================================
  // T4 · CONDUZIR
  // ============================================================
  const tnk = doseTNK({ peso: pesoNum, idade: idadeNum });
  const fibBloqueado = fibrinoliticoBloqueado(s.contraindicacoes);
  const p2y12Sug = p2y12Sugestao({ reperfusaoTipo: reperf.reperfusaoTipo, ecgClasse: s.ecgClasse, avcPrevio: s.flags.avcPrevio, idade: idadeNum, peso: s.paciente.peso });
  const p2y12SelectOpcoes = P2Y12_OPCOES.map((o) => ({ value: o.value, label: o.value === 'prasugrel' && p2y12Sug.bloqPrasugrel ? `${o.label} · bloqueado` : o.label, disabled: o.value === 'prasugrel' && p2y12Sug.bloqPrasugrel }));

  const t4 = (
    <div className={styles.tela}>
      <StepHeader title="Conduzir" subtitle="Antitrombóticos, locks de segurança e reperfusão." />

      {s.flags.saa && <AlertCard level="critical" title="AAS suspenso · suspeita de SAA">Não administrar AAS empírico. Aplicar ADD-RS e descartar dissecção primeiro.</AlertCard>}
      {s.flags.avcPrevio && <AlertCard level="warning" title="Prasugrel bloqueado">AVC/AIT prévio · Classe 3 Harm (Rao 2025). Usar ticagrelor ou clopidogrel.</AlertCard>}
      {s.flags.pde5 && <AlertCard level="warning" title="Nitratos bloqueados">PDE5 recente (sildenafil/tadalafil). Não usar nitratos nas próximas 24-48h.</AlertCard>}

      <ClinicalCard variant="plain" title="Antiagregação e anticoagulação">
        <AlertCard level={s.flags.saa ? 'critical' : 'result'} title={s.flags.saa ? 'AAS bloqueado' : 'AAS 200-300 mg mastigável'}>
          {s.flags.saa ? 'Suspeita de SAA marcada na triagem.' : 'Administrar se não houver alergia ou suspeita de aorta.'}
        </AlertCard>
        <AlertCard level={p2y12Sug.tipo === 'sucesso' ? 'result' : p2y12Sug.tipo === 'atencao' ? 'warning' : 'info'} title={p2y12Sug.titulo}>
          {p2y12Sug.corpo}
        </AlertCard>
        <Select
          label="Antiagregante P2Y12"
          value={s.p2y12Escolhido ? `${s.p2y12Escolhido.charAt(0).toUpperCase()}${s.p2y12Escolhido.slice(1)}` : null}
          placeholder="Escolher antiagregante..."
          onClick={() => setP2y12Open(true)}
        />
        <AlertCard level="info" title="Anticoagulação">{doseAnticoag({ peso: pesoNum, idade: idadeNum })}</AlertCard>
      </ClinicalCard>

      {isReperfusao && (
        <ClinicalCard variant="plain" title="Reperfusão">
          <Select
            label="Local de reperfusão"
            value={ONDE_REPERFUNDIR_OPCOES.find((o) => o.value === s.ondeReperfundir)?.titulo}
            placeholder="Escolher local..."
            onClick={() => setOndeOpen(true)}
          />
          {s.ondeReperfundir === 'transferencia-regional' && (
            <InputField label="Tempo estimado até o cathlab regional" type="text" mono inputMode="numeric" value={s.tempoPCI ?? ''} onChange={s.setTempoPCI} showUnit unit="min" placeholder="Ex.: 90" />
          )}
          <AlertCard level={reperf.tipo === 'sucesso' ? 'result' : reperf.tipo === 'atencao' ? 'warning' : 'info'} title={reperf.titulo}>
            {reperf.corpo}
          </AlertCard>
          {reperf.mostraFib && tnk && (
            <AlertCard level="warning" title="Tenecteplase" showValue value={`${tnk.dose}`} unit="mg">
              {tnk.detalhe}. Sempre transferir para centro com PCI após fibrinolisar.
            </AlertCard>
          )}
          {reperf.mostraFib && (
            <ChecklistBlock
              tagLabel="Contraindicações ao fibrinolítico"
              tagTone="critico"
              count={`${CONTRA_FIBRINOLITICO.filter((c) => s.contraindicacoes[c.key]).length}/${CONTRA_FIBRINOLITICO.length}`}
              items={CONTRA_FIBRINOLITICO.map((c) => ({ label: `${c.label}${c.tipo === 'absoluta' ? ' · absoluta' : ''}`, checked: !!s.contraindicacoes[c.key] }))}
              onToggle={(i) => s.setContraindicacao(CONTRA_FIBRINOLITICO[i].key, !s.contraindicacoes[CONTRA_FIBRINOLITICO[i].key])}
            />
          )}
          {reperf.mostraFib && fibBloqueado && (
            <AlertCard level="critical" title="Fibrinólise contraindicada">Contraindicação absoluta marcada · não fibrinolisar. Priorizar transferência para PCI.</AlertCard>
          )}
        </ClinicalCard>
      )}
    </div>
  );

  // ============================================================
  // T5 · REAVALIAR
  // ============================================================
  const passe = montarPasse({
    iniciais: s.paciente.iniciais, idade: s.paciente.idade, peso: s.paciente.peso,
    ecgClasse: s.ecgClasse, territorio: s.stemiLocalizacao, escoreTipo: s.escoreEscolhido,
    escoreTotal: escore.total, trop, condutaTitulo, saa: s.flags.saa, pde5: s.flags.pde5,
  });
  const eventosTimeline = s.eventos.map((ev, i) => ({
    id: `${ev.hora}-${i}`,
    time: new Date(ev.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    title: ev.acao,
    status: ev.tag === 'ecg' ? 'info' : 'success',
  }));

  const t5 = (
    <div className={styles.tela}>
      <StepHeader title="Reavaliar" subtitle="Destino, passe estruturado e revisão do caso." />

      {conduta && (
        <ClinicalCard variant="plain" tags={[{ label: conduta.tag, tone: conduta.classe === 'critical' ? 'critico' : conduta.classe === 'warning' ? 'atencao' : 'novo' }]} title={conduta.titulo}>
          <ul className={styles.condutaList}>
            {conduta.linhas.map((linha, i) => <li key={i}>{linha}</li>)}
          </ul>
        </ClinicalCard>
      )}

      <ClinicalCard variant="plain" title="Passe estruturado" subtitle="Resumo pronto para a passagem de plantão.">
        <SheetText>{passe}</SheetText>
        <Button variant="secondary" size="md" showLeftIcon leftIcon="copiar" onClick={() => { if (navigator?.clipboard) navigator.clipboard.writeText(passe); showToast('Passe copiado'); }}>
          Copiar passe
        </Button>
      </ClinicalCard>

      {eventosTimeline.length > 0 && <Timeline title="Linha do tempo do caso" events={eventosTimeline} />}
    </div>
  );

  const telas = { 1: t1, 2: t2, 3: t3, 4: t4, 5: t5 };

  // ============================================================
  // FOOTERS
  // ============================================================
  const footers = {
    1: { hint: 'Realidade do serviço + idade, peso e queixa', primary: { label: 'Continuar', size: 'lg', onClick: () => s.irParaTela(2), disabled: !dadosT1Ok, rightIcon: 'chevronRight', showRightIcon: true } },
    2: { hint: 'Classifique o ECG para avançar', secondary: { label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(1) }, primary: { label: 'Continuar', size: 'lg', onClick: () => s.irParaTela(3), disabled: !t2Ok, rightIcon: 'chevronRight', showRightIcon: true } },
    3: { hint: t3Hint, secondary: { label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(2) }, primary: { label: 'Continuar', size: 'lg', onClick: () => s.irParaTela(4), disabled: !t3Ok, rightIcon: 'chevronRight', showRightIcon: true } },
    4: { hint: t4Hint, secondary: { label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(3) }, primary: { label: 'Continuar', size: 'lg', onClick: () => s.irParaTela(5), disabled: !t4Ok, rightIcon: 'chevronRight', showRightIcon: true } },
    5: { hint: 'Salve o caso ou finalize sem salvar', secondary: { label: 'Voltar', variant: 'secondary', size: 'lg', onClick: () => s.irParaTela(4) }, primary: { label: 'Finalizar', size: 'lg', onClick: () => setSalvarOpen(true), leftIcon: 'salvar', showLeftIcon: true } },
  };

  // ============================================================
  // HISTÓRICO / TEORIA
  // ============================================================
  const historicoFiltrado = histFiltro === 'todas' ? historico : historico.filter((c) => c.status === histFiltro);
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos SCA arquivados neste aparelho."
      cases={historicoFiltrado}
      filters={historico.length > 0 ? { options: HISTORICO_FILTROS, value: histFiltro, onChange: setHistFiltro } : undefined}
      onCaseClick={(c) => setCasoIdxAberto(historico.findIndex((h) => h.id === c.id))}
    />
  );

  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;

  const teoriaView = (
    <TheoryScreen
      title="Consulta rápida"
      subtitle="Referência clínica do protocolo SCA · SBC 2025."
      items={[
        { title: 'Sinais OMI/IAM', sub: 'T hiperaguda, De Winter, Wellens, Aslanger, posterior, Sgarbossa.', onClick: () => setInfoSheet('omi-geral') },
        { title: 'HEART / TIMI / HEAR', sub: 'Escores de estratificação de risco.', onClick: () => setInfoSheet('escores') },
        { title: 'Algoritmo de troponina', sub: 'hs-cTn 0/1h · convencional 0/3/6h · POCT.', onClick: () => setInfoSheet('troponina') },
        { title: 'Reperfusão', sub: 'PPCI preferencial; fibrinólise exige janela e checagem.', onClick: () => setInfoSheet('reperfusao') },
        { title: 'Locks de segurança', sub: 'SAA bloqueia AAS, PDE5 bloqueia nitrato, AVC/AIT bloqueia prasugrel.', onClick: () => setInfoSheet('locks') },
      ]}
    />
  );

  // ============================================================
  // CHIPS HEADER
  // ============================================================
  const chips = [];
  if (s.iniciadoEm) {
    if (!isNaN(idadeNum)) chips.push({ label: `${idadeNum}a`, mono: true });
    if (s.ecgClasse) chips.push({ label: s.ecgClasse === 'stemi' ? 'STEMI' : s.ecgClasse === 'omi' ? 'OMI' : 'Preocupante', tone: s.ecgClasse === 'preocupante' ? 'atencao' : 'critico' });
    if (escore.preenchido) chips.push({ label: `${s.escoreEscolhido.toUpperCase()} ${escore.total}`, mono: true });
  }

  const INFO_SHEETS = {
    paciente: { titulo: 'Por que esses dados importam?', descricao: 'Triagem SCA/IAM', paragrafos: ['Idade, peso, tempo de dor e queixa alimentam o risco inicial, as doses e a janela de reperfusão.', 'Os alertas da triagem viram travas de segurança: SAA bloqueia AAS, PDE5 bloqueia nitrato e AVC/AIT prévio bloqueia prasugrel.'] },
    ecg: { titulo: 'Classificação do ECG', descricao: 'Detector OMI/IAM', paragrafos: ['Separe STEMI clássico, ECG preocupante e padrões OMI sem supra clássico.', 'Se houver sinal OMI, o fluxo trata como IAM relevante e puxa conduta, troponina e destino.'] },
    'omi-geral': { titulo: 'Sinais OMI/IAM', descricao: 'SBC 2025 + Alencar 2025', paragrafos: ['8 padrões de oclusão coronariana aguda sem supra clássico: onda T hiperaguda, De Winter, Wellens, Aslanger, espelho posterior, Sgarbossa-Smith, distorção terminal do QRS e IST em aVL isolado.'] },
    escores: { titulo: 'HEART / TIMI / HEAR', descricao: 'Estratificação de risco', paragrafos: ['HEART: 5 itens · < 4 baixo risco. TIMI: 7 critérios · 0-2 baixo risco. HEAR: HEART sem troponina (pré-laboratorial).'] },
    troponina: { titulo: 'Algoritmo de troponina', descricao: 'Adaptativo por kit', paragrafos: ['hs-cTn: algoritmo 0/1h (rule-out < 5; rule-in ≥ 52 ou delta ≥ 5). Convencional: 0/3/6h. POCT: corte ≥ 40 ng/L.'] },
    reperfusao: { titulo: 'Reperfusão', descricao: 'PPCI vs fibrinólise', paragrafos: ['PPCI preferencial se cathlab ≤ 90-120 min. Acima disso, fibrinolisar localmente e transferir sempre.'] },
    locks: { titulo: 'Locks de segurança', descricao: 'Travas clínicas', paragrafos: ['SAA bloqueia AAS · PDE5 bloqueia nitratos por 24-48h · AVC/AIT prévio bloqueia prasugrel (Classe 3 Harm).'] },
  };
  const infoConf = infoSheet ? INFO_SHEETS[infoSheet] : null;

  return (
    <>
      <ProtocolShell
        domain="sca"
        title="Modo SCA"
        subtitle={s.iniciadoEm ? `Aberto há ${elapsed}` : 'Síndrome coronariana aguda'}
        onBack={handleSair}
        actions={[{ icon: 'edit', label: 'Anotar', onClick: () => setAnotarOpen(true), active: !!s.anotacao?.trim() }]}
        chips={chips}
        steps={STEPS}
        currentStep={s.telaAtual}
        onStepClick={(n) => { if (n < s.telaAtual) s.irParaTela(n); }}
        activeTab={s.abaAtual}
        onTabChange={s.setAbaAtual}
        executar={telas[s.telaAtual] || t1}
        historico={historicoView}
        teoria={teoriaView}
        footer={footers[s.telaAtual]}
      />

      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do Modo SCA?"
        description="O caso continua salvo neste aparelho · você retoma pelo hub."
        confirmLabel="Sair"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />

      <SelectSheet
        open={queixaOpen}
        onClose={() => setQueixaOpen(false)}
        title="Queixa principal"
        description="Apresentação que melhor descreve o paciente."
        options={OPCOES_QUEIXA.map((o) => ({ value: o.value, label: o.titulo, description: o.sub }))}
        value={s.paciente.queixa}
        onChange={(v) => setPacienteCampo('queixa', v)}
        name="sca-queixa"
      />
      <SgarbossaSheet open={sgarbossaOpen} onClose={() => setSgarbossaOpen(false)} />
      <SelectSheet
        open={ondeOpen}
        onClose={() => setOndeOpen(false)}
        title="Onde vai reperfundir?"
        description="Define o fluxo de reperfusão · pode mudar entre plantões."
        options={ONDE_REPERFUNDIR_OPCOES.map((o) => ({ value: o.value, label: o.titulo, description: o.sub }))}
        value={s.ondeReperfundir}
        onChange={(v) => s.setOndeReperfundir(v)}
        name="sca-onde-reperfundir"
      />
      <SelectSheet
        open={p2y12Open}
        onClose={() => setP2y12Open(false)}
        title="Antiagregante P2Y12"
        description={p2y12Sug.titulo}
        options={p2y12SelectOpcoes}
        value={s.p2y12Escolhido}
        onChange={(v) => s.setP2y12Escolhido(v)}
        name="sca-p2y12"
      />
      <SinalOmiInfoSheet open={!!sinalInfo} onClose={() => setSinalInfo(null)} sinal={sinalInfo} />
      <InfoSCASheet open={!!infoConf} onClose={() => setInfoSheet(null)} titulo={infoConf?.titulo} descricao={infoConf?.descricao} paragrafos={infoConf?.paragrafos || []} />

      <AnnotationSheet
        open={anotarOpen}
        onClose={() => setAnotarOpen(false)}
        value={s.anotacao}
        onChange={s.setAnotacao}
        onSave={() => { s.setAnotacaoEditadaEm(new Date().toISOString()); setAnotarOpen(false); showToast('Anotação salva'); }}
        onClear={() => { s.setAnotacao(''); s.setAnotacaoEditadaEm(null); }}
      />

      <SavePatientSheet
        open={salvarOpen}
        onClose={() => setSalvarOpen(false)}
        iniciais={s.paciente.iniciais ?? ''}
        onIniciais={(v) => setPacienteCampo('iniciais', v.toUpperCase())}
        idade={s.paciente.idade ?? ''}
        onIdade={(v) => setPacienteCampo('idade', v)}
        peso={s.paciente.peso ?? ''}
        onPeso={(v) => setPacienteCampo('peso', v)}
        sexo={s.paciente.sexo}
        onSexo={(v) => setPacienteCampo('sexo', v)}
        observacoes={s.observacoes}
        onObservacoes={s.setObservacoes}
        desfecho={condutaTitulo}
        onSave={salvarCaso}
        onDiscard={handleFinalizarSemSalvar}
      />

      <DetailSheet
        open={casoAberto != null}
        onClose={() => setCasoIdxAberto(null)}
        title={casoAberto?.initials || '—'}
        footer={casoAberto ? { secondary: { label: 'Excluir', variant: 'danger', onClick: () => setExcluirIdx(casoIdxAberto) } } : undefined}
      >
        {casoAberto && (
          <>
            <SheetSection boxed title="Caso">
              <SheetDetailRow label="Desfecho" value={casoAberto.desfecho || '—'} />
              <SheetDetailRow label="Status" value={casoAberto.status} />
              <SheetDetailRow label="Duração" value={casoAberto.duration} />
              {casoAberto.idade && <SheetDetailRow label="Idade" value={`${casoAberto.idade} anos`} />}
              {casoAberto.peso && <SheetDetailRow label="Peso" value={`${casoAberto.peso} kg`} />}
            </SheetSection>
            <SheetSection boxed title="Diagnóstico">
              <SheetDetailRow label="ECG" value={casoAberto.ecgClasse ? casoAberto.ecgClasse.toUpperCase() : '—'} />
              <SheetDetailRow label="Escore" value={casoAberto.escoreTipo ? `${casoAberto.escoreTipo.toUpperCase()} ${casoAberto.escoreTotal}` : '—'} />
              <SheetDetailRow label="Troponina" value={casoAberto.tropTexto || '—'} />
            </SheetSection>
            {casoAberto.observacoes && (
              <SheetSection title="Observações"><SheetText>{casoAberto.observacoes}</SheetText></SheetSection>
            )}
            <SheetText variant="auxiliary">Histórico salvo apenas neste aparelho. Não substitui prontuário oficial.</SheetText>
          </>
        )}
      </DetailSheet>

      <ConfirmSheet
        open={excluirIdx != null}
        onClose={() => setExcluirIdx(null)}
        title="Excluir do histórico?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Manter"
        perigo
        onConfirm={handleExcluirCaso}
      />

      {toast && (
        <div className={styles.toastWrap}>
          <Toast type={toast.type === 'success' ? 'success' : 'error'} message={toast.message} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
