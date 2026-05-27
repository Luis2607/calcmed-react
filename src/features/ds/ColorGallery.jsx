import styles from './ColorGallery.module.css';
import {
  COLOR_TOKEN_META,
  COMPONENT_COLOR_GROUPS,
  DOMAIN_COLOR_GROUP,
  MODE_COLOR_GROUP,
  PRIMITIVE_COLOR_GROUPS,
  SEMANTIC_COLOR_GROUPS,
} from '../../shared/design-tokens/colorTokens';

function cssVarName(tokenName) {
  return `--ds-${tokenName.replaceAll('/', '-')}`;
}

function readCssCustomProperty(name, seen = new Set()) {
  if (typeof window === 'undefined' || seen.has(name)) return '';
  seen.add(name);
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const alias = raw.match(/^var\((--[A-Za-z0-9_-]+)\)$/);
  if (alias) return readCssCustomProperty(alias[1], seen);
  return raw;
}

function normalizeColor(value) {
  if (!value) return '';
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!hex) return value.trim().toUpperCase();
  const raw = hex[1];
  if (raw.length === 3) {
    return `#${raw.split('').map((char) => char + char).join('')}`.toUpperCase();
  }
  return `#${raw.slice(0, 6)}`.toUpperCase();
}

function getStatus(token) {
  const cssVar = cssVarName(token.name);
  const codeValue = normalizeColor(readCssCustomProperty(cssVar));
  const figmaValue = normalizeColor(token.values.Light ?? token.values.Adulto);
  if (!codeValue) return { label: 'Falta no codigo', tone: 'missing', codeValue: '-' };
  if (codeValue !== figmaValue) return { label: 'Divergente', tone: 'drift', codeValue };
  return { label: 'Sincronizado', tone: 'ok', codeValue };
}

function collectTokens(groups) {
  return groups.flatMap((group) => group.tokens);
}

function getCoverage(tokens) {
  const statuses = tokens.map(getStatus);
  return {
    total: statuses.length,
    ok: statuses.filter((status) => status.tone === 'ok').length,
    drift: statuses.filter((status) => status.tone === 'drift').length,
    missing: statuses.filter((status) => status.tone === 'missing').length,
  };
}

function PrimitiveSwatch({ name, value }) {
  return (
    <div className={styles.primitiveSwatch}>
      <div className={styles.swatch} style={{ backgroundColor: value }} />
      <span className={styles.swatchName}>{name.split('/').at(-1)}</span>
      <span className={styles.swatchValue}>{value}</span>
    </div>
  );
}

function TokenCard({ token }) {
  const status = getStatus(token);
  const cssVar = cssVarName(token.name);

  return (
    <article className={styles.tokenCard} data-status={status.tone}>
      <div className={styles.tokenHeader}>
        <span className={styles.tokenName}>{token.name}</span>
        <span className={styles.status}>{status.label}</span>
      </div>
      <div className={styles.modeGrid}>
        {Object.entries(token.values).map(([mode, value]) => (
          <div key={mode} className={styles.modeSwatch}>
            <div className={styles.swatch} style={{ backgroundColor: value }} />
            <span>{mode}</span>
            <code>{value}</code>
          </div>
        ))}
      </div>
      <div className={styles.codeRow}>
        <code>{cssVar}</code>
        <code>{status.codeValue}</code>
      </div>
    </article>
  );
}

function CoverageCard({ title, coverage }) {
  return (
    <div className={styles.coverageCard}>
      <span className={styles.coverageTitle}>{title}</span>
      <strong>{coverage.ok}/{coverage.total}</strong>
      <span>{coverage.drift} divergentes · {coverage.missing} faltando</span>
    </div>
  );
}

function PrimitiveSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Figma · Primitivos</span>
        <h2>Escalas base</h2>
        <p>Referencia visual das familias de cor. Nesta fase elas nao alteram o app; servem para conferir o contrato do DS.</p>
      </div>
      <div className={styles.primitiveStack}>
        {PRIMITIVE_COLOR_GROUPS.map((group) => (
          <div key={group.title} className={styles.primitiveGroup}>
            <div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            <div className={styles.primitiveGrid}>
              {group.colors.map(([name, value]) => (
                <PrimitiveSwatch key={name} name={name} value={value} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TokenSection({ eyebrow, title, description, groups }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.tokenGroups}>
        {groups.map((group) => (
          <div key={group.title} className={styles.tokenGroup}>
            <h3>{group.title}</h3>
            <div className={styles.tokenGrid}>
              {group.tokens.map((token) => (
                <TokenCard key={token.name} token={token} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ColorGallery() {
  const semanticCoverage = getCoverage(collectTokens(SEMANTIC_COLOR_GROUPS));
  const domainCoverage = getCoverage(DOMAIN_COLOR_GROUP.tokens);
  const componentCoverage = getCoverage(collectTokens(COMPONENT_COLOR_GROUPS));
  const modeCoverage = getCoverage(MODE_COLOR_GROUP.tokens);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Cores</h1>
        <p>
          Espelho executavel da pagina Cores do Figma. Ele compara tokens do DS com os aliases CSS usados no React,
          sem alterar nenhuma tela do produto.
        </p>
        <span className={styles.sourceMeta}>
          Figma {COLOR_TOKEN_META.figmaFileKey} · pagina {COLOR_TOKEN_META.figmaPage} · snapshot {COLOR_TOKEN_META.extractedAt}
        </span>
        <div className={styles.coverageGrid}>
          <CoverageCard title="Semanticos" coverage={semanticCoverage} />
          <CoverageCard title="Dominios" coverage={domainCoverage} />
          <CoverageCard title="Componentes" coverage={componentCoverage} />
          <CoverageCard title="Modo" coverage={modeCoverage} />
        </div>
      </header>

      <PrimitiveSection />

      <TokenSection
        eyebrow="Figma · Semanticos"
        title="Tokens semanticos"
        description="Mapeiam intencao: superficie, texto, borda, interacao e feedback. A coluna Codigo mostra o valor resolvido hoje no React."
        groups={SEMANTIC_COLOR_GROUPS}
      />

      <TokenSection
        eyebrow="Figma · Dominios"
        title="Cores de dominio"
        description="Identificam areas clinicas sem misturar dominios com feedback clinico."
        groups={[DOMAIN_COLOR_GROUP]}
      />

      <TokenSection
        eyebrow="Figma · Componentes"
        title="Tokens de componentes"
        description="Cores especificas de botao, input, card, alerta, navegacao, chip e toast."
        groups={COMPONENT_COLOR_GROUPS}
      />

      <TokenSection
        eyebrow="Figma · Modo"
        title="Modo Adulto / Pediatria"
        description="Tokens de variacao por modo. Hoje aparecem como pendencia porque o CSS ainda nao tem aliases --ds-modo-*."
        groups={[MODE_COLOR_GROUP]}
      />
    </div>
  );
}
