import { useEffect, useMemo, useState } from 'react';
import { ProtocolShell } from '../../shared/components/templates/ProtocolShell/ProtocolShell';
import { HistoryScreen } from '../../shared/components/templates/HistoryScreen/HistoryScreen';
import { TheoryScreen } from '../../shared/components/templates/TheoryScreen/TheoryScreen';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { Toast } from '../../shared/components/molecules/Toast';
import { ConfirmSheet } from '../../shared/components/overlays/patterns';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import { usePCRState } from './hooks/usePCRState';
import { formatDuracao } from './pcrData';
import styles from './PCRFlow.module.css';

/**
 * PCRFlow — main flow PCR React (port golden pcr.html/.js/.css).
 *
 * Estado: F-PCR-3.0 scaffold + F-PCR-3.1 T1 Idle (microsteps em progressão).
 * T2/T3/T4: placeholders implementados próximo step.
 *
 * Mudanças clínicas pós-captura (pcr-comentarios-2026-05-28-pm.md):
 * - B2 (Gustavo): botão "Checar ritmo/pulso" desde T1 (3 botões no rodapé).
 * - B4/B7: timers NÃO auto-reset (só por ação manual).
 * - B6: janela adrenalina EXATA no tempo (não [m-1, m+1]).
 * - A7 (Luis): ACLS|AHA sub-tab "Fluxogramas" (era "Panfletos").
 */

const PCR_TABS = [
  { id: 'executar', label: 'Executar', icon: 'play' },
  { id: 'historico', label: 'Histórico', icon: 'tempo' },
  { id: 'teoria', label: 'ACLS | AHA', icon: 'livro' },
];

export function PCRFlow({ onBack }) {
  const s = usePCRState();
  // §setHistorico será usado quando F-PCR-3.9 salvarPaciente() landar.
  // eslint-disable-next-line no-unused-vars
  const [historico, setHistorico] = usePersistedState('pcr_historico', []);

  // Tela & UI
  const [sairOpen, setSairOpen] = useState(false);
  const [checarPulsoOpen, setCheckarPulsoOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // §master timer — lazy init pra evitar impure call no render (React 19 strict)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!s.iniciadoEm) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [s.iniciadoEm]);

  // Master elapsed (caso aberto)
  const masterElapsed = useMemo(() => (s.iniciadoEm ? now - s.iniciadoEm : 0), [s.iniciadoEm, now]);
  const masterStr = formatDuracao(masterElapsed);

  // Toast helper
  const showToast = (message, type = 'info') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // ============================================================
  // SAIR (header) — confirm sheet se há dados
  // ============================================================
  const handleSair = () => {
    if (s.iniciadoEm || s.cicloAtual > 1 || s.adrenalinaCount > 0) {
      setSairOpen(true);
    } else {
      onBack();
    }
  };

  // ============================================================
  // CHECAR RITMO/PULSO (B2 Gustavo — desde T1)
  // ============================================================
  const onCheckarPulso = () => setCheckarPulsoOpen(true);

  const confirmChecagem = (resultado) => {
    // resultado: 'pulso' | 'ritmo'
    setCheckarPulsoOpen(false);
    if (resultado === 'pulso') {
      // Há pulso → vai pra confirmar RCE (próxima etapa)
      showToast('Pulso detectado · próximo: confirmar RCE', 'success');
    } else {
      // Sem pulso → ciclo incrementa (B7: ação manual reseta timer)
      s.checarPulsoRitmoConfirmado();
      showToast(`Ciclo ${s.cicloAtual + 1} iniciado · checar ritmo no monitor`, 'info');
    }
  };

  // ============================================================
  // T1 · IDLE — 2 cards aguardando + 3 botões (Sair / Checar ritmo / Iniciar PCR)
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
  // T2/T3/T4 — placeholders (próximos microsteps)
  // ============================================================
  const t2 = (
    <div className={styles.tela}>
      <div className={styles.placeholder}>
        T2 · PCR Ativa — implementação F-PCR-3.2..3.7 em progresso.
        <br />
        Cronômetro mestre: {masterStr}
        <br />
        Ciclo atual: {s.cicloAtual}
      </div>
    </div>
  );

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
  // FOOTER — varia por tela
  // ============================================================
  // §B2 Gustavo · T1 com 3 botões (Sair · Checar ritmo/pulso · Iniciar PCR)
  const footerT1 = {
    hint: 'Iniciar cronômetros e operação',
    secondary: {
      label: 'Checar ritmo/pulso',
      variant: 'secondary',
      size: 'lg',
      onClick: onCheckarPulso,
    },
    primary: {
      label: 'Iniciar PCR',
      size: 'lg',
      onClick: s.iniciarPCR,
    },
  };

  const footerT2 = {
    hint: 'PCR ativa · checar ritmo/pulso quando necessário',
    primary: { label: 'Próximo (placeholder)', size: 'lg', onClick: () => {} },
  };

  const footers = { 1: footerT1, 2: footerT2 };

  // ============================================================
  // HISTÓRICO (placeholder · F-PCR-3.10)
  // ============================================================
  const historicoView = (
    <HistoryScreen
      title="Histórico"
      subtitle="Casos PCR encerrados neste aparelho."
      cases={historico}
    />
  );

  // ============================================================
  // ACLS | AHA (placeholder · §A7 Luis · Fluxogramas em vez de Panfletos)
  // ============================================================
  const teoriaView = (
    <TheoryScreen
      title="ACLS | AHA"
      subtitle="Referência rápida ACLS / AHA 2025."
      items={[
        { title: 'Fluxogramas', sub: 'Algoritmo PCR · Causas reversíveis · Cuidados pós-PCR · Qualidade RCP', onClick: () => showToast('Fluxogramas · placeholder F-PCR-3.11', 'info') },
        { title: 'Cargas e Doses', sub: 'Desfib · Adrena · Amio · Lido · Mg', onClick: () => showToast('Cargas e Doses · placeholder F-PCR-3.11', 'info') },
        { title: 'Via Aérea', sub: 'TET · VCV · PCV', onClick: () => showToast('Via Aérea · placeholder F-PCR-3.11', 'info') },
      ]}
    />
  );

  // ============================================================
  // CHIPS HEADER (dinâmicos)
  // ============================================================
  const chips = [];
  if (s.cicloAtual > 1) chips.push({ label: `Ciclo ${s.cicloAtual}`, mono: true });
  if (s.adrenalinaCount > 0) chips.push({ label: `Adren ×${s.adrenalinaCount}`, mono: true });
  if (s.ritmo && s.ritmo !== 'na') chips.push({ label: s.ritmo.toUpperCase(), tone: s.ritmo === 'fv' || s.ritmo === 'tv' ? 'critico' : 'atencao' });
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
        // PCR não tem stepper — fluxo não-linear
        steps={undefined}
        activeTab={s.abaAtual}
        onTabChange={s.setAbaAtual}
        tabs={PCR_TABS}
        executar={telas[s.telaAtual] || t1}
        historico={historicoView}
        teoria={teoriaView}
        footer={footers[s.telaAtual]}
      />

      {/* Confirm sair */}
      <ConfirmSheet
        open={sairOpen}
        onClose={() => setSairOpen(false)}
        title="Sair do Modo PCR?"
        description="O caso continua aberto neste aparelho · você retoma pelo hub."
        confirmLabel="Sair (PCR continua)"
        cancelLabel="Continuar aqui"
        onConfirm={onBack}
      />

      {/* Modal Checar ritmo/pulso (B2 Gustavo — placeholder simples) */}
      <ConfirmSheet
        open={checarPulsoOpen}
        onClose={() => setCheckarPulsoOpen(false)}
        title="Paciente tem pulso?"
        description="Cheque pulso central (carótida ou femoral) por até 10 segundos."
        confirmLabel="Tem pulso · confirmar RCE"
        cancelLabel="Sem pulso · checar ritmo"
        onConfirm={() => confirmChecagem('pulso')}
        // §placeholder · botão cancel = checar ritmo (não-fechar)
        onCancel={() => confirmChecagem('ritmo')}
      />

      {/* Toast sticky */}
      {toast && (
        <div className={styles.toastWrap}>
          <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
        </div>
      )}
    </>
  );
}
