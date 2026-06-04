import { useState } from 'react';
import styles from './DevPanel.module.css';

/**
 * Painel de testes (DEV) — fica FORA do frame do celular (page-wrapper).
 * Para todas as Centrais de Urgência. Decoupled via localStorage + reload:
 *  - Reiniciar fluxo: limpa as chaves do protocolo (mantém histórico) e recarrega → estado padrão.
 *  - Avançar 5 min: desloca qualquer timestamp epoch do protocolo -5min e recarrega → adianta timers.
 * Tooling, não produto — visual escuro proposital (não usa tokens de produto).
 */
const PROTOCOLOS = {
  cad: { label: 'CAD', prefix: 'cad_' },
  sca: { label: 'SCA', prefix: 'sca' },
  'sepse-react': { label: 'Sepse', prefix: 'sepse' },
  'pcr-react': { label: 'PCR', prefix: 'pcr_' },
  'avc-react': { label: 'AVC', prefix: 'avc_' },
};

const isHistorico = (k) => /histor/i.test(k);
const isEpoch = (raw) => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 1e12;
};

export function DevPanel({ route }) {
  // Inicia recolhido p/ não cobrir a TabBar no deploy mobile (Luis 2026-06-04).
  const [open, setOpen] = useState(false);
  const cfg = PROTOCOLOS[route];
  if (!cfg) return null;

  const protocolKeys = () => Object.keys(localStorage).filter((k) => k.startsWith(cfg.prefix));

  const reiniciar = () => {
    protocolKeys().filter((k) => !isHistorico(k)).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  const avancar = () => {
    protocolKeys().forEach((k) => {
      const raw = localStorage.getItem(k);
      if (isEpoch(raw)) localStorage.setItem(k, String(Number(raw) - 5 * 60 * 1000));
    });
    window.location.reload();
  };

  if (!open) {
    return (
      <button type="button" className={styles.fab} onClick={() => setOpen(true)} aria-label="Abrir painel de testes">
        ⚙
      </button>
    );
  }

  return (
    <aside className={styles.panel} aria-label="Painel de testes (dev)">
      <div className={styles.head}>
        <span className={styles.title}>Teste · {cfg.label}</span>
        <button type="button" className={styles.collapse} onClick={() => setOpen(false)} aria-label="Recolher">–</button>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={reiniciar}>Reiniciar fluxo</button>
        <button type="button" className={styles.btn} onClick={avancar}>Avançar 5 min</button>
      </div>
    </aside>
  );
}
