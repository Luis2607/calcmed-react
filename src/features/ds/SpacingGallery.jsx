import { useEffect, useState } from 'react';
import styles from './SpacingGallery.module.css';
import {
  SPACING_TOKEN_META,
  SPACING_TOKEN_GROUPS,
} from '../../shared/design-tokens/spacingTokens';

function getComputedValue(cssAlias, isRadius = false) {
  if (typeof document === 'undefined') return null;
  try {
    const temp = document.createElement('div');
    if (isRadius) {
      temp.style.borderRadius = `var(${cssAlias})`;
    } else {
      temp.style.width = `var(${cssAlias})`;
    }
    document.body.appendChild(temp);
    const style = window.getComputedStyle(temp);
    const resolvedValue = isRadius ? style.borderRadius : style.width;
    document.body.removeChild(temp);
    
    // Verificar se a propriedade bruta existe no :root
    const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(cssAlias).trim();
    if (!rawValue) {
      return null;
    }
    
    return resolvedValue;
  } catch {
    return null;
  }
}

function getStatus(token, computedValue) {
  if (!computedValue) {
    return { label: 'Falta no codigo', tone: 'missing', value: '-' };
  }
  
  // Normalizar valores para comparação
  const normalize = (val) => {
    return val.replace('px', '').trim();
  };
  
  const figmaNorm = normalize(token.figmaValue);
  const browserNorm = normalize(computedValue);
  
  // Se for radius-pill, aceita qualquer valor alto (como 999px ou 100px)
  if (token.name === 'r-pill') {
    if (parseInt(browserNorm, 10) >= 100) {
      return { label: 'Sincronizado', tone: 'ok', value: computedValue };
    }
  }
  
  if (figmaNorm !== browserNorm) {
    return { label: 'Divergente', tone: 'drift', value: computedValue };
  }
  
  return { label: 'Sincronizado', tone: 'ok', value: computedValue };
}

function TokenCard({ token, isRadius = false }) {
  const [computed, setComputed] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setComputed(getComputedValue(token.cssAlias, isRadius));
    }, 100);
    return () => clearTimeout(timer);
  }, [token.cssAlias, isRadius]);
  
  const status = getStatus(token, computed);

  return (
    <article className={styles.tokenCard} data-status={status.tone}>
      <div className={styles.tokenHeader}>
        <div className={styles.nameSection}>
          <span className={styles.tokenName}>{token.name}</span>
          <code className={styles.cssVar}>{token.cssAlias}</code>
        </div>
        <span className={`${styles.statusBadge} ${styles[status.tone]}`}>{status.label}</span>
      </div>
      
      <div className={styles.previewContainer}>
        {isRadius ? (
          <div className={styles.radiusWrapper}>
            <div 
              className={styles.radiusPreview} 
              style={{ borderRadius: `var(${token.cssAlias})` }}
            />
            <span className={styles.previewLabel}>Visualizacao de canto</span>
          </div>
        ) : (
          <div className={styles.spacingWrapper}>
            <div 
              className={styles.spacingPreview} 
              style={{ width: `var(${token.cssAlias})` }}
            />
            <span className={styles.previewLabel}>Dimensoes da barra</span>
          </div>
        )}
      </div>
      
      <div className={styles.specGrid}>
        <div className={styles.specColumn}>
          <span className={styles.specTitle}>Figma (Especificado)</span>
          <strong>{token.figmaValue}</strong>
        </div>
        
        <div className={styles.specColumn}>
          <span className={styles.specTitle}>Navegador (Calculado)</span>
          {status.value !== '-' ? (
            <strong>{status.value}</strong>
          ) : (
            <span className={styles.missingLabel}>Nao declarado no CSS</span>
          )}
        </div>
      </div>
    </article>
  );
}

function CoverageCard({ title, total, ok, drift, missing }) {
  return (
    <div className={styles.coverageCard}>
      <span className={styles.coverageTitle}>{title}</span>
      <strong>{ok}/{total}</strong>
      <span className={styles.coverageStats}>
        {drift} divergentes · {missing} faltando
      </span>
    </div>
  );
}

export function SpacingGallery() {
  const [stats, setStats] = useState({ total: 0, ok: 0, drift: 0, missing: 0 });
  const allTokens = SPACING_TOKEN_GROUPS.flatMap(g => g.tokens);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let okCount = 0;
      let driftCount = 0;
      let missingCount = 0;
      
      SPACING_TOKEN_GROUPS.forEach(group => {
        const isRadius = group.title.includes('Radius');
        group.tokens.forEach(token => {
          const comp = getComputedValue(token.cssAlias, isRadius);
          const status = getStatus(token, comp);
          if (status.tone === 'ok') okCount++;
          else if (status.tone === 'drift') driftCount++;
          else missingCount++;
        });
      });
      
      setStats({
        total: allTokens.length,
        ok: okCount,
        drift: driftCount,
        missing: missingCount
      });
    }, 200);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Espacamento e Radius</h1>
        <p>
          Painel de auditoria executavel de gaps, margens e arredondamento de bordas. Ele compara a escala base-4 e o property map de cantos do Figma contra o CSS computado no React.
        </p>
        <span className={styles.sourceMeta}>
          Figma {SPACING_TOKEN_META.figmaFileKey} · pagina {SPACING_TOKEN_META.figmaPage} · snapshot {SPACING_TOKEN_META.extractedAt}
        </span>
        <div className={styles.coverageGrid}>
          <CoverageCard 
            title="Conformidade Geral" 
            total={stats.total} 
            ok={stats.ok} 
            drift={stats.drift} 
            missing={stats.missing} 
          />
        </div>
      </header>

      <div className={styles.tokenGroups}>
        {SPACING_TOKEN_GROUPS.map((group) => {
          const isRadius = group.title.includes('Radius');
          return (
            <section key={group.title} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <div className={styles.tokenGrid}>
                {group.tokens.map((token) => (
                  <TokenCard key={token.name} token={token} isRadius={isRadius} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
