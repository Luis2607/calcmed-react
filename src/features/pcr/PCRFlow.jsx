import { useEffect, useState } from 'react';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { BannerContextual } from '../../shared/components/organisms/BannerContextual';
import { EventList } from '../../shared/components/organisms/EventList';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { PanfletoPlaceholder } from '../../shared/components/organisms/PanfletoPlaceholder';
import { TETTabela } from '../../shared/components/organisms/TETTabela';
import { TET_TAMANHO_ROWS } from '../../shared/components/organisms/TETTabela/tetData';
import { ActionTile } from '../../shared/components/molecules/ActionTile/ActionTile';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { ToggleTab } from '../../shared/components/molecules/ToggleTab';
import { InputField } from '../../shared/components/molecules/InputField';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { Button } from '../../shared/components/atoms/Button';
import { FAB } from '../../shared/components/atoms/FAB';
import { Toast } from '../../shared/components/molecules/Toast';
import { ConfirmSheet, InfoSheet, AnnotationSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { usePCRState } from './hooks/usePCRState';
import {
  CICLO_MS, BPM_OPCOES, INTERVALO_ADREN_OPCOES,
  formatDuracao, formatHora, formatOffset,
  isChocavel, isNaoChocavel, getRitmoLabel,
  getCargaInicial,
  calcDosesPediatricas, calcCargasPediatricas, calcLidocainaAdulto,
  parseNumber,
} from './pcrData';
import {
  SelecionarRitmoSheet, AplicarChoqueSheet, ConfirmarRCESheet,
  EncerrarSemRCESheet, PausarSheet, CheckarPulsoRitmoSheet,
  AdrenDoubleTapSheet, HHTTSheet, AdicionarEventoSheet, OutroEventoSheet,
} from './pcrModais';
import { iniciarMetronomo, pararMetronomo, falar, pararFala } from './pcrAudio';
import styles from './PCRFlow.module.css';

const PCR_TABS = [
  { id: 'executar', label: 'Executar', icon: 'play' },
  { id: 'historico', label: 'Histórico', icon: 'tempo' },
  { id: 'teoria', label: 'ACLS | AHA', icon: 'livro' },
];

const SEG_BPM = BPM_OPCOES.map((v) => ({ value: v, label: String(v) }));
const SEG_INTERVALO = INTERVALO_ADREN_OPCOES.map((v) => ({ value: v, label: `${v} min` }));

/**
 * PCRFlow — main flow PCR React (port golden pcr.html/.js/.css).
 *
 * F-PCR-3.0 scaffold ✅ · 3.1 T1 idle ✅ · 3.2..3.7 T2 PCR ativa ✅ ·
 * 3.8 T3 pós-RCE ⏳ · 3.9 T4 salvar ⏳ · 3.10 histórico ⏳ · 3.11 ACLS|AHA ⏳.
 *
 * Mudanças clínicas pós-captura (pcr-comentarios-2026-05-28-pm.md):
 * - B1 (Gustavo): ícones por ritmo (pendente — placeholder via ActionTile icon='heart').
 * - B2 (Gustavo): botão "Checar ritmo/pulso" desde T1 (rodapé).
 * - B4/B7 (Gustavo): timers NÃO auto-reset (só por ação manual).
 * - B6 (Gustavo): janela adrenalina EXATA no tempo (não [m-1, m+1]).
 * - A7 (Luis): ACLS|AHA sub-tab "Fluxogramas" (era "Panfletos").
 */
export function PCRFlow({ onBack }) {
  const s = usePCRState();
  const [historico, setHistorico] = usePersistedState('pcr_historico', []);

  // UI state
  const [sairOpen, setSairOpen] = useState(false);
  const [ritmoOpen, setRitmoOpen] = useState(false);
  const [choqueOpen, setChoqueOpen] = useState(false);
  const [rceOpen, setRceOpen] = useState(false);
  const [encerrarOpen, setEncerrarOpen] = useState(false);
  const [pausarOpen, setPausarOpen] = useState(false);
  const [checkPulsoOpen, setCheckPulsoOpen] = useState(false);
  const [adrenDoubleTapOpen, setAdrenDoubleTapOpen] = useState(false);
  const [hhttOpen, setHhttOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  // ACLS|AHA modais ID-based (algoritmo · cuidados-pos · qualidade-rcp · tet-tam · tet-prof · vcv · pcv · null)
  const [aclsModalId, setAclsModalId] = useState(null);
  // F-PCR-3.6 Adicionar evento
  const [eventoOpen, setEventoOpen] = useState(false);
  const [outroOpen, setOutroOpen] = useState(false);
  const [contadoresEvento, setContadoresEvento] = useState({});
  const [eventosCustom, setEventosCustom] = useState([]);

  // §header anotação (FB-05 cross-protocolo)
  const [anotacaoOpen, setAnotacaoOpen] = useState(false);

  // §D27 golden · ao iniciar PCR, auto-abre Selecionar Ritmo em 350ms + TTS
  // (cronômetro já está rodando em background)
  useEffect(() => {
    if (s.iniciadoEm && s.telaAtual === 2 && s.ritmo === 'na' && !ritmoOpen) {
      if (s.audioOn) {
        falar('PCR iniciada. Inicie compressões.');
      }
      const id = setTimeout(() => setRitmoOpen(true), 350);
      return () => clearTimeout(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.iniciadoEm, s.telaAtual, s.ritmo]);

  const [toast, setToast] = useState(null);

  // Master timer — lazy init evita impure call (React 19)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  // §Áudio runtime · metrônomo segue bpm + audioOn (cleanup ao desligar).
  useEffect(() => {
    if (s.audioOn && s.iniciadoEm && !s.rce) {
      iniciarMetronomo(s.bpm);
    } else {
      pararMetronomo();
    }
    return () => pararMetronomo();
  }, [s.audioOn, s.iniciadoEm, s.bpm, s.rce]);

  // §RCE detectado → para metrônomo + TTS
  useEffect(() => {
    if (s.rce && s.audioOn) {
      pararMetronomo();
      falar('Retorno da circulação espontânea confirmado. Inicie os cuidados pós-parada.');
    }
  }, [s.rce, s.audioOn]);

  // Calculados (ciclo + adrenalina)
  const masterElapsed = s.iniciadoEm ? now - s.iniciadoEm : 0;
  const masterStr = formatDuracao(masterElapsed);

  const cicloElapsed = s.cicloIniciadoEm ? now - s.cicloIniciadoEm : 0;
  const cicloElapsedStr = formatDuracao(cicloElapsed);

  // Adrenalina · referência = última dose ou início do caso
  const adrenRef = s.ultimaAdrenalinaEm || s.iniciadoEm;
  const adrenElapsed = adrenRef ? now - adrenRef : 0;
  const adrenElapsedStr = formatDuracao(adrenElapsed);
  const adrenJanela = s.janelaAdren;

  // Estados visuais ciclo (B4/B7 · SEM auto-reset · permanece em cycle-end até ação)
  const cycleEndReached = cicloElapsed >= CICLO_MS;
  const cycle30sWarning = cicloElapsed >= CICLO_MS - 30 * 1000 && !cycleEndReached;

  // Estado card adrenalina (janela EXATA · B6)
  let adrenState = 'window-pre';
  if (adrenElapsed >= adrenJanela.fimMs) adrenState = 'window-overdue';
  else if (adrenElapsed >= adrenJanela.inicioMs) adrenState = 'window-ok';

  // §golden TTS alarmes (anti-spam via flags do state) — 30s · janela aberta · atrasada.
  // Declarado APÓS cicloElapsed/adrenState (depende deles).
  useEffect(() => {
    if (!s.iniciadoEm || s.rce || !s.audioOn) return;
    // 30s antes do marco 2:00
    if (cicloElapsed >= CICLO_MS - 30000 && cicloElapsed < CICLO_MS && !s.avisou30s) {
      falar('Trinta segundos. Prepare o desfibrilador.');
      s.setAvisou30s(true);
    }
    // Janela adrenalina aberta
    if (adrenState === 'window-ok' && !s.avisouAdrenJanela) {
      falar('Janela de adrenalina aberta.');
      s.setAvisouAdrenJanela(true);
    }
    // Adrenalina atrasada
    if (adrenState === 'window-overdue' && !s.avisouAdrenAtrasada) {
      falar('Atenção. Adrenalina atrasada.');
      s.setAvisouAdrenAtrasada(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cicloElapsed, adrenState, s.audioOn, s.iniciadoEm, s.rce]);

  // Toast helper — aceita onUndo opcional (NN/g heurística erro reversível).
  const showToast = (message, type = 'info', onUndo = null) => {
    setToast({ type, message, onUndo });
    setTimeout(() => setToast(null), onUndo ? 5000 : 3500);
  };

  // ============================================================
  // SAIR (header)
  // ============================================================
  const handleSair = () => {
    if (s.iniciadoEm || s.cicloAtual > 1 || s.adrenalinaCount > 0) {
      setSairOpen(true);
    } else {
      onBack();
    }
  };

  // ============================================================
  // AÇÕES CLÍNICAS
  // ============================================================
  const onSelecionarRitmo = (ritmo) => {
    const undo = s.setRitmoComUndo(ritmo);
    setRitmoOpen(false);
    // §auto-trigger 5H/5T após AESP/Assist (250ms · golden onda 2.2 D36)
    if (isNaoChocavel(ritmo)) {
      setTimeout(() => setHhttOpen(true), 250);
    }
    showToast(`Ritmo: ${getRitmoLabel(ritmo)}`, 'success', undo);
  };

  const onAplicarAdrenalina = () => {
    // §anti-double-tap < 30s
    if (s.adrenalinaDoubleTap()) {
      setAdrenDoubleTapOpen(true);
      return;
    }
    const undo = s.aplicarAdrenalina();
    showToast(`Adrenalina ×${s.adrenalinaCount + 1} aplicada`, 'success', undo);
  };

  const onConfirmAdrenDoubleTap = () => {
    setAdrenDoubleTapOpen(false);
    const undo = s.aplicarAdrenalina();
    showToast(`Adrenalina ×${s.adrenalinaCount + 1} aplicada`, 'success', undo);
  };

  const onAplicarChoque = (foiAplicado) => {
    setChoqueOpen(false);
    if (foiAplicado) {
      const carga = getCargaInicial(s.idade, s.peso);
      const undo = s.registrarChoque(carga);
      showToast(`Choque registrado · ${carga}`, 'success', undo);
    }
  };

  const onConfirmarRCE = (criterios) => {
    setRceOpen(false);
    s.confirmarRCE(criterios);
    showToast('RCE confirmado · vai pra cuidados pós-PCR', 'success');
  };

  const onEncerrarSemRCE = (motivo) => {
    setEncerrarOpen(false);
    s.encerrarSemRCE(motivo);
    showToast(`PCR encerrada · ${motivo === 'obito' ? 'Óbito' : 'Suspensa'}`, 'warning');
  };

  const onPausar = () => {
    setPausarOpen(false);
    s.registrarEvento('PCR pausada', '');
    showToast('PCR pausada', 'info');
  };

  // §B2 Gustavo · Checar pulso/ritmo desde T1
  const onCheckarPulsoComPulso = () => {
    setCheckPulsoOpen(false);
    setRceOpen(true);
  };

  const onCheckarPulsoSemPulso = () => {
    setCheckPulsoOpen(false);
    s.checarPulsoRitmoConfirmado();
    showToast(`Ciclo ${s.cicloAtual + 1} iniciado · checar ritmo`, 'info');
    setRitmoOpen(true);
  };

  // ============================================================
  // T1 · IDLE
  // ============================================================
  const t1 = (
    <div className={styles.tela}>
      <TimerCard
        label="Compressões"
        value="00:00"
        meta="Aguardando"
        description="Cadência alvo · 100-120/min"
        state="idle"
      />
      <TimerCard
        label="Adrenalina · ×0"
        value="00:00"
        meta="Aguardando 1ª dose"
        description={`Janela exata em ${s.intervaloAdrenalinaMin} min após o início`}
        state="idle"
      />
    </div>
  );

  // ============================================================
  // T2 · PCR ATIVA (F-PCR-3.2..3.7)
  // ============================================================
  // Banner contextual dinâmico
  const renderBanner = () => {
    if (!bannerVisible) return null;
    if (cycleEndReached) {
      return (
        <BannerContextual
          tone="critical"
          title={`Marco ${s.cicloAtual} · CHECAR PULSO/RITMO`}
          description="Troque o compressor · checar pulso central por até 10s."
          pulse
          onDismiss={() => setBannerVisible(false)}
        />
      );
    }
    if (cycle30sWarning) {
      const segRestante = Math.max(0, Math.floor((CICLO_MS - cicloElapsed) / 1000));
      return (
        <BannerContextual
          tone="critical"
          title={`${segRestante}s · prepare desfibrilador`}
          description="Aproxime o monitor, mantenha compressões."
          onDismiss={() => setBannerVisible(false)}
        />
      );
    }
    return (
      <BannerContextual
        tone="warning"
        title={`Mantenha compressões ${s.bpm}/min`}
        description={`Ciclo ${s.cicloAtual} · ${Math.floor(cicloElapsed / 1000)}s desde o início.`}
        onDismiss={() => setBannerVisible(false)}
      />
    );
  };

  // Eventos formatados pra EventList (mais novo no topo é feito dentro do EventList)
  const eventosFormatados = s.eventos.map((ev, i) => ({
    id: `${ev.hora}-${i}`,
    time: formatHora(ev.hora),
    offset: formatOffset(ev.hora, s.iniciadoEm),
    title: ev.acao,
    tag: ev.tag || undefined,
  }));

  const cargaInicialLabel = getCargaInicial(s.idade, s.peso);
  const ritmoLabel = s.ritmo === 'na' ? 'Não avaliado' : getRitmoLabel(s.ritmo);
  const desfibrilarDisabled = !isChocavel(s.ritmo);

  const t2 = (
    <div className={styles.tela}>
      {renderBanner()}

      {/* Card Compressões · running (B4: NÃO auto-reset · permanece cycle-end até ação) */}
      <TimerCard
        label="Compressões"
        value={cicloElapsedStr}
        meta={cycleEndReached ? `MARCO ${s.cicloAtual} · CHECAR` : `Ciclo ${s.cicloAtual}`}
        description={cycleEndReached
          ? 'Aja: Checar pulso/ritmo para iniciar próximo ciclo.'
          : `Cadência ${s.bpm}/min · alvo 100-120/min`}
        state={cycleEndReached ? 'cycle-end' : 'running'}
        onInfo={() => setAclsModalId('qualidade-rcp')}
        size="lg"
      >
        <Segmented
          options={SEG_BPM}
          value={s.bpm}
          onChange={s.setBpm}
          block
        />
      </TimerCard>

      {/* Card Adrenalina · janela EXATA (B6) */}
      <TimerCard
        label={`Adrenalina · ×${s.adrenalinaCount}`}
        value={adrenElapsedStr}
        meta={
          adrenState === 'window-overdue' ? 'ATRASADA'
            : adrenState === 'window-ok' ? 'JANELA ABERTA'
              : `Próxima em ${s.intervaloAdrenalinaMin} min`
        }
        description={s.ultimaAdrenalinaEm
          ? `Desde a última dose · alvo a cada ${s.intervaloAdrenalinaMin} min`
          : `Janela aberta em ${s.intervaloAdrenalinaMin} min (após início)`}
        state={adrenState}
        onInfo={() => showToast('Adrenalina · 1 mg IV/IO 3-5 min · diluir 1:10 em SF', 'success')}
        size="lg"
      >
        <Segmented
          options={SEG_INTERVALO}
          value={s.intervaloAdrenalinaMin}
          onChange={s.setIntervaloAdrenalinaMin}
          block
        />
        <Button
          variant={adrenState === 'window-overdue' ? 'danger' : 'primary'}
          size="md"
          onClick={onAplicarAdrenalina}
        >
          Apliquei agora
        </Button>
      </TimerCard>

      {/* Linha de ações grandes · golden btn-acao-grande */}
      <div className={styles.actionsRow}>
        <ActionTile
          icon="heart"
          label="Selecionar ritmo"
          value={ritmoLabel}
          onClick={() => setRitmoOpen(true)}
        />
        <ActionTile
          icon="zap"
          label="Desfibrilar"
          value={cargaInicialLabel}
          disabled={desfibrilarDisabled}
          onClick={() => setChoqueOpen(true)}
        />
      </div>

      {/* Linha do tempo · EventList collapsible */}
      <EventList events={eventosFormatados} defaultOpen={s.eventos.length > 0 && s.eventos.length <= 3} />

      {/* FAB Adicionar evento (F-PCR-3.6) */}
      <div className={styles.fabAnchor}>
        <FAB
          icon="plus"
          ariaLabel="Adicionar evento"
          onClick={() => setEventoOpen(true)}
        />
      </div>
    </div>
  );

  // ============================================================
  // T3 · PÓS-RCE (F-PCR-3.8 · Luis A1-A4 aplicados: STEMI→SCA, sem ETCO2,
  // Nora não NE, CDT 32-37,5 não TTM 32-36)
  // ============================================================
  const cuidadosT3 = [
    { tone: 'critical', title: 'ECG 12 derivações', desc: 'Identificar SCA. Cateterismo urgente se infarto.' },
    { tone: 'warning', title: 'Estabilizar via aérea', desc: 'Confirmar IOT com capnografia.' },
    { tone: 'warning', title: 'SpO₂ 90-98%', desc: 'Evite hiperóxia. Decúbito lateral se sem IOT.' },
    { tone: 'info', title: 'Volume e vasopressor', desc: 'PAM ≥ 65. Cristaloide se hipovolemia. Nora 0,01-1 mcg/kg/min.' },
    { tone: 'info', title: 'CDT 32-37,5 °C por 24h', desc: 'Controle térmico se paciente inconsciente.' },
  ];

  const t3 = (
    <div className={styles.tela}>
      <BannerContextual
        tone="success"
        title="Decúbito lateral · SpO₂ 90-98%"
        description="ECG urgente · estabilizar via aérea · controle térmico."
      />
      <div className={styles.cuidadosList}>
        {cuidadosT3.map((c, i) => (
          <div key={i} className={styles.cuidadoItem} data-tone={c.tone}>
            <span className={styles.cuidadoBullet} aria-hidden="true" />
            <div className={styles.cuidadoContent}>
              <span className={styles.cuidadoTitle}>{c.title}</span>
              <span className={styles.cuidadoDesc}>{c.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <BannerContextual
        tone="warning"
        title="Atento à recidiva"
        description="Se a parada voltar, toque 'Registrar nova parada'. O cronômetro do caso continua o mesmo."
      />
    </div>
  );

  // ============================================================
  // T4 · SALVAR PACIENTE (F-PCR-3.9 · Luis A5: SEM campo altura)
  // ============================================================
  const t4 = (
    <div className={styles.tela}>
      <div className={styles.formStack}>
        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="t4-iniciais">Iniciais</label>
          <input
            id="t4-iniciais"
            type="text"
            maxLength={6}
            className={styles.formInput}
            value={s.paciente.iniciais || ''}
            onChange={(e) => s.setPaciente({ ...s.paciente, iniciais: e.target.value.toUpperCase() })}
            placeholder="ex.: J.S.M."
          />
          <span className={styles.formHelper}>Apoio à memória. LGPD: nunca substitui prontuário.</span>
        </div>

        <div className={styles.formRow2}>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="t4-idade-anos">Idade (anos)</label>
            <input
              id="t4-idade-anos"
              type="text"
              inputMode="numeric"
              maxLength={3}
              className={styles.formInput}
              value={s.paciente.idadeAnos || ''}
              onChange={(e) => s.setPaciente({ ...s.paciente, idadeAnos: e.target.value })}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel} htmlFor="t4-idade-meses">Meses</label>
            <input
              id="t4-idade-meses"
              type="text"
              inputMode="numeric"
              maxLength={2}
              className={styles.formInput}
              value={s.paciente.idadeMeses || ''}
              onChange={(e) => s.setPaciente({ ...s.paciente, idadeMeses: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="t4-peso">Peso (kg)</label>
          <input
            id="t4-peso"
            type="text"
            inputMode="decimal"
            maxLength={5}
            className={styles.formInput}
            value={s.peso || ''}
            onChange={(e) => s.setPeso(e.target.value)}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Sexo</label>
          <div className={styles.chipsRow}>
            {[
              { value: 'ni', label: 'Não informado' },
              { value: 'm', label: 'Masculino' },
              { value: 'f', label: 'Feminino' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.chip}
                data-selected={s.paciente.sexo === opt.value ? 'true' : 'false'}
                onClick={() => s.setPaciente({ ...s.paciente, sexo: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Desfecho</label>
          <div className={styles.chipsRow}>
            {[
              { value: 'revertida', label: 'Revertida' },
              { value: 'nao-revertida', label: 'Não revertida' },
              { value: 'obito', label: 'Óbito' },
              { value: 'suspensa', label: 'Suspensa' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.chip}
                data-selected={s.paciente.desfecho === opt.value ? 'true' : 'false'}
                onClick={() => s.setPaciente({ ...s.paciente, desfecho: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="t4-obs">Observações</label>
          <textarea
            id="t4-obs"
            rows={4}
            className={styles.formTextarea}
            value={s.paciente.obs || ''}
            onChange={(e) => s.setPaciente({ ...s.paciente, obs: e.target.value })}
            placeholder="Ritmo predominante, drogas usadas, intercorrências, etc."
          />
        </div>
      </div>
    </div>
  );

  const telas = { 1: t1, 2: t2, 3: t3, 4: t4 };

  // ============================================================
  // FOOTERS
  // ============================================================
  const footerT1 = {
    hint: 'Iniciar cronômetros e operação',
    secondary: {
      label: 'Checar ritmo/pulso',
      variant: 'secondary',
      size: 'lg',
      onClick: () => setCheckPulsoOpen(true),
    },
    primary: {
      label: 'Iniciar PCR',
      size: 'lg',
      onClick: s.iniciarPCR,
    },
  };

  // T2 tem 3 botões customizados (Pausa · Stop · RCE)
  const footerT2 = {
    actions: [
      { label: 'Pausa', variant: 'ghost', size: 'lg', onClick: () => setPausarOpen(true) },
      { label: 'Stop', variant: 'danger', size: 'lg', onClick: () => setEncerrarOpen(true) },
      { label: 'RCE', variant: 'primary', size: 'lg', onClick: () => setRceOpen(true) },
    ],
  };

  // T3 footer · 3 ações (Finalizar/Nova PCR/Salvar paciente)
  const footerT3 = {
    actions: [
      { label: 'Finalizar', variant: 'ghost', size: 'md', onClick: () => setEncerrarOpen(true) },
      { label: 'Nova PCR', variant: 'secondary', size: 'md', onClick: () => s.registrarRecidiva() },
      { label: 'Salvar paciente', variant: 'primary', size: 'md', onClick: () => s.irParaTela(4) },
    ],
  };

  // T4 footer · secondary + primary (gate iniciais ≥1)
  const iniciaisOk = (s.paciente.iniciais || '').trim().length > 0;
  const salvarPacienteT4 = () => {
    if (!iniciaisOk) return;
    const novoCaso = {
      id: Date.now(),
      iniciais: s.paciente.iniciais,
      data: new Date().toISOString(),
      // §A6 Luis · campo Início (timestamp iniciadoEm)
      iniciadoEm: s.iniciadoEm,
      duracaoMs: s.iniciadoEm ? Date.now() - s.iniciadoEm : 0,
      duration: formatDuracao(s.iniciadoEm ? Date.now() - s.iniciadoEm : 0),
      date: new Date().toLocaleString('pt-BR'),
      desfecho: s.paciente.desfecho,
      sexo: s.paciente.sexo,
      idade: s.paciente.idadeAnos,
      idadeMeses: s.paciente.idadeMeses,
      peso: s.peso,
      ritmoFinal: s.ritmo,
      adrenalinaCount: s.adrenalinaCount,
      ciclos: s.cicloAtual,
      obs: s.paciente.obs,
      eventos: [...s.eventos],
      anonimo: false,
    };
    setHistorico([novoCaso, ...historico]);
    showToast('Paciente salvo · Caso arquivado no histórico.', 'success');
    setTimeout(() => {
      s.resetarEstado();
      onBack();
    }, 1500);
  };
  const footerT4 = {
    secondary: { label: 'Sair sem salvar', variant: 'ghost', size: 'lg', onClick: () => setSairOpen(true) },
    primary: { label: 'Salvar paciente', variant: 'primary', size: 'lg', onClick: salvarPacienteT4, disabled: !iniciaisOk },
  };

  const footers = { 1: footerT1, 2: footerT2, 3: footerT3, 4: footerT4 };

  // ============================================================
  // HISTÓRICO / TEORIA
  // ============================================================
  // §A6 Luis · cada caso ganha campo `subtitle` com Início HH:MM:SS pra HistoryView mostrar.
  // §HistoryView aceita cases [{ initials, status, statusTone, date, duration }] — vou adaptar.
  const historicoFormatado = historico.map((c) => ({
    id: c.id,
    initials: c.iniciais || c.initials,
    status: c.desfecho === 'revertida' ? 'Revertida' : c.desfecho === 'obito' ? 'Óbito' : c.desfecho === 'suspensa' ? 'Suspensa' : 'Não revertida',
    // §A6 · "Início" no campo date secundário (DD/MM HH:MM:SS)
    date: c.iniciadoEm
      ? `Início ${new Date(c.iniciadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
      : c.date,
    duration: c.duration || formatDuracao(c.duracaoMs),
  }));

  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos PCR encerrados neste aparelho."
      cases={historicoFormatado}
    />
  );

  // ============================================================
  // ACLS | AHA (F-PCR-3.11 · Luis A7 "Fluxogramas")
  // ============================================================
  const isPediatrico = s.teoriaAP === 'pediatrico';
  const pesoNum = parseNumber(s.peso);

  const cargasPed = pesoNum && !isNaN(pesoNum) ? calcCargasPediatricas(pesoNum) : null;
  const dosesPed = pesoNum && !isNaN(pesoNum) ? calcDosesPediatricas(pesoNum) : null;
  const lidoAdulto = pesoNum && !isNaN(pesoNum) ? calcLidocainaAdulto(pesoNum) : null;

  const renderFluxogramas = () => (
    <div className={styles.aclsStack}>
      <OptionCard
        title="Algoritmo PCR"
        description={isPediatrico
          ? 'Passo a passo · reconhecer, RCP 30:2 (15:2 com 2 socorristas), ritmo, IV/IO.'
          : 'Passo a passo · reconhecer, RCP, choque, adrenalina, reavaliar.'}
        onClick={() => setAclsModalId('algoritmo')}
      />
      <OptionCard
        title="Causas reversíveis"
        description="5H + 5T · ritmo não-chocável."
        onClick={() => setHhttOpen(true)}
      />
      <OptionCard
        title="Cuidados pós-PCR"
        description={isPediatrico
          ? 'Estabilização após RCE · via aérea, hemodinâmica, normotermia, neuroproteção.'
          : 'Estabilização após RCE · via aérea, hemodinâmica, neuroproteção.'}
        onClick={() => setAclsModalId('cuidados-pos')}
      />
      <OptionCard
        title="Qualidade RCP"
        description={isPediatrico
          ? 'Frequência, profundidade 1/3 do tórax, retorno completo, interrupções.'
          : 'Frequência, profundidade ≥ 5 cm, retorno completo, interrupções.'}
        onClick={() => setAclsModalId('qualidade-rcp')}
      />
    </div>
  );

  const renderCargasDoses = () => (
    <div className={styles.aclsStack}>
      {/* Input peso · só pediátrico precisa explicitamente (cálculos dinâmicos) */}
      {isPediatrico && (
        <InputField
          label="Peso do paciente"
          type="text"
          mono
          inputMode="decimal"
          value={s.peso || ''}
          onChange={s.setPeso}
          placeholder=""
          showUnit
          unit="kg"
        />
      )}

      {/* Desfibrilação */}
      <AlertCard
        level="info"
        title="Desfibrilação"
        showValue
        value={isPediatrico && cargasPed ? `${cargasPed.primeiro}` : '200'}
        unit={isPediatrico && cargasPed ? 'J · 2 J/kg' : 'J · bifásico'}
      >
        {isPediatrico && cargasPed
          ? `Pediátrico (${pesoNum} kg) · 1º choque ${cargasPed.primeiro} J · 2º ${cargasPed.segundo} J · subsequentes até ${cargasPed.maximo} J (10 J/kg, máx dose adulto).`
          : isPediatrico
            ? 'Pediátrico: 2-4 J/kg · informe o peso pra cálculo.'
            : 'Adulto · 200 J bifásico · escalonar até 360 J. Repetir após cada ciclo 2 min.'}
      </AlertCard>

      {/* Adrenalina */}
      <AlertCard
        level="info"
        title="Adrenalina"
        showValue
        value={isPediatrico && dosesPed ? `${dosesPed.adrenaMg}` : '1'}
        unit="mg IV/IO"
      >
        {isPediatrico && dosesPed
          ? `Pediátrico (${pesoNum} kg) · 0,01 mg/kg = ${dosesPed.adrenaMg} mg IV/IO a cada 3-5 min · diluir 1 mg em 10 mL SF (1:10).`
          : isPediatrico
            ? 'Pediátrico: 0,01 mg/kg IV/IO · informe peso pra cálculo.'
            : 'Bolus 1 mg IV/IO a cada 3-5 min · ampola 1 mg/mL sem diluir. FV/TV após 2º choque · AESP/Assistolia imediato.'}
      </AlertCard>

      {/* Amiodarona */}
      <AlertCard
        level="info"
        title="Amiodarona"
        showValue
        value={isPediatrico && dosesPed ? `${dosesPed.amioMg}` : '300 + 150'}
        unit={isPediatrico ? 'mg IV/IO (5 mg/kg)' : 'mg IV/IO'}
      >
        {isPediatrico && dosesPed
          ? `Pediátrico (${pesoNum} kg) · 5 mg/kg = ${dosesPed.amioMg} mg em bolus · pode repetir até 15 mg/kg total.`
          : isPediatrico
            ? 'Pediátrico: 5 mg/kg · informe peso.'
            : 'FV/TV refratária · 1ª dose 300 mg bolus · 2ª dose 150 mg após próximo choque. Diluir em SG 5% 20 mL.'}
      </AlertCard>

      {/* Lidocaína */}
      <AlertCard
        level="info"
        title="Lidocaína"
        showValue
        value={isPediatrico && dosesPed ? `${dosesPed.lidoMg}` : lidoAdulto ? `${lidoAdulto.d1}-${lidoAdulto.d2}` : '1-1,5 mg/kg'}
        unit={isPediatrico ? 'mg IV/IO (1 mg/kg)' : lidoAdulto ? `mg · máx ${lidoAdulto.dmax}` : ''}
      >
        {isPediatrico && dosesPed
          ? `Pediátrico (${pesoNum} kg) · 1 mg/kg = ${dosesPed.lidoMg} mg em bolus.`
          : lidoAdulto
            ? `Adulto (${pesoNum} kg) · 1ª dose 1-1,5 mg/kg (${lidoAdulto.d1}-${lidoAdulto.d2} mg) · doses seguintes 0,5-0,75 mg/kg até ${lidoAdulto.dmax} mg total. Alternativa Amio em FV/TV refratária.`
            : 'Alternativa Amio em FV/TV refratária. 1ª dose 1-1,5 mg/kg · doses seguintes 0,5-0,75 mg/kg até 3 mg/kg total. Informe peso pra calcular.'}
      </AlertCard>

      {/* Magnésio */}
      <AlertCard
        level="info"
        title="Magnésio"
        showValue
        value="1-2"
        unit="g IV/IO"
      >
        Indicação específica · Torsades de Pointes. Sulfato de Magnésio 1-2 g diluído em 10 mL SG 5% em bolus.
      </AlertCard>
    </div>
  );

  const renderViaAerea = () => (
    <div className={styles.aclsStack}>
      {isPediatrico && (
        <OptionCard
          title="Tamanho do Tubo (TET)"
          description="Diâmetro interno por idade · sem ou com cuff."
          onClick={() => setAclsModalId('tet-tam')}
        />
      )}
      {isPediatrico && (
        <OptionCard
          title="Profundidade do TET"
          description="Calcula pelo tubo, altura ou peso."
          onClick={() => setAclsModalId('tet-prof')}
        />
      )}
      <OptionCard
        title="VCV · Ventilação Controlada Volume"
        description={isPediatrico
          ? 'Volume alvo · varia por faixa etária.'
          : 'Volume alvo · 6-8 mL/kg peso predito.'}
        onClick={() => setAclsModalId('vcv')}
      />
      <OptionCard
        title="PCV · Ventilação Controlada Pressão"
        description={isPediatrico
          ? 'Pressão alvo · varia por faixa etária.'
          : 'Pressão alvo · 12-20 cmH₂O inicial.'}
        onClick={() => setAclsModalId('pcv')}
      />
    </div>
  );

  const teoriaView = (
    <div className={styles.tela}>
      <StepHeader
        title="ACLS | AHA"
        subtitle="Referência rápida ACLS / AHA 2025."
      />

      <Segmented
        options={[
          { value: 'adulto', label: 'Adulto' },
          { value: 'pediatrico', label: 'Pediátrico' },
        ]}
        value={s.teoriaAP}
        onChange={s.setTeoriaAP}
      />

      <div className={styles.aclsSubTabs} role="tablist">
        <ToggleTab
          label="Fluxogramas"
          active={s.teoriaSubAtiva === 'fluxogramas'}
          onClick={() => s.setTeoriaSubAtiva('fluxogramas')}
        />
        <ToggleTab
          label="Cargas e Doses"
          active={s.teoriaSubAtiva === 'cargas-doses'}
          onClick={() => s.setTeoriaSubAtiva('cargas-doses')}
        />
        <ToggleTab
          label="Via Aérea"
          active={s.teoriaSubAtiva === 'via-aerea'}
          onClick={() => s.setTeoriaSubAtiva('via-aerea')}
        />
      </div>

      {s.teoriaSubAtiva === 'fluxogramas' && renderFluxogramas()}
      {s.teoriaSubAtiva === 'cargas-doses' && renderCargasDoses()}
      {s.teoriaSubAtiva === 'via-aerea' && renderViaAerea()}
    </div>
  );

  // ============================================================
  // CHIPS HEADER
  // ============================================================
  const chips = [];
  if (s.cicloAtual > 0) chips.push({ label: `Ciclo ${s.cicloAtual}`, mono: true });
  if (s.adrenalinaCount > 0) chips.push({ label: `Adren ×${s.adrenalinaCount}`, mono: true });
  if (s.ritmo && s.ritmo !== 'na') {
    const tone = isChocavel(s.ritmo) ? 'critico' : isNaoChocavel(s.ritmo) ? 'atencao' : undefined;
    chips.push({ label: getRitmoLabel(s.ritmo), tone });
  }
  if (s.rce) chips.push({ label: 'RCE', tone: 'novo' });

  return (
    <>
      <ProtocolShell
        domain="pcr"
        title="Modo PCR"
        subtitle={s.iniciadoEm ? `Aberto há ${masterStr}` : 'Aguardando início'}
        onBack={handleSair}
        actions={[
          // §header golden: Audio toggle + Anotação (badge se preenchida) · Sair via onBack.
          {
            icon: s.audioOn ? 'audio' : 'audio-mute',
            label: s.audioOn ? 'Áudio ligado' : 'Áudio desligado',
            onClick: () => {
              const proximo = !s.audioOn;
              s.toggleAudio();
              if (proximo) {
                falar('Áudio ligado');
              } else {
                pararFala();
                pararMetronomo();
              }
            },
            active: s.audioOn,
          },
          {
            icon: 'edit',
            label: 'Anotar',
            onClick: () => setAnotacaoOpen(true),
            active: !!s.anotacao?.trim(),
          },
        ]}
        chips={chips}
        steps={undefined}
        activeTab={s.abaAtual}
        onTabChange={s.setAbaAtual}
        tabs={PCR_TABS}
        executar={telas[s.telaAtual] || t1}
        historico={historicoView}
        teoria={teoriaView}
        footer={footers[s.telaAtual]}
      />

      {/* Sair confirm */}
      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do Modo PCR?"
        description="O caso continua aberto neste aparelho · você retoma pelo hub."
        confirmLabel="Sair (PCR continua)"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />

      {/* Decisão clínica modais */}
      <SelecionarRitmoSheet open={ritmoOpen} onClose={() => setRitmoOpen(false)} onSelect={onSelecionarRitmo} />
      <AplicarChoqueSheet open={choqueOpen} onClose={() => setChoqueOpen(false)} cargaLabel={cargaInicialLabel} onConfirm={onAplicarChoque} />
      <ConfirmarRCESheet open={rceOpen} onClose={() => setRceOpen(false)} onConfirm={onConfirmarRCE} />
      <EncerrarSemRCESheet open={encerrarOpen} onClose={() => setEncerrarOpen(false)} onConfirm={onEncerrarSemRCE} />
      <PausarSheet open={pausarOpen} onClose={() => setPausarOpen(false)} onConfirm={onPausar} />
      <CheckarPulsoRitmoSheet
        open={checkPulsoOpen}
        onClose={() => setCheckPulsoOpen(false)}
        onComPulso={onCheckarPulsoComPulso}
        onSemPulso={onCheckarPulsoSemPulso}
      />
      <AdrenDoubleTapSheet
        open={adrenDoubleTapOpen}
        onClose={() => setAdrenDoubleTapOpen(false)}
        segundosDesde={s.ultimaAdrenalinaEm ? Math.floor((now - s.ultimaAdrenalinaEm) / 1000) : 0}
        onConfirm={onConfirmAdrenDoubleTap}
      />
      <HHTTSheet open={hhttOpen} onClose={() => setHhttOpen(false)} />

      {/* Anotação · FB-05 cross-protocolo */}
      <AnnotationSheet
        open={anotacaoOpen}
        onClose={() => setAnotacaoOpen(false)}
        value={s.anotacao}
        onChange={s.setAnotacao}
        onSave={() => {
          s.setAnotacaoEditadaEm(new Date().toISOString());
          setAnotacaoOpen(false);
          showToast('Anotação salva', 'success');
        }}
        onClear={() => {
          s.setAnotacao('');
          s.setAnotacaoEditadaEm(null);
        }}
      />

      {/* Adicionar evento · F-PCR-3.6 · após aplicar, fecha sheet + toast com Undo */}
      <AdicionarEventoSheet
        open={eventoOpen}
        onClose={() => setEventoOpen(false)}
        contadores={contadoresEvento}
        eventosCustom={eventosCustom}
        onApply={(evento, tag) => {
          const prevCount = contadoresEvento[evento.key] || 0;
          const nextCount = prevCount + 1;
          setContadoresEvento({ ...contadoresEvento, [evento.key]: nextCount });
          const sufixo = nextCount > 1 ? ` · ${nextCount}ª aplicação` : '';
          s.registrarEvento(`${evento.nome} aplicado${sufixo}`, tag);
          // Undo: reverte contador + pop último evento.
          const undo = () => {
            setContadoresEvento({ ...contadoresEvento, [evento.key]: prevCount });
            s.desfazerUltimoEvento();
          };
          // §Luis PM4 · auto-fecha + volta pra T2 + toast undo (NN/g visibility)
          setEventoOpen(false);
          showToast(`${evento.nome} registrada`, 'success', undo);
        }}
        onOutro={() => {
          setEventoOpen(false);
          setOutroOpen(true);
        }}
      />

      {/* Outro evento custom · golden abrirEventoCustomizado */}
      <OutroEventoSheet
        open={outroOpen}
        onClose={() => setOutroOpen(false)}
        onAdd={({ nome, dose }) => {
          const novoKey = `custom-${Date.now()}`;
          const novoCard = { key: novoKey, nome, dose };
          setEventosCustom([...eventosCustom, novoCard]);
          // aplica imediato
          const prevCount = 0;
          setContadoresEvento({ ...contadoresEvento, [novoKey]: 1 });
          const labelTexto = dose ? `${nome} · ${dose}` : nome;
          s.registrarEvento(labelTexto, 'droga');
          const undo = () => {
            setEventosCustom(eventosCustom);
            setContadoresEvento({ ...contadoresEvento, [novoKey]: prevCount });
            s.desfazerUltimoEvento();
          };
          setOutroOpen(false);
          showToast(`${nome} registrado`, 'success', undo);
        }}
      />

      {/* ACLS|AHA modais (Fluxogramas + Via Aérea) */}
      <InfoSheet
        open={aclsModalId === 'algoritmo'}
        onClose={() => setAclsModalId(null)}
        title={isPediatrico ? 'Algoritmo PCR Pediátrico' : 'Algoritmo PCR'}
      >
        <PanfletoPlaceholder
          title={isPediatrico ? 'Algoritmo PCR Pediátrico' : 'Algoritmo PCR'}
        />
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'cuidados-pos'}
        onClose={() => setAclsModalId(null)}
        title={isPediatrico ? 'Cuidados pós-PCR Pediátrico' : 'Cuidados pós-PCR'}
      >
        <PanfletoPlaceholder
          title={isPediatrico ? 'Cuidados pós-PCR Pediátrico' : 'Cuidados pós-PCR'}
        />
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'qualidade-rcp'}
        onClose={() => setAclsModalId(null)}
        title={isPediatrico ? 'Qualidade RCP Pediátrico' : 'Qualidade RCP'}
      >
        <PanfletoPlaceholder
          title={isPediatrico ? 'Qualidade RCP Pediátrico' : 'Qualidade RCP'}
        />
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'tet-tam'}
        onClose={() => setAclsModalId(null)}
        title="Tamanho do Tubo (TET)"
      >
        <TETTabela rows={TET_TAMANHO_ROWS} />
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'tet-prof'}
        onClose={() => setAclsModalId(null)}
        title="Profundidade do TET"
      >
        <PanfletoPlaceholder title="TET Profundidade · 3 fórmulas (tubo × 3 · altura/10+5 · 6+peso)" />
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'vcv'}
        onClose={() => setAclsModalId(null)}
        title={isPediatrico ? 'VCV Pediátrico' : 'VCV · Ventilação Controlada Volume'}
      >
        {isPediatrico ? (
          <PanfletoPlaceholder title="VCV Pediátrico · faixa etária + VENT_PEDIATRIA" />
        ) : (
          <PanfletoPlaceholder title="VCV Adulto · altura+sexo → peso predito ARDSnet → VC 6-8 × pp" />
        )}
      </InfoSheet>

      <InfoSheet
        open={aclsModalId === 'pcv'}
        onClose={() => setAclsModalId(null)}
        title={isPediatrico ? 'PCV Pediátrico' : 'PCV · Ventilação Controlada Pressão'}
      >
        {isPediatrico ? (
          <PanfletoPlaceholder title="PCV Pediátrico · faixa etária + VENT_PEDIATRIA" />
        ) : (
          <PanfletoPlaceholder title="PCV Adulto · pressão pico 12-20 cmH₂O · FR 10-12 · PEEP 5 · FiO₂ 100% · I:E 1:2" />
        )}
      </InfoSheet>

      {/* Toast sticky */}
      {toast && (
        <div className={styles.toastWrap}>
          <Toast
            type={toast.type === 'success' ? 'success' : 'error'}
            message={toast.message}
            onUndo={toast.onUndo ? () => { toast.onUndo(); setToast(null); } : undefined}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
}
