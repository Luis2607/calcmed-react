import styles from './IconsGallery.module.css';
import { ICONS_TOKEN_META, ICONS_TOKEN_GROUPS } from '../../shared/design-tokens/iconsTokens';
import { Icon } from '../../shared/components/atoms/Icon';

function getIconStatus(token) {
  // Lista de ícones que caem no fallback de Icon.jsx por não ter SVG codificado ainda
  const unmappedIcons = [
    'rodape', 'configuracoes', 'ajuda', 'sair', 'modo-escuro',
    'cartao-credito', 'bloqueado', 'premium', 'arrastar', 'frasco',
    'raio', 'relogio-rapido', 'medidor', 'estetoscopio', 'busca-vazia', 'favoritos-vazio',
    'sem-conexao', 'conteudo-premium', 'plantao-vazio', 'erro-rede', 'erro-timeout',
    'erro-conteudo', 'erro-calculo', 'carregando', 'email', 'whatsapp', 'usuario',
    'usuarios', 'envelope', 'audio', 'audio-mute', 'coracao-cheio', 'coracao', 'procedimento'
  ];
  const isUnmapped = unmappedIcons.includes(token.name);
  if (isUnmapped) {
    return { label: 'Pendente no código', tone: 'missing' };
  }
  return { label: 'Sincronizado', tone: 'ok' };
}

function IconCard({ token }) {
  const status = getIconStatus(token);
  
  return (
    <article className={styles.iconCard} data-status={status.tone}>
      <div className={styles.visualArea}>
        <div className={styles.iconWrapper} data-mapped={status.tone === 'ok'}>
          <Icon name={token.name} size={32} color={status.tone === 'ok' ? 'var(--ds-interativo-primario, #007993)' : 'var(--ds-texto-terciario, #94A3B8)'} />
        </div>
      </div>
      
      <div className={styles.metaArea}>
        <span className={styles.iconName}>{token.name}</span>
        <code className={styles.figmaId}>ID {token.figmaId}</code>
      </div>
      
      <div className={styles.statusFooter}>
        <span className={`${styles.statusBadge} ${styles[status.tone]}`}>{status.label}</span>
      </div>
    </article>
  );
}

function CoverageCard({ title, total, ok, missing }) {
  const percent = total > 0 ? Math.round((ok / total) * 100) : 0;
  return (
    <div className={styles.coverageCard}>
      <span className={styles.coverageTitle}>{title}</span>
      <div className={styles.coverageValueRow}>
        <strong>{ok}/{total}</strong>
        <span className={styles.percentage}>{percent}% Mapeado</span>
      </div>
      <div className={styles.progressBarBg}>
        <div className={styles.progressBar} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.coverageStats}>
        {missing} ícones pendentes de importação vetorial SVG no React
      </span>
    </div>
  );
}

export function IconsGallery() {
  const allTokens = ICONS_TOKEN_GROUPS.flatMap(g => g.tokens);
  
  let okCount = 0;
  let missingCount = 0;
  
  allTokens.forEach(token => {
    const status = getIconStatus(token);
    if (status.tone === 'ok') okCount++;
    else missingCount++;
  });
  
  const stats = {
    total: allTokens.length,
    ok: okCount,
    missing: missingCount
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · Biblioteca de Ativos</span>
        <h1>Ícones do Sistema</h1>
        <p>
          Painel de conformidade da biblioteca de ícones. Ele confronta os 89 componentes de ícones da página oficial do Figma com os SVGs centralizados no componente <code>&lt;Icon /&gt;</code> do React.
        </p>
        <span className={styles.sourceMeta}>
          Figma {ICONS_TOKEN_META.figmaFileKey} · página {ICONS_TOKEN_META.figmaPage} · snapshot {ICONS_TOKEN_META.extractedAt}
        </span>
        <div className={styles.coverageGrid}>
          <CoverageCard 
            title="Cobertura Vetorial Clínico-Geral" 
            total={stats.total} 
            ok={stats.ok} 
            missing={stats.missing} 
          />
        </div>
      </header>

      <div className={styles.tokenGroups}>
        {ICONS_TOKEN_GROUPS.map((group) => (
          <section key={group.title} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className={styles.tokenGrid}>
              {group.tokens.map((token) => (
                <IconCard key={token.name} token={token} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
