import { useEffect, useState } from 'react';
import styles from './TypographyGallery.module.css';
import {
  TYPOGRAPHY_TOKEN_META,
  TYPOGRAPHY_TOKEN_GROUPS,
} from '../../shared/design-tokens/typographyTokens';

function getComputedFont(cssAlias) {
  if (typeof document === 'undefined') return null;
  try {
    const temp = document.createElement('div');
    temp.style.font = `var(${cssAlias})`;
    // Garantir que herda a fonte padrão caso falhe
    document.body.appendChild(temp);
    const style = window.getComputedStyle(temp);
    const size = style.fontSize;
    const weight = style.fontWeight;
    const lineHeight = style.lineHeight;
    document.body.removeChild(temp);
    
    // Se o alias não estiver definido, o navegador pode ignorar a regra font ou herdar padrão.
    // Vamos ler a propriedade customizada bruta para ter certeza de que ela existe.
    const rawValue = window.getComputedStyle(document.documentElement).getPropertyValue(cssAlias).trim();
    if (!rawValue) {
      return null;
    }
    
    return { size, weight, lineHeight, rawValue };
  } catch {
    return null;
  }
}

function getStatus(token, computed) {
  if (!computed) {
    return { label: 'Falta no codigo', tone: 'missing', values: null };
  }
  
  // Normalizar pesos numéricos para comparação
  const normWeight = (w) => {
    if (w === 'Bold') return '700';
    if (w === 'Semi Bold' || w === 'SemiBold') return '600';
    if (w === 'Medium') return '500';
    if (w === 'Regular') return '400';
    return String(w);
  };
  
  const figmaSize = token.values.size;
  const figmaWeight = normWeight(token.values.weight);
  // Normalizar lineHeight do Figma (ex: 32px) contra o resolvido do browser (que pode vir em px)
  const figmaLineHeight = token.values.lineHeight;
  
  const browserSize = computed.size;
  const browserWeight = normWeight(computed.weight);
  const browserLineHeight = computed.lineHeight;
  
  const hasDrift = 
    browserSize !== figmaSize || 
    browserWeight !== figmaWeight || 
    (browserLineHeight !== figmaLineHeight && browserLineHeight !== 'normal');
    
  if (hasDrift) {
    return { 
      label: 'Divergente', 
      tone: 'drift', 
      values: { size: browserSize, weight: browserWeight, lineHeight: browserLineHeight } 
    };
  }
  
  return { 
    label: 'Sincronizado', 
    tone: 'ok', 
    values: { size: browserSize, weight: browserWeight, lineHeight: browserLineHeight } 
  };
}

function TokenCard({ token }) {
  const [computed, setComputed] = useState(null);
  
  useEffect(() => {
    // Adicionar um pequeno atraso para garantir que os estilos estejam carregados no DOM
    const timer = setTimeout(() => {
      setComputed(getComputedFont(token.cssAlias));
    }, 100);
    return () => clearTimeout(timer);
  }, [token.cssAlias]);
  
  const status = getStatus(token, computed);
  const sampleText = token.name.includes('crono') || token.name.includes('num') || token.name.includes('dose') || token.name.includes('valor')
    ? '08:45.32' 
    : 'O potássio sérico (K) menor que 3.5 mEq/L bloqueia o uso de insulina.';

  return (
    <article className={styles.tokenCard} data-status={status.tone}>
      <div className={styles.tokenHeader}>
        <div className={styles.nameSection}>
          <span className={styles.tokenName}>{token.figmaStyleName}</span>
          <code className={styles.cssVar}>{token.cssAlias}</code>
        </div>
        <span className={`${styles.statusBadge} ${styles[status.tone]}`}>{status.label}</span>
      </div>
      
      <div className={styles.previewContainer}>
        <div 
          className={styles.previewText} 
          style={{ font: `var(${token.cssAlias})` }}
        >
          {sampleText}
        </div>
      </div>
      
      <div className={styles.specGrid}>
        <div className={styles.specColumn}>
          <span className={styles.specTitle}>Figma (Especificado)</span>
          <div className={styles.specValues}>
            <div>Tamanho: <strong>{token.values.size}</strong></div>
            <div>Peso: <strong>{token.values.weight}</strong></div>
            <div>Linha: <strong>{token.values.lineHeight}</strong></div>
          </div>
        </div>
        
        <div className={styles.specColumn}>
          <span className={styles.specTitle}>Navegador (Calculado)</span>
          {status.values ? (
            <div className={styles.specValues}>
              <div>Tamanho: <strong>{status.values.size}</strong></div>
              <div>Peso: <strong>{status.values.weight}</strong></div>
              <div>Linha: <strong>{status.values.lineHeight}</strong></div>
            </div>
          ) : (
            <div className={styles.missingLabel}>Nao declarado no CSS</div>
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

export function TypographyGallery() {
  const [stats, setStats] = useState({ total: 0, ok: 0, drift: 0, missing: 0 });
  const allTokens = TYPOGRAPHY_TOKEN_GROUPS.flatMap(g => g.tokens);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let okCount = 0;
      let driftCount = 0;
      let missingCount = 0;
      
      allTokens.forEach(token => {
        const comp = getComputedFont(token.cssAlias);
        const status = getStatus(token, comp);
        if (status.tone === 'ok') okCount++;
        else if (status.tone === 'drift') driftCount++;
        else missingCount++;
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
        <h1>Tipografia</h1>
        <p>
          Painel de auditoria executavel de estilos de texto. Ele compara a escala tipografica do Figma com os shorthands CSS resolvidos no React, apontando desvios.
        </p>
        <span className={styles.sourceMeta}>
          Figma {TYPOGRAPHY_TOKEN_META.figmaFileKey} · pagina {TYPOGRAPHY_TOKEN_META.figmaPage} · snapshot {TYPOGRAPHY_TOKEN_META.extractedAt}
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
        {TYPOGRAPHY_TOKEN_GROUPS.map((group) => (
          <section key={group.title} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className={styles.tokenGrid}>
              {group.tokens.map((token) => (
                <TokenCard key={token.name} token={token} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
