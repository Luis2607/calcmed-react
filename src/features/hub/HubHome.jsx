import { PROTOCOLS } from '../../data/protocols';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { HistoryView } from '../../shared/components/organisms/HistoryView';
import { usePersistedState } from '../../shared/hooks/usePersistedState';
import styles from './HubHome.module.css';

export function HubHome({ onNavigate, isPediatric, setIsPediatric }) {
  const [cadState] = usePersistedState('cad_protocolo_atual', null);
  const [cadIniciadoEm] = usePersistedState('cad_iniciado_em', null);
  const [cadTelaAtual] = usePersistedState('cad_tela_atual', 1);
  const [cadIniciais] = usePersistedState('cad_iniciais', '');
  const [historico, setHistorico] = usePersistedState('cad_historico', []);

  const hasActiveCAD = cadIniciadoEm !== null || cadState?.iniciadoEm;
  const cadStep = cadState?.telaAtual || cadTelaAtual;
  const cadPatient = cadIniciais || cadState?.iniciais;

  const handleClearHistory = () => {
    if (window.confirm('Deseja realmente limpar todo o historico de atendimentos?')) {
      setHistorico([]);
    }
  };

  const getDomainClass = (domain) => {
    switch (domain) {
      case 'protocolos':
        return styles.domainProtocolos;
      case 'escores':
        return styles.domainEscores;
      case 'urgencias':
        return styles.domainUrgencias;
      case 'neurologia':
        return styles.domainNeurologia;
      case 'cardio':
        return styles.domainCardio;
      default:
        return styles.domainProtocolos;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <span className={styles.title}>Central de Urgencia</span>
            <div className={styles.subtitle}>Plataforma do Plantonista</div>
          </div>
          <div className={styles.online}>
            <span className={styles.onlineDot} />
            <span>Online</span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {hasActiveCAD && (
          <section className={styles.section}>
            <SectionLabel>Em andamento</SectionLabel>
            <button
              type="button"
              onClick={() => onNavigate('cad')}
              className={styles.activeCard}
            >
              <div>
                <span className={styles.activeTitle}>CAD · Cetoacidose Diabetica</span>
                <div className={styles.activeMeta}>
                  Atendimento ativo na etapa T{cadStep} {cadPatient && `(Paciente: ${cadPatient})`}
                </div>
              </div>
              <span className={styles.arrow}>→</span>
            </button>
          </section>
        )}

        <section className={styles.modeRow}>
          <div>
            <span className={styles.modeTitle}>Modo Pediatria</span>
            <div className={styles.modeHelper}>Ajusta automaticamente layouts e radius do DS</div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isPediatric}
              onChange={(event) => setIsPediatric(event.target.checked)}
              className={styles.switchInput}
            />
            <span className={`${styles.switchTrack} ${isPediatric ? styles.switchTrackOn : ''}`}>
              <span className={`${styles.switchThumb} ${isPediatric ? styles.switchThumbOn : ''}`} />
            </span>
          </label>
        </section>

        <section className={styles.section}>
          <SectionLabel>Protocolos clinicos</SectionLabel>
          <div className={styles.cards}>
            {PROTOCOLS.map((protocol) => (
              <button
                key={protocol.id}
                type="button"
                onClick={() => onNavigate(protocol.id)}
                className={`${styles.card} ${getDomainClass(protocol.domain)}`}
              >
                <div>
                  <span className={styles.cardTitle}>{protocol.title}</span>
                  <div className={styles.cardSubtitle}>{protocol.subtitle}</div>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.phase}>{protocol.phase}</span>
                  <span className={styles.arrow}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.historyWrap}>
          <HistoryView cases={historico} onClear={handleClearHistory} />
        </section>
      </main>
    </div>
  );
}
