import { useEffect, useState } from 'react';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { BannerContextual } from '../../shared/components/organisms/BannerContextual';
import { EventList } from '../../shared/components/organisms/EventList';
import { Timeline } from '../../shared/components/organisms/Timeline';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { PanfletoPlaceholder } from '../../shared/components/organisms/PanfletoPlaceholder';
import { TETTabela } from '../../shared/components/organisms/TETTabela';
import { TET_TAMANHO_ROWS } from '../../shared/components/organisms/TETTabela/tetData';
import { ActionTile } from '../../shared/components/molecules/ActionTile/ActionTile';
import { RitmoIcon } from '../../shared/components/molecules/RitmoIcon';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { ToggleTab } from '../../shared/components/molecules/ToggleTab';
import { InputField } from '../../shared/components/molecules/InputField';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { SheetSection, SheetDetailRow, SheetText } from '../../shared/components/molecules/sheet';
import { Button } from '../../shared/components/atoms/Button';
import { Icon } from '../../shared/components/atoms/Icon';
import { FAB } from '../../shared/components/atoms/FAB';
import { Toast } from '../../shared/components/molecules/Toast';
import { ConfirmSheet, InfoSheet, AnnotationSheet, DetailSheet, FormSheet } from '../../shared/components/overlays/patterns';
import { BottomSheet } from '../../shared/components/overlays/BottomSheet';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { usePCRState } from './hooks/usePCRState';
import {
  CICLO_MS, BPM_OPCOES, INTERVALO_ADREN_OPCOES, HISTORICO_FILTROS,
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
  VCVSheet, PCVSheet, TETProfundidadeSheet,
} from './pcrModais';
import { iniciarMetronomo, pararMetronomo, falar, pararFala } from './pcrAudio';
import styles from './PCRFlow.module.css';

const PCR_TABS = [
  { id: 'executar', label: 'Executar', icon: 'play' },
  { id: 'historico', label: 'Histórico', icon: 'tempo' },
  { id: 'teoria', label: 'ACLS | AHA', icon: 'livro' },
];

const SEG_BPM = BPM_OPCOES.map((v) => ({ value: v, label: `${v} BPM` }));
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
  const [salvarOpen, setSalvarOpen] = useState(false);
  const [novaPcrOpen, setNovaPcrOpen] = useState(false);
  const [pausarOpen, setPausarOpen] = useState(false);
  const [checarOpen, setCheckarOpen] = useState(false);
  // §contexto de abertura do SelecionarRitmoSheet · define o que acontece ao escolher:
  //  'inicial'  → pós-Iniciar PCR (registra ritmo, NÃO incrementa ciclo)
  //  'recheck'  → pós-"Checar ritmo/pulso" sem pulso (registra + novo ciclo)
  //  'manual'   → tile "Selecionar ritmo" na T2 (atualização avulsa do ritmo)
  const [ritmoContext, setRitmoContext] = useState('manual');
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

  // §Histórico · detalhe + filtros + excluir
  const [casoIdxAberto, setCasoIdxAberto] = useState(null);
  const [excluirIdx, setExcluirIdx] = useState(null);
  const [histFiltro, setHistFiltro] = useState('todas');

  // §F04 Gustavo · ao iniciar PCR, TTS incentiva iniciar compressões (NÃO auto-abre ritmo —
  // o fluxo agora pede ação explícita "Iniciar compressões"; ritmo é checado depois pelo médico).
  useEffect(() => {
    if (s.iniciadoEm && s.telaAtual === 2 && s.audioOn && !s.cicloIniciadoEm) {
      falar('PCR iniciada. Inicie as compressões.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.iniciadoEm]);

  const [toast, setToast] = useState(null);

  // Master timer — lazy init evita impure call (React 19)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  // §Áudio runtime · metrônomo só toca quando as COMPRESSÕES iniciam (F04 · não no Iniciar PCR).
  useEffect(() => {
    if (s.audioOn && s.cicloIniciadoEm && !s.rce) {
      iniciarMetronomo(s.bpm);
    } else {
      pararMetronomo();
    }
    return () => pararMetronomo();
  }, [s.audioOn, s.cicloIniciadoEm, s.bpm, s.rce]);

  // §RCE detectado → para metrônomo + TTS
  useEffect(() => {
    if (s.rce && s.audioOn) {
      pararMetronomo();
      falar('Retorno da circulação espontânea confirmado. Inicie os cuidados pós-parada.');
    }
  }, [s.rce, s.audioOn]);

  // Ao desmontar (sair da PCR por qualquer caminho), silencia áudio e voz —
  // sem isso uma fala enfileirada continua tocando fora da tela.
  useEffect(() => () => { pararFala(); pararMetronomo(); }, []);

  // Calculados (ciclo + adrenalina)
  const masterElapsed = s.iniciadoEm ? now - s.iniciadoEm : 0;
  const masterStr = formatDuracao(masterElapsed);

  // §F04 Gustavo · compressões só contam após ação explícita (cicloIniciadoEm null = aguardando).
  const compressoesIniciadas = s.cicloIniciadoEm != null;
  const cicloElapsed = compressoesIniciadas ? now - s.cicloIniciadoEm : 0;
  const cicloElapsedStr = formatDuracao(cicloElapsed);

  // §F07 Gustavo · 1ª adrenalina começa ZERADA. Conta só após a 1ª dose (ultimaAdrenalinaEm).
  const temAdrenalina = s.ultimaAdrenalinaEm != null;
  const adrenElapsed = temAdrenalina ? now - s.ultimaAdrenalinaEm : 0;
  const adrenElapsedStr = formatDuracao(adrenElapsed);
  const adrenJanela = s.janelaAdren;

  // §F12 · choques derivados da timeline (tag 'choque') — undo-consistente
  // (registrarChoque.undo remove o último evento, então tudo acompanha o desfazer).
  const choqueEventos = s.eventos.filter((ev) => ev.tag === 'choque');
  const choqueCount = choqueEventos.length;
  const terceiroChoqueEm = choqueCount >= 3 ? choqueEventos[2].hora : null;

  // Estados visuais ciclo (B4/B7 · SEM auto-reset · só conta se iniciado)
  const cycleEndReached = compressoesIniciadas && cicloElapsed >= CICLO_MS;
  const cycle30sWarning = compressoesIniciadas && cicloElapsed >= CICLO_MS - 30 * 1000 && !cycleEndReached;

  // Estado card adrenalina (janela EXATA · B6) — idle até a 1ª dose (F07).
  let adrenState = 'idle';
  if (temAdrenalina) {
    adrenState = 'window-pre';
    if (adrenElapsed >= adrenJanela.fimMs) adrenState = 'window-overdue';
    else if (adrenElapsed >= adrenJanela.inicioMs) adrenState = 'window-ok';
  }

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

  // §F12 Gustavo · NOTIFICAÇÃO ANTECIPADA da próxima medicação (casos ACLS óbvios) — DERIVADO.
  // Sem setState/timer: a própria condição de tempo abre e fecha o banner (auto-some). Doses em
  // fraseado adulto (consistente com os cards T2); precisão pediátrica vive na aba ACLS|AHA.
  // ⚠️ Mapa completo adulto×pediatria (2ª dose amio 150 mg, lidocaína, demais drogas) → F03 Guilherme.
  let medPrep = null;
  if (isChocavel(s.ritmo) && terceiroChoqueEm != null && now - terceiroChoqueEm < 30000) {
    // (a) Amiodarona 300 mg após o 3º choque · FV/TV refratária (ACLS) — visível por 30s.
    medPrep = { title: 'Prepare Amiodarona 300 mg', description: 'FV/TV refratária · indicada após o 3º choque (ACLS).' };
  } else if (temAdrenalina && adrenState === 'window-pre' && adrenElapsed >= adrenJanela.inicioMs - 30000) {
    // (b) Adrenalina chegando na janela · 30s antes de abrir (só após a 1ª dose — F07).
    medPrep = { title: 'Prepare adrenalina 1 mg', description: `Janela abre em instantes · 1 mg IV/IO a cada ${s.intervaloAdrenalinaMin} min.` };
  }

  // §F12 · VOZ (TTS) das notificações antecipadas — dispara 1× por marco (flags anti-spam via
  // hook setters). Banner é derivado acima; aqui só o áudio (gated por audioOn). Mesmo padrão do
  // effect de alarmes (30s/janela/atrasada) logo acima.
  useEffect(() => {
    if (!s.iniciadoEm || s.rce || !s.audioOn) return;
    if (isChocavel(s.ritmo) && choqueCount >= 3 && !s.avisouAmiodarona) {
      falar('Prepare amiodarona, trezentos miligramas.');
      s.setAvisouAmiodarona(true);
    }
    if (temAdrenalina && adrenState === 'window-pre' && adrenElapsed >= adrenJanela.inicioMs - 30000 && !s.avisouAdrenPreparar) {
      falar('Prepare adrenalina, um miligrama.');
      s.setAvisouAdrenPreparar(true);
    }
    // TODO F03 Guilherme · notificações completas adulto×pediatria (mapa de medicação por ritmo/tempo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choqueCount, adrenState, adrenElapsed, temAdrenalina, s.ritmo, s.iniciadoEm, s.rce, s.audioOn]);

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
  // §F11+F14 · seleção de ritmo ramifica conforme o CONTEXTO de abertura (Luis 2026-05-28):
  //   organizado c/ pulso → RCE · inicial → registra (sem novo ciclo) · recheck/manual → +ciclo.
  const onSelecionarRitmo = (ritmo) => {
    setRitmoOpen(false);
    const ctx = ritmoContext;

    // Ritmo organizado + pulso → RCE (F14). Sem PCR aberta não é parada.
    if (ritmo === 'organizado') {
      if (!s.iniciadoEm) {
        showToast('Ritmo organizado com pulso · sem indicação de PCR', 'success');
        return;
      }
      setRceOpen(true);
      return;
    }

    // Ritmo INICIAL (logo após Iniciar PCR): registra SEM incrementar ciclo — as compressões
    // ainda começam pelo botão "Iniciar compressões" (F04). Chocável → choque; não-chocável → 5H/5T.
    if (ctx === 'inicial') {
      s.setRitmo(ritmo);
      if (isChocavel(ritmo)) {
        setChoqueOpen(true);
      } else if (isNaoChocavel(ritmo)) {
        setTimeout(() => setHhttOpen(true), 250);
      }
      showToast(`Ritmo inicial · ${getRitmoLabel(ritmo)}`, 'success');
      return;
    }

    // RECHECK (pós-checar pulso, sem pulso) ou MANUAL (tile): registra com undo + ramifica.
    // Não-chocável retoma compressões (novo ciclo de 2 min · golden D36).
    const undo = s.setRitmoComUndo(ritmo);
    if (isChocavel(ritmo)) {
      setChoqueOpen(true); // FV/TV → perguntar se chocou
    } else if (isNaoChocavel(ritmo)) {
      s.checarPulsoRitmoConfirmado(); // AESP/Assist → retoma compressões (novo ciclo)
      setTimeout(() => setHhttOpen(true), 250); // 5H/5T (golden D36)
    }
    showToast(`Ritmo: ${getRitmoLabel(ritmo)}`, 'success', undo);
  };

  // T1 · Iniciar PCR → inicia o cronômetro do caso E já pede o ritmo inicial (Luis 2026-05-28).
  const onIniciarPCR = () => {
    s.iniciarPCR();
    setRitmoContext('inicial');
    setRitmoOpen(true);
  };

  // T2 · "Checar ritmo/pulso" → pergunta ritmo organizado + pulso (CheckarPulsoRitmoSheet).
  const onChecarPulsoRitmo = () => setCheckarOpen(true);

  // SIM (ritmo organizado + pulso) → RCE direto → T3 pós-PCR (tela de salvar).
  const onChecarComPulso = () => {
    setCheckarOpen(false);
    s.confirmarRCE([]);
    showToast('RCE · ritmo organizado com pulso', 'success');
  };

  // NÃO (sem pulso) → reabre Selecionar Ritmo pra registrar o ritmo atual (contexto recheck).
  const onChecarSemPulso = () => {
    setCheckarOpen(false);
    setRitmoContext('recheck');
    setTimeout(() => setRitmoOpen(true), 250);
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
      // §ACLS · após o choque, retoma RCP imediatamente (novo ciclo de 2 min).
      s.checarPulsoRitmoConfirmado();
      showToast(`Choque ${carga} · retome compressões`, 'success', undo);
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

  // ============================================================
  // T1 · IDLE · hero minimalista (Luis 2026-05-28: tela só com o botão Iniciar pulsando;
  // ao tocar, já pede o ritmo inicial). Sem cards zerados.
  // ============================================================
  const t1 = (
    <div className={styles.t1Hero}>
      <span className={styles.t1IconRing} aria-hidden="true">
        <Icon name="batimento" size={44} />
      </span>
      <h2 className={styles.t1Title}>Pronto para iniciar</h2>
      <p className={styles.t1Text}>
        Toque em <strong>Iniciar PCR</strong>: o cronômetro do caso começa e você registra o ritmo
        inicial no monitor.
      </p>
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
      {/* §F12 · notificação antecipada da próxima medicação (acima do banner de ciclo · auto-some
          pela janela de tempo · role=alert pra leitor de tela anunciar) */}
      {medPrep && (
        <BannerContextual
          tone="warning"
          title={medPrep.title}
          description={medPrep.description}
          role="alert"
        />
      )}
      {renderBanner()}

      {/* Card Compressões · F04: aguardando até "Iniciar compressões"; depois running/cycle-end. */}
      {!compressoesIniciadas ? (
        <TimerCard
          label="Compressões"
          value="00:00"
          meta="Aguardando"
          description="Cronômetro do caso já está correndo. Toque em Iniciar compressões quando começar a RCP."
          state="idle"
          onInfo={() => setAclsModalId('qualidade-rcp')}
          size="lg"
        >
          <Button variant="primary" size="lg" onClick={s.iniciarCompressoes}>
            Iniciar compressões
          </Button>
        </TimerCard>
      ) : (
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
          progress={Math.min(100, (cicloElapsed / CICLO_MS) * 100)}
        >
          <Segmented
            options={SEG_BPM}
            value={s.bpm}
            onChange={s.setBpm}
            block
          />
          {/* §Checar ritmo/pulso · ação-chave do marco de 2 min, DENTRO do card de Compressões
              (igual "Apliquei agora" no card de Adrenalina · Luis 2026-05-28). Abre a pergunta
              "ritmo organizado + pulso?" → SIM = RCE · NÃO = registrar ritmo atual. Vermelho no
              fim do ciclo pra reforçar a urgência. */}
          <Button
            variant={cycleEndReached ? 'danger' : 'primary'}
            size="md"
            onClick={onChecarPulsoRitmo}
          >
            Checar ritmo / pulso
          </Button>
        </TimerCard>
      )}

      {/* Card Adrenalina · F07: zerada até a 1ª dose · janela EXATA (B6) após aplicar */}
      <TimerCard
        label={`Adrenalina · ×${s.adrenalinaCount}`}
        value={adrenElapsedStr}
        meta={
          !temAdrenalina ? 'Aguardando 1ª dose'
            : adrenState === 'window-overdue' ? 'ATRASADA'
              : adrenState === 'window-ok' ? 'JANELA ABERTA'
                : `Próxima em ${s.intervaloAdrenalinaMin} min`
        }
        description={temAdrenalina
          ? `Desde a última dose · alvo a cada ${s.intervaloAdrenalinaMin} min`
          : 'Aplique quando indicado · timer começa na 1ª dose.'}
        state={adrenState}
        onInfo={() => showToast('Adrenalina · 1 mg IV/IO 3-5 min · diluir 1:10 em SF', 'success')}
        size="lg"
        progress={temAdrenalina ? Math.min(100, (adrenElapsed / adrenJanela.fimMs) * 100) : undefined}
        progressMarkers={temAdrenalina ? [
          { position: (adrenJanela.inicioMs / adrenJanela.fimMs) * 100, label: adrenJanela.labelInicio },
          { position: 100, label: adrenJanela.labelFim },
        ] : undefined}
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
          iconNode={<RitmoIcon ritmo={s.ritmo} size={36} />}
          label="Selecionar ritmo"
          value={ritmoLabel}
          onClick={() => { setRitmoContext('manual'); setRitmoOpen(true); }}
        />
        <ActionTile
          icon="zap"
          label="Desfibrilar"
          value={cargaInicialLabel}
          disabled={desfibrilarDisabled}
          onClick={() => setChoqueOpen(true)}
        />
      </div>

      {/* Linha do tempo · EventList vem aberta (Luis 2026-05-28) · togglável */}
      <EventList events={eventosFormatados} />
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

  // §T3 ramifica pelo desfecho (Luis 2026-05-28): RCE → cuidados pós-PCR · encerrada → resumo.
  const desfechoEncerradoLabel = s.paciente.desfecho === 'obito'
    ? 'Óbito declarado'
    : 'Suspensa por decisão clínica';
  const t3 = s.rce ? (
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
        description="Se a parada voltar, toque 'Nova PCR'. O cronômetro do caso continua o mesmo."
      />
    </div>
  ) : (
    <div className={styles.tela}>
      <BannerContextual
        tone="critical"
        title={`PCR encerrada · ${s.paciente.desfecho === 'obito' ? 'Óbito' : 'Suspensa'}`}
        description={`${desfechoEncerradoLabel}. Documente o caso e salve no histórico.`}
      />
      <div className={styles.cuidadosList}>
        <div className={styles.cuidadoItem} data-tone="info">
          <span className={styles.cuidadoBullet} aria-hidden="true" />
          <div className={styles.cuidadoContent}>
            <span className={styles.cuidadoTitle}>Resumo do caso</span>
            <span className={styles.cuidadoDesc}>
              {`${s.cicloAtual} ciclo(s) · adrenalina ×${s.adrenalinaCount} · ritmo final ${ritmoLabel}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // T4 · SALVAR PACIENTE (F-PCR-3.9 · Luis A5: SEM campo altura)
  // ============================================================
  const salvarForm = (
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
          <Segmented
            block
            options={[{ value: 'm', label: 'Masculino' }, { value: 'f', label: 'Feminino' }]}
            value={s.paciente.sexo === 'm' || s.paciente.sexo === 'f' ? s.paciente.sexo : null}
            onChange={(v) => s.setPaciente({ ...s.paciente, sexo: v })}
          />
          <span className={styles.formHelper}>Opcional · sem seleção fica &quot;não informado&quot;.</span>
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Desfecho</label>
          <RadioGroup
            name="pcr-desfecho"
            columns={2}
            options={[
              { value: 'revertida', label: 'Revertida' },
              { value: 'nao-revertida', label: 'Não revertida' },
              { value: 'obito', label: 'Óbito' },
              { value: 'suspensa', label: 'Suspensa' },
            ]}
            value={s.paciente.desfecho}
            onChange={(v) => s.setPaciente({ ...s.paciente, desfecho: v })}
          />
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
  );

  const telas = { 1: t1, 2: t2, 3: t3 };

  // ============================================================
  // FOOTERS
  // ============================================================
  const footerT1 = {
    hint: 'Toque para iniciar o cronômetro e registrar o ritmo',
    primary: {
      label: 'Iniciar PCR',
      size: 'lg',
      onClick: onIniciarPCR,
      // §F01 Gustavo · urgência visual (pulse) — único botão da tela, chama a ação.
      className: styles.iniciarPulse,
    },
  };

  // §hint clínico dinâmico T2 (golden atualizarHintT2)
  const hintT2 = (() => {
    if (s.ritmo === 'na') return 'Selecionar ritmo · checar monitor';
    if (cycleEndReached) return 'Checar pulso · 10 s · trocar compressor';
    if (adrenState === 'window-overdue') return 'Adrenalina ATRASADA · aplique 1 mg IV/IO agora';
    if (isChocavel(s.ritmo)) return `Manter compressões · próximo choque ${cargaInicialLabel}`;
    if (isNaoChocavel(s.ritmo)) return 'Manter compressões · revise 5H/5T';
    return null;
  })();

  // T2 tem 3 botões customizados (Pausa · Stop · RCE) + hint clínico dinâmico
  const footerT2 = {
    hint: hintT2,
    actions: [
      { label: 'Pausa', variant: 'ghost', size: 'lg', onClick: () => setPausarOpen(true) },
      { label: 'Stop', variant: 'danger', size: 'lg', onClick: () => setEncerrarOpen(true) },
      { label: 'RCE', variant: 'primary', size: 'lg', onClick: () => setRceOpen(true) },
    ],
  };

  // T3 footer · pós-RCE: só "Nova PCR" (recidiva) + "Salvar paciente" (abre o sheet com
  // Salvar / Finalizar sem salvar). "Encerrar sem RCE" não aparece aqui — é contraditório
  // pós-RCE; só existe na T2 (botão Stop). (Luis 2026-05-28)
  // RCE → recidiva (Nova PCR) + salvar · encerrada (óbito/suspensa) → só salvar (recidiva não cabe).
  const footerT3 = s.rce ? {
    secondary: { label: 'Nova PCR', variant: 'secondary', size: 'lg', onClick: () => setNovaPcrOpen(true) },
    primary: { label: 'Salvar paciente', variant: 'primary', size: 'lg', onClick: () => setSalvarOpen(true) },
  } : {
    hint: 'Documente o desfecho e salve o caso',
    primary: { label: 'Salvar paciente', variant: 'primary', size: 'lg', onClick: () => setSalvarOpen(true) },
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
    setSalvarOpen(false);
    s.resetarEstado();
    showToast('Paciente salvo · Caso arquivado no histórico.', 'success');
    s.setAbaAtual('historico');
  };

  // Finalizar sem salvar → reset ao estado padrão (#7).
  const handleFinalizarSemSalvar = () => {
    setSalvarOpen(false);
    s.resetarEstado();
    showToast('Protocolo reiniciado');
  };

  const footers = { 1: footerT1, 2: footerT2, 3: footerT3 };

  // ============================================================
  // HISTÓRICO / TEORIA
  // ============================================================
  // §A6 Luis · cada caso ganha campo `subtitle` com Início HH:MM:SS pra HistoryView mostrar.
  const statusDoDesfecho = (d) =>
    d === 'revertida' ? 'Revertida' : d === 'obito' ? 'Óbito' : d === 'suspensa' ? 'Suspensa' : 'Não revertida';

  // §filtro por desfecho (golden historico-filtros)
  const historicoFiltrado = histFiltro === 'todas'
    ? historico
    : historico.filter((c) => c.desfecho === histFiltro);

  // §HistoryView aceita cases [{ initials, status, statusTone, date, duration }]
  const historicoFormatado = historicoFiltrado.map((c) => ({
    id: c.id,
    initials: c.iniciais || c.initials,
    status: statusDoDesfecho(c.desfecho),
    // §A6 · "Início" no campo date secundário (DD/MM HH:MM:SS)
    date: c.iniciadoEm
      ? `Início ${new Date(c.iniciadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
      : c.date,
    duration: c.duration || formatDuracao(c.duracaoMs),
  }));

  // §11.H.2 · detalhe do caso (golden abrirCasoDetalhePCR) — só peças DS de sheet.
  const casoAberto = casoIdxAberto != null ? historico[casoIdxAberto] : null;
  const renderCasoDetalhePCR = () => {
    if (!casoAberto) return null;
    const c = casoAberto;
    const dur = c.duration || formatDuracao(c.duracaoMs);
    const ritmoFinalLabel = c.ritmoFinal && c.ritmoFinal !== 'na' ? getRitmoLabel(c.ritmoFinal) : '—';

    // Timeline · eventos do caso
    const tStart = c.iniciadoEm || null;
    const events = (c.eventos || []).map((ev, i) => ({
      id: `${ev.hora}-${i}`,
      time: formatHora(ev.hora),
      offset: formatOffset(ev.hora, tStart),
      title: ev.acao,
      status: ev.tag === 'choque' ? 'warning' : ev.tag === 'marco' ? 'critical' : ev.tag === 'rce' ? 'success' : 'info',
    }));

    return (
      <>
        <SheetSection boxed title="Caso">
          <SheetDetailRow label="Início" value={c.iniciadoEm ? new Date(c.iniciadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'} />
          <SheetDetailRow label="Duração total" value={dur} />
          {c.idade && <SheetDetailRow label="Idade" value={`${c.idade} anos${c.idadeMeses ? ` ${c.idadeMeses}m` : ''}`} />}
          {c.peso && <SheetDetailRow label="Peso" value={`${c.peso} kg`} />}
        </SheetSection>

        <SheetSection boxed title="Desfecho clínico">
          <SheetDetailRow label="Desfecho" value={statusDoDesfecho(c.desfecho)} />
          <SheetDetailRow label="Ritmo final" value={ritmoFinalLabel} />
        </SheetSection>

        <SheetSection title="Operação">
          <SheetDetailRow label="Adrenalinas" value={`×${c.adrenalinaCount || 0}`} />
          <SheetDetailRow label="Ciclos" value={`${c.ciclos || 0}`} />
        </SheetSection>

        {events.length > 0 && <Timeline title="Linha do tempo" events={events} />}

        {c.obs && (
          <SheetSection title="Observações">
            <SheetText>{c.obs}</SheetText>
          </SheetSection>
        )}

        <SheetText variant="auxiliary">
          Histórico salvo apenas neste aparelho. Não substitui prontuário oficial.
        </SheetText>
      </>
    );
  };

  const handleExcluirCaso = () => {
    if (excluirIdx == null) return;
    setHistorico(historico.filter((_, i) => i !== excluirIdx));
    setExcluirIdx(null);
    setCasoIdxAberto(null);
    showToast('Caso removido do histórico', 'success');
  };

  const handleCompartilharCaso = (c) => {
    const linhas = [
      'CalcMed · PCR encerrada',
      `Paciente: ${c.iniciais || '-'}`,
      `Desfecho: ${statusDoDesfecho(c.desfecho)}`,
      `Duração: ${c.duration || formatDuracao(c.duracaoMs)}`,
      c.ritmoFinal && c.ritmoFinal !== 'na' ? `Ritmo final: ${getRitmoLabel(c.ritmoFinal)}` : null,
      `Adrenalinas: ×${c.adrenalinaCount || 0}`,
      `Ciclos: ${c.ciclos || 0}`,
    ].filter(Boolean).join('\n');
    if (navigator.share) {
      navigator.share({ title: 'Caso PCR', text: linhas }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(linhas);
      showToast('Resumo copiado', 'success');
    } else {
      showToast('Compartilhar não disponível neste aparelho', 'error');
    }
  };

  // §filtros por desfecho via prop padrão `filters` do HistoryScreen (#6 · era wrap custom · Luis 2026-05-28).
  // Chips roláveis abaixo do título; estrutura idêntica às outras centrais.
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos PCR encerrados neste aparelho."
      cases={historicoFormatado}
      filters={historico.length > 0 ? {
        options: HISTORICO_FILTROS,
        value: histFiltro,
        onChange: setHistFiltro,
      } : undefined}
      onCaseClick={(c) => {
        const realIdx = historico.findIndex((h) => h.id === c.id);
        setCasoIdxAberto(realIdx);
      }}
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

      {/* Lidocaína · adulto = dose por peso (input no próprio card · DS valueInput) */}
      <AlertCard
        level="info"
        title="Lidocaína"
        showValue
        value={isPediatrico && dosesPed ? `${dosesPed.lidoMg}` : lidoAdulto ? `${lidoAdulto.d1}-${lidoAdulto.d2}` : '1-1,5 mg/kg'}
        unit={isPediatrico ? 'mg IV/IO (1 mg/kg)' : lidoAdulto ? `mg · máx ${lidoAdulto.dmax}` : ''}
        valueInput={!isPediatrico ? { label: 'Peso do paciente', value: s.peso || '', onChange: s.setPeso, placeholder: 'Ex.: 70', unit: 'kg' } : undefined}
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
  // Chips do header só durante a PCR aberta · idle T1 fica limpa (sem "Ciclo 1" solto · Luis 2026-05-28).
  const chips = [];
  if (s.iniciadoEm) {
    if (s.cicloAtual > 0) chips.push({ label: `Ciclo ${s.cicloAtual}`, mono: true });
    if (s.adrenalinaCount > 0) chips.push({ label: `Adren ×${s.adrenalinaCount}`, mono: true });
    if (s.ritmo && s.ritmo !== 'na') {
      const tone = isChocavel(s.ritmo) ? 'critico' : isNaoChocavel(s.ritmo) ? 'atencao' : undefined;
      chips.push({ label: getRitmoLabel(s.ritmo), tone });
    }
    if (s.rce) chips.push({ label: 'RCE', tone: 'novo' });
  }

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
        fab={s.telaAtual === 2 ? (
          <FAB icon="plus" ariaLabel="Adicionar evento" onClick={() => setEventoOpen(true)} />
        ) : undefined}
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
      <CheckarPulsoRitmoSheet
        open={checarOpen}
        onClose={() => setCheckarOpen(false)}
        onComPulso={onChecarComPulso}
        onSemPulso={onChecarSemPulso}
      />
      <AplicarChoqueSheet open={choqueOpen} onClose={() => setChoqueOpen(false)} cargaLabel={cargaInicialLabel} onConfirm={onAplicarChoque} />
      <ConfirmarRCESheet open={rceOpen} onClose={() => setRceOpen(false)} onConfirm={onConfirmarRCE} />
      <EncerrarSemRCESheet open={encerrarOpen} onClose={() => setEncerrarOpen(false)} onConfirm={onEncerrarSemRCE} />

      {/* Salvar paciente · bottomsheet padrão (#7 · era a super-tela T4) */}
      <FormSheet
        open={salvarOpen}
        onClose={() => setSalvarOpen(false)}
        title="Salvar paciente"
        description="Dados do caso · apoio à memória (LGPD). Não substitui prontuário."
        saveLabel="Salvar paciente"
        cancelLabel="Finalizar sem salvar"
        onSave={salvarPacienteT4}
        onCancel={handleFinalizarSemSalvar}
        canSave={iniciaisOk}
      >
        {salvarForm}
      </FormSheet>

      {/* Nova PCR · mesmo paciente (recidiva) ou outro paciente (reset)? (Luis 2026-05-28) */}
      <BottomSheet
        open={novaPcrOpen}
        onClose={() => setNovaPcrOpen(false)}
        title="Nova PCR"
        description="É uma recidiva no mesmo paciente ou um novo paciente?"
        footer={{
          secondary: { label: 'Outro paciente', variant: 'secondary', onClick: () => { s.resetarEstado(); setNovaPcrOpen(false); } },
          primary: { label: 'Mesmo paciente', variant: 'primary', onClick: () => { s.registrarRecidiva(); setNovaPcrOpen(false); } },
        }}
      >
        <SheetText variant="auxiliary">
          "Mesmo paciente" registra uma recidiva e mantém os dados. "Outro paciente" reinicia o protocolo do zero.
        </SheetText>
      </BottomSheet>
      <PausarSheet open={pausarOpen} onClose={() => setPausarOpen(false)} onConfirm={onPausar} />
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

      {/* Detalhe do caso histórico (golden abrirCasoDetalhePCR) */}
      <DetailSheet
        open={casoAberto != null}
        onClose={() => setCasoIdxAberto(null)}
        title={casoAberto?.iniciais || casoAberto?.initials || '—'}
        footer={casoAberto ? {
          secondary: { label: 'Excluir', variant: 'danger', onClick: () => setExcluirIdx(casoIdxAberto) },
          primary: { label: 'Compartilhar', onClick: () => handleCompartilharCaso(casoAberto) },
        } : undefined}
      >
        {renderCasoDetalhePCR()}
      </DetailSheet>

      {/* Excluir caso (confirm perigo) */}
      <ConfirmSheet
        open={excluirIdx != null}
        onClose={() => setExcluirIdx(null)}
        title="Excluir do histórico?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Manter"
        destructive
        onConfirm={handleExcluirCaso}
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

      <TETProfundidadeSheet
        open={aclsModalId === 'tet-prof'}
        onClose={() => setAclsModalId(null)}
      />

      <VCVSheet
        open={aclsModalId === 'vcv'}
        onClose={() => setAclsModalId(null)}
        pediatrico={isPediatrico}
        altura={s.altura}
        sexo={s.sexo}
        onAltura={s.setAltura}
        onSexo={s.setSexo}
      />

      <PCVSheet
        open={aclsModalId === 'pcv'}
        onClose={() => setAclsModalId(null)}
        pediatrico={isPediatrico}
      />

      {/* Toast sticky */}
      {toast && (
        <div className={styles.toastWrap}>
          <Toast
            type={toast.type === 'warning' ? 'atencao' : (toast.type || 'info')}
            message={toast.message}
            onUndo={toast.onUndo ? () => { toast.onUndo(); setToast(null); } : undefined}
            onDismiss={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
}
