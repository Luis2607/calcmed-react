import { useState, useEffect } from 'react';
import { Icon } from './icons';
import styles from './Home.module.css';

/* Central de Urgência — única parte funcional. Os chips trocam o card (seleção);
   só o card "Iniciar agora" navega para o protocolo (App.jsx + data/protocols.js). */
const URGENCIA_OPTIONS = [
  // PCR React em construção (F-PCR-3 microsteps) · rota dev até cutover validado.
  { id: 'pcr', label: 'PCR', route: 'pcr-react', icon: 'heartPulse', title: 'Modo PCR', desc: 'Condução guiada em tempo real' },
  { id: 'sca', label: 'SCA', route: 'sca', icon: 'activity', title: 'Modo SCA', desc: 'ECG, risco e conduta em tempo real' },
  // Sepse aprovada pelo Gustavo 2026-05-28 → cutover Home → React (não iframe). (Era 'sepse' apontando p/ legado.)
  { id: 'sepse', label: 'Sepse', route: 'sepse-react', icon: 'droplet', title: 'Modo Sepse', desc: 'Triagem, antibiótico e metas guiadas' },
  // AVC portado p/ React (port-avc) → cutover Home → React. Golden permanece em ?route=avc p/ QA lado-a-lado.
  { id: 'avc', label: 'AVC', route: 'avc-react', icon: 'brain', title: 'Modo AVC', desc: 'Janela, NIHSS e trombólise guiadas' },
];

const PLANTAO = [
  { abbr: 'IOT', name: 'Intubação' },
  { abbr: 'IOT', name: 'Drogas Vasoativas' },
];

const RECENTES = [
  { name: 'Clearance de Creatinina', time: '2 min' },
  { name: 'Noradrenalina', time: '15 min' },
];

const URGENCIA_GRID = [
  // IOT/ANA/CCV/HPG/TAQ não têm rota React ainda → feedback "Em breve"
  { abbr: 'IOT', name: 'Intubação Orotraqueal', status: 'Teste', route: null },
  { abbr: 'CAD', name: 'Cetoacidose Diabética', route: 'cad' },
  { abbr: 'ANA', name: 'Anafilaxia', route: null },
  { abbr: 'CCV', name: 'Crise Convulsiva', route: null },
  { abbr: 'HPG', name: 'Hipoglicemia', route: null },
  { abbr: 'TAQ', name: 'Taquiarritmias', route: null },
];

const CATEGORIES = [
  { name: 'Diluições e Doses', count: 5, icon: 'syringe', color: '#3b82f6' },
  { name: 'Calculadoras', count: 14, icon: 'calculator', color: '#f97316' },
  { name: 'Fluxogramas', count: 17, icon: 'flow', color: '#a855f7' },
  { name: 'Escores', count: 46, icon: 'barChart', color: '#06b6d4' },
  { name: 'Conversores', count: 5, icon: 'swap', color: '#6366f1' },
];

const NAV = [
  // "Início" sempre ativo na Home; demais abas ainda não têm tela (→ toast "Em breve")
  { label: 'Início', icon: 'home' },
  { label: 'Busca', icon: 'search' },
  { label: 'Escala', icon: 'calendar' },
  { label: 'IA', icon: 'sparkles' },
  { label: 'Menu', icon: 'menu' },
];

function FeatureCard({ abbr, name, status, saved }) {
  return (
    <div className={styles.featCard}>
      <div className={styles.featTop}>
        <Icon
          name="bookmark"
          size={16}
          filled={saved}
          className={saved ? styles.bookmarkSaved : styles.bookmarkMuted}
        />
      </div>
      {status && <span className={styles.statusTag}>{status}</span>}
      <span className={styles.tagAbbr}>{abbr}</span>
      <span className={styles.featName}>{name}</span>
    </div>
  );
}

function chunkPairs(items) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

/* Toast efêmero "Em breve" — usado para destinos sem rota existente */
function EmBreveToast({ visible }) {
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--ds-fundo-elevado)',
        color: 'var(--ds-texto-padrao)',
        border: '1px solid var(--ds-borda-padrao)',
        borderRadius: 'var(--ds-r-sm)',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        boxShadow: 'var(--sombra-cartao)',
        whiteSpace: 'nowrap',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    >
      Em breve
    </div>
  );
}

export function Home({ onNavigate, isDark = false, onToggleTheme, isPediatric = false, setIsPediatric }) {
  const [selectedUrgencia, setSelectedUrgencia] = useState('pcr');
  // Toast "Em breve": guarda a chave do item clicado e limpa após 1,8 s
  const [emBreveKey, setEmBreveKey] = useState(null);
  const urgencia = URGENCIA_OPTIONS.find((o) => o.id === selectedUrgencia) ?? URGENCIA_OPTIONS[0];

  // Auto-limpa toast após 1800 ms
  useEffect(() => {
    if (!emBreveKey) return;
    const t = setTimeout(() => setEmBreveKey(null), 1800);
    return () => clearTimeout(t);
  }, [emBreveKey]);

  const showEmBreve = (key) => setEmBreveKey(key);

  /* Handlers da barra de navegação inferior */
  const handleNavTab = (label) => {
    if (label === 'Início') {
      // já está na Home; scroll suave ao topo
      document.querySelector('[data-home-scroll]')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Busca / Escala / IA / Menu ainda não têm tela — toast "Em breve"
    showEmBreve(`nav-${label}`);
  };

  return (
    <div className={styles.home}>
      <EmBreveToast visible={emBreveKey !== null} />
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.avatar}>
            <div className={styles.avatarCircle}>RF</div>
            <span className={styles.avatarEdit}>
              <Icon name="pencil" size={10} />
            </span>
          </div>
          <div className={styles.greeting}>
            <div className={styles.greetingHi}>Bom dia,</div>
            <div className={styles.greetingName}>Dr. Rafael</div>
          </div>
          <button type="button" className={styles.headerIcon} aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'} aria-pressed={isDark} onClick={onToggleTheme}>
            <Icon name="sun" size={22} />
          </button>
          {/* Notificações: destino inexistente → feedback "Em breve" */}
          <button type="button" className={styles.headerIcon} aria-label="Notificações" onClick={() => showEmBreve('notificacoes')}>
            <Icon name="bell" size={22} />
          </button>
        </div>
        <div className={styles.segmentedRow}>
          {/* Abas Adulto/Pediatra — espelha o padrão do Hub (Toggle via setIsPediatric) */}
          <div className={styles.segmented} role="tablist" aria-label="Modo de atendimento">
            <button
              type="button"
              role="tab"
              aria-selected={!isPediatric}
              className={`${styles.segTab} ${!isPediatric ? styles.segTabActive : ''}`}
              onClick={() => setIsPediatric(false)}
            >
              Adulto
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isPediatric}
              className={`${styles.segTab} ${isPediatric ? styles.segTabActive : ''}`}
              onClick={() => setIsPediatric(true)}
            >
              <Icon name="baby" size={16} />
              Pediatra
            </button>
          </div>
        </div>
      </header>

      <main className={styles.content} data-home-scroll>
        {/* Central de Urgência — funcional */}
        <section className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>Central de Urgência</span>
            <span className={styles.groupLinkMuted}>Acesso rápido</span>
          </div>
          <div className={styles.chips} role="tablist" aria-label="Selecionar urgência">
            {URGENCIA_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={opt.id === selectedUrgencia}
                onClick={() => setSelectedUrgencia(opt.id)}
                className={`${styles.chip} ${opt.id === selectedUrgencia ? styles.chipActive : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.hero}
            onClick={() => onNavigate(urgencia.route)}
            aria-label={`Iniciar ${urgencia.title}`}
          >
            <Icon name={urgencia.icon} size={24} />
            <span className={styles.heroTitle}>{urgencia.title}</span>
            <span className={styles.heroDesc}>{urgencia.desc}</span>
            <span className={styles.heroAction}>
              Iniciar agora
              <Icon name="arrowRight" size={14} />
            </span>
          </button>
        </section>

        {/* Meu Plantão — visual */}
        <section className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>Meu Plantão</span>
            <span className={styles.groupLinkMuted} style={{ color: 'var(--ds-texto-link)' }}>
              Ver todos
            </span>
          </div>
          <div className={styles.cardsRow}>
            {PLANTAO.map((item, i) => (
              <FeatureCard key={i} abbr={item.abbr} name={item.name} saved />
            ))}
          </div>
        </section>

        {/* Últimas utilizadas — visual */}
        <section className={styles.group}>
          <div className={styles.recentHeader}>
            <span className={styles.sectionLabel}>Últimas utilizadas</span>
            <span className={styles.infoButton}>
              <Icon name="info" size={16} />
            </span>
          </div>
          <div className={styles.recentList}>
            {RECENTES.map((item, i) => (
              <div key={i} className={styles.recentItem}>
                <Icon name="clock" size={20} className={styles.recentIcon} />
                <span className={styles.recentTitle}>{item.name}</span>
                <span className={styles.recentTime}>{item.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Urgências — expandido */}
        <section className={styles.categoryCard}>
          {/* Header da categoria: destino não existe → "Em breve" */}
          <button
            type="button"
            className={styles.categoryHeaderButton}
            aria-label="Ver categoria Urgências"
            onClick={() => showEmBreve('cat-urgencias')}
          >
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon} style={{ color: 'var(--hero-red)' }}>
                <Icon name="siren" size={24} />
              </span>
              <span className={styles.categoryName}>Urgências</span>
              <span className={styles.countBadge}>15</span>
              <Icon name="chevronDown" size={20} className={styles.categoryChevron} />
            </div>
          </button>
          <div className={styles.grid}>
            {chunkPairs(URGENCIA_GRID).map((row, ri) => (
              <div key={ri} className={styles.gridRow}>
                {row.map((item, ci) => (
                  // CAD tem rota React; demais → "Em breve"
                  <button
                    key={ci}
                    type="button"
                    style={{ flex: 1, border: 'none', background: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                    aria-label={item.route ? `Abrir ${item.name}` : `${item.name} — em breve`}
                    onClick={() => item.route ? onNavigate(item.route) : showEmBreve(`grid-${item.abbr}`)}
                  >
                    <FeatureCard abbr={item.abbr} name={item.name} status={item.status} />
                  </button>
                ))}
              </div>
            ))}
          </div>
          {/* "Ver todas as 15 urgências": destino não existe → "Em breve" */}
          <button
            type="button"
            className={styles.verMaisButton}
            onClick={() => showEmBreve('ver-todas-urgencias')}
          >
            <Icon name="siren" size={20} />
            Ver todas as 15 urgências
            <Icon name="arrowRight" size={20} />
          </button>
        </section>

        {/* Demais categorias — colapsadas; destinos inexistentes → "Em breve" */}
        {CATEGORIES.map((cat) => (
          <section key={cat.name} className={styles.categoryCard}>
            <button
              type="button"
              className={styles.categoryHeaderButton}
              aria-label={`Ver categoria ${cat.name}`}
              onClick={() => showEmBreve(`cat-${cat.name}`)}
            >
              <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon} style={{ color: cat.color }}>
                  <Icon name={cat.icon} size={24} />
                </span>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.countBadge}>{cat.count}</span>
                <Icon name="chevronRight" size={20} className={styles.categoryChevron} />
              </div>
            </button>
          </section>
        ))}
      </main>

      <nav className={styles.tabBar} aria-label="Navegação principal">
        {NAV.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`${styles.tab} ${tab.label === 'Início' ? styles.tabActive : ''}`}
            onClick={() => handleNavTab(tab.label)}
            /* aria-current identifica o item ativo; title dá contexto extra sem sobrepor o nome acessível */
            aria-current={tab.label === 'Início' ? 'page' : undefined}
            title={tab.label === 'Início' ? 'Início (atual)' : `${tab.label} — em breve`}
          >
            <Icon name={tab.icon} size={24} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
