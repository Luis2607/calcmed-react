import { useState } from 'react';
import { Icon } from './icons';
import styles from './Home.module.css';

/* Central de Urgência — única parte funcional. Os chips trocam o card (seleção);
   só o card "Iniciar agora" navega para o protocolo (App.jsx + data/protocols.js). */
const URGENCIA_OPTIONS = [
  { id: 'pcr', label: 'PCR', route: 'pcr', icon: 'heartPulse', title: 'Modo PCR', desc: 'Condução guiada em tempo real' },
  { id: 'sca', label: 'SCA', route: 'sca', icon: 'activity', title: 'Modo SCA', desc: 'ECG, risco e conduta em tempo real' },
  { id: 'sepse', label: 'Sepse', route: 'sepse', icon: 'droplet', title: 'Modo Sepse', desc: 'Triagem, antibiótico e metas guiadas' },
  { id: 'avc', label: 'AVC', route: 'avc', icon: 'brain', title: 'Modo AVC', desc: 'Janela, NIHSS e trombólise guiadas' },
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
  { abbr: 'IOT', name: 'Intubação Orotraqueal', status: 'Teste' },
  { abbr: 'CAD', name: 'Cetoacidose Diabética' },
  { abbr: 'ANA', name: 'Anafilaxia' },
  { abbr: 'CCV', name: 'Crise Convulsiva' },
  { abbr: 'HPG', name: 'Hipoglicemia' },
  { abbr: 'TAQ', name: 'Taquiarritmias' },
];

const CATEGORIES = [
  { name: 'Diluições e Doses', count: 5, icon: 'syringe', color: '#3b82f6' },
  { name: 'Calculadoras', count: 14, icon: 'calculator', color: '#f97316' },
  { name: 'Fluxogramas', count: 17, icon: 'flow', color: '#a855f7' },
  { name: 'Escores', count: 46, icon: 'barChart', color: '#06b6d4' },
  { name: 'Conversores', count: 5, icon: 'swap', color: '#6366f1' },
];

const NAV = [
  { label: 'Início', icon: 'home', active: true },
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

export function Home({ onNavigate, isDark = false, onToggleTheme }) {
  const [selectedUrgencia, setSelectedUrgencia] = useState('pcr');
  const urgencia = URGENCIA_OPTIONS.find((o) => o.id === selectedUrgencia) ?? URGENCIA_OPTIONS[0];

  return (
    <div className={styles.home}>
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
          <button type="button" className={styles.headerIcon} aria-label="Notificações">
            <Icon name="bell" size={22} />
          </button>
        </div>
        <div className={styles.segmentedRow}>
          <div className={styles.segmented} role="tablist" aria-label="Modo de atendimento">
            <button type="button" role="tab" aria-selected="true" className={`${styles.segTab} ${styles.segTabActive}`}>
              Adulto
            </button>
            <button type="button" role="tab" aria-selected="false" className={styles.segTab}>
              <Icon name="baby" size={16} />
              Pediatra
            </button>
          </div>
        </div>
      </header>

      <main className={styles.content}>
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

        {/* Urgências — visual (expandido) */}
        <section className={styles.categoryCard}>
          <div className={styles.categoryHeader}>
            <span className={styles.categoryIcon} style={{ color: 'var(--hero-red)' }}>
              <Icon name="siren" size={24} />
            </span>
            <span className={styles.categoryName}>Urgências</span>
            <span className={styles.countBadge}>15</span>
            <Icon name="chevronDown" size={20} className={styles.categoryChevron} />
          </div>
          <div className={styles.grid}>
            {chunkPairs(URGENCIA_GRID).map((row, ri) => (
              <div key={ri} className={styles.gridRow}>
                {row.map((item, ci) => (
                  <FeatureCard key={ci} abbr={item.abbr} name={item.name} status={item.status} />
                ))}
              </div>
            ))}
          </div>
          <button type="button" className={styles.verMaisButton}>
            <Icon name="siren" size={20} />
            Ver todas as 15 urgências
            <Icon name="arrowRight" size={20} />
          </button>
        </section>

        {/* Demais categorias — colapsadas, visual */}
        {CATEGORIES.map((cat) => (
          <section key={cat.name} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon} style={{ color: cat.color }}>
                <Icon name={cat.icon} size={24} />
              </span>
              <span className={styles.categoryName}>{cat.name}</span>
              <span className={styles.countBadge}>{cat.count}</span>
              <Icon name="chevronRight" size={20} className={styles.categoryChevron} />
            </div>
          </section>
        ))}
      </main>

      <nav className={styles.tabBar} aria-label="Navegação principal">
        {NAV.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`${styles.tab} ${tab.active ? styles.tabActive : ''}`}
          >
            <Icon name={tab.icon} size={24} />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
