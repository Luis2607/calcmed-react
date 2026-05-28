import { useEffect, useMemo, useState } from 'react';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { BannerContextual } from '../../shared/components/organisms/BannerContextual';
import { EventList } from '../../shared/components/organisms/EventList';
import { ActionTile } from '../../shared/components/molecules/ActionTile/ActionTile';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { Button } from '../../shared/components/atoms/Button';
import { FAB } from '../../shared/components/atoms/FAB';
import { Toast } from '../../shared/components/molecules/Toast';
import { ConfirmSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { usePCRState } from './hooks/usePCRState';
import {
  CICLO_MS, BPM_OPCOES, INTERVALO_ADREN_OPCOES,
  formatDuracao, formatHora, formatOffset,
  isChocavel, isNaoChocavel, getRitmoLabel,
  getCargaInicial,
} from './pcrData';
import {
  SelecionarRitmoSheet, AplicarChoqueSheet, ConfirmarRCESheet,
  EncerrarSemRCESheet, PausarSheet, CheckarPulsoRitmoSheet,
  AdrenDoubleTapSheet, HHTTSheet,
} from './pcrModais';
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
  // eslint-disable-next-line no-unused-vars
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
  const [toast, setToast] = useState(null);

  // Master timer — lazy init evita impure call (React 19)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  // Calculados (ciclo + adrenalina)
  const masterElapsed = useMemo(() => (s.iniciadoEm ? now - s.iniciadoEm : 0), [s.iniciadoEm, now]);
  const masterStr = formatDuracao(masterElapsed);

  const cicloElapsed = useMemo(() => (s.cicloIniciadoEm ? now - s.cicloIniciadoEm : 0), [s.cicloIniciadoEm, now]);
  const cicloElapsedStr = formatDuracao(cicloElapsed);

  // Adrenalina · referência = última dose ou início do caso
  const adrenRef = s.ultimaAdrenalinaEm || s.iniciadoEm;
  const adrenElapsed = useMemo(() => (adrenRef ? now - adrenRef : 0), [adrenRef, now]);
  const adrenElapsedStr = formatDuracao(adrenElapsed);
  const adrenJanela = s.janelaAdren;

  // Estados visuais ciclo (B4/B7 · SEM auto-reset · permanece em cycle-end até ação)
  const cycleEndReached = cicloElapsed >= CICLO_MS;
  const cycle30sWarning = cicloElapsed >= CICLO_MS - 30 * 1000 && !cycleEndReached;

  // Estado card adrenalina (janela EXATA · B6)
  let adrenState = 'window-pre';
  if (adrenElapsed >= adrenJanela.fimMs) adrenState = 'window-overdue';
  else if (adrenElapsed >= adrenJanela.inicioMs) adrenState = 'window-ok';

  // Toast helper
  const showToast = (message, type = 'info') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
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
    s.setRitmo(ritmo);
    setRitmoOpen(false);
    // §auto-trigger 5H/5T após AESP/Assist (250ms · golden onda 2.2 D36)
    if (isNaoChocavel(ritmo)) {
      setTimeout(() => setHhttOpen(true), 250);
    }
    showToast(`Ritmo: ${getRitmoLabel(ritmo)}`, isChocavel(ritmo) ? 'warning' : 'info');
  };

  const onAplicarAdrenalina = () => {
    // §anti-double-tap < 30s
    if (s.adrenalinaDoubleTap()) {
      setAdrenDoubleTapOpen(true);
      return;
    }
    s.aplicarAdrenalina();
    showToast(`Adrenalina ×${s.adrenalinaCount + 1} aplicada`, 'success');
  };

  const onConfirmAdrenDoubleTap = () => {
    setAdrenDoubleTapOpen(false);
    s.aplicarAdrenalina();
    showToast(`Adrenalina ×${s.adrenalinaCount + 1} aplicada`, 'success');
  };

  const onAplicarChoque = (foiAplicado) => {
    setChoqueOpen(false);
    if (foiAplicado) {
      const carga = getCargaInicial(s.idade, s.peso);
      s.registrarChoque(carga);
      showToast(`Choque registrado · ${carga}`, 'warning');
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
      >
        <Segmented
          options={SEG_BPM}
          value={s.bpm}
          onChange={s.setBpm}
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
      >
        <Segmented
          options={SEG_INTERVALO}
          value={s.intervaloAdrenalinaMin}
          onChange={s.setIntervaloAdrenalinaMin}
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

      {/* FAB Adicionar evento (placeholder · F-PCR-3.6 modal completo) */}
      <div className={styles.fabAnchor}>
        <FAB
          icon="plus"
          ariaLabel="Adicionar evento"
          onClick={() => showToast('Adicionar evento · modal F-PCR-3.6', 'info')}
        />
      </div>
    </div>
  );

  // ============================================================
  // T3 · PÓS-RCE (placeholder · F-PCR-3.8)
  // ============================================================
  const t3 = (
    <div className={styles.tela}>
      <div className={styles.placeholder}>T3 · Pós-RCE — implementação F-PCR-3.8.</div>
    </div>
  );

  const t4 = (
    <div className={styles.tela}>
      <div className={styles.placeholder}>T4 · Salvar Paciente — implementação F-PCR-3.9.</div>
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

  const footers = { 1: footerT1, 2: footerT2 };

  // ============================================================
  // HISTÓRICO / TEORIA
  // ============================================================
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos PCR encerrados neste aparelho."
      cases={historico}
    />
  );

  const teoriaView = (
    <TheoryScreen
      title="ACLS | AHA"
      subtitle="Referência rápida ACLS / AHA 2025."
      items={[
        { title: 'Fluxogramas', sub: 'Algoritmo PCR · Causas reversíveis · Cuidados pós-PCR · Qualidade RCP', onClick: () => showToast('Fluxogramas · F-PCR-3.11', 'info') },
        { title: 'Cargas e Doses', sub: 'Desfib · Adrena · Amio · Lido · Mg', onClick: () => showToast('Cargas e Doses · F-PCR-3.11', 'info') },
        { title: 'Via Aérea', sub: 'TET · VCV · PCV', onClick: () => showToast('Via Aérea · F-PCR-3.11', 'info') },
      ]}
    />
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
        actions={[]}
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

      {/* Toast sticky */}
      {toast && (
        <div className={styles.toastWrap}>
          <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
