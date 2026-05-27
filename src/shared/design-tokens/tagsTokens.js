export const TAGS_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Tags e Chips',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

// Tones reais extraídos do Figma (Light).
export const TAG_STATUS_TONES = [
  { tone: 'premium', label: 'Premium', figma: 'interativo/primario' },
  { tone: 'novo', label: 'Novo', figma: 'retorno/sucesso' },
  { tone: 'atualizado', label: 'Atualizado', figma: 'interativo/primario' },
  { tone: 'recomendado', label: 'Recomendado', figma: 'interativo/primario' },
  { tone: 'melhoria', label: 'Melhoria', figma: 'interativo/destaque #00B4D8' },
  { tone: 'teste', label: 'Teste', figma: 'sucesso-fundo + sucesso' },
  { tone: 'bonus', label: 'Bônus', figma: 'sucesso-fundo + sucesso' },
  { tone: 'gratuito', label: 'Gratuito', figma: 'fundo-elevado + secundário' },
  { tone: 'expira', label: 'Expira Hoje', figma: 'retorno/atencao' },
  { tone: 'atencao', label: 'Atenção', figma: 'retorno/atencao' },
  { tone: 'critico', label: 'Crítico', figma: '#DC2626 (NÃO tokenizado)' },
  { tone: 'alerta', label: 'Alerta', figma: '#F59E0B (NÃO tokenizado)' },
];

export const TAG_DOMAIN_TONES = [
  { tone: 'urgencias', label: 'Urgências' },
  { tone: 'diluicoes', label: 'Diluições' },
  { tone: 'calculadoras', label: 'Calculadoras' },
  { tone: 'protocolos', label: 'Protocolos' },
  { tone: 'escores', label: 'Escores' },
  { tone: 'conversores', label: 'Conversores' },
];

export const TAGS_TOKEN_GROUPS = [
  {
    title: 'Tag Status',
    figmaNode: '128:3769',
    tokens: [
      { part: 'Geometria', figma: 'h24 · r4 · pad 4/8 · 11 Semi Bold', code: 'r4 (--ds-r-xs) · pad 4/8 · 11/600', drift: false },
      { part: 'Tones (12)', figma: 'Premium/Novo/Atualizado/Recomendado/Melhoria/Teste/Bonus/Gratuito/Expira/Atenção/Crítico/Alerta', code: 'prop tone (12)', drift: false },
      { part: 'Crítico / Alerta', figma: '#DC2626 / #F59E0B · fillVar NULL (não tokenizado)', code: '--ds-tag-critico-fundo / --ds-tag-alerta-fundo (novos)', drift: true, note: 'TC2 · Figma deve tokenizar' },
    ],
  },
  {
    title: 'Tag Domain',
    figmaNode: '128:3744',
    tokens: [
      { part: 'Geometria', figma: 'h24 · r4 · pad 4/12 · 11 Semi Bold', code: 'r4 · pad 4/12 · 11/600', drift: false },
      { part: 'Tones (6)', figma: 'tint-bg + texto colorido (dominio/X-fundo / -texto)', code: 'prop tone (6) · --ds-tag-X (Figma-aligned)', drift: false },
      { part: 'Tokens de domínio', figma: 'dominio/* (tint + colorido)', code: '--ds-dominio-* legado DIVERGE (solid-bg, 0/18)', drift: true, note: 'TC1 · usei --ds-tag-* novos p/ não regredir cards' },
    ],
  },
  {
    title: 'Tag Count',
    figmaNode: '128:3779',
    tokens: [
      { part: 'Geometria', figma: 'h20 · pill · pad 2/8 · 11 Semi Bold', code: 'pill · pad 2/8 · 11/600', drift: false },
      { part: 'Cor', figma: 'fundo/elevado + texto/padrao', code: '--ds-fundo-elevado + --ds-texto-padrao', drift: false },
    ],
  },
  {
    title: 'Chip (filtro)',
    figmaNode: '128:3792',
    tokens: [
      { part: 'Geometria', figma: 'h36 · pill · pad 8/16 · 14 Medium', code: 'min-h36 · pill · pad 8/16 · 14/500', drift: false },
      { part: 'Default', figma: 'transparente + borda #E2E8F0 + texto padrao', code: 'transparent + --ds-borda-padrao + --ds-texto-padrao', drift: false },
      { part: 'Active', figma: 'fill #007993 + texto branco', code: '--ds-interativo-primario + sobre-destaque', drift: false },
      { part: 'Inactive', figma: 'borda + texto terciario (dimmed)', code: '--ds-borda-padrao + --ds-texto-terciario', drift: false },
      { part: 'Dismissible', figma: 'Chip Dismissible 128:3801 · + X · tint domínio', code: 'prop onDismiss (X) + tone domínio', drift: false },
    ],
  },
  {
    title: 'UnitChip (concentração)',
    figmaNode: '173:10855',
    tokens: [
      { part: 'Geometria', figma: 'h24 · pill · pad 4/8 · 11 Semi Bold', code: 'pill · pad 4/8 · 11/600', drift: false },
      { part: 'Cor', figma: 'chip/fundo + chip/texto (#475569)', code: '--ds-chip-fundo + --ds-texto-secundario', drift: false, note: '--ds-chip-texto era padrao; Figma usa secundário' },
    ],
  },
  {
    title: 'Tag Abbr',
    figmaNode: '145:33146',
    tokens: [
      { part: 'Geometria', figma: 'h36 · r8 · pad 4/12 · 18 Semi Bold', code: 'variant abbr · --ds-r-sm · 18/600', drift: false },
      { part: 'Tones (6)', figma: 'cor 12% (fundo) + texto sólido por domínio', code: 'prop tone (6) · --ds-tag-abbr-* (novos)', drift: false },
      { part: 'Tokenização Figma', figma: 'TODAS as 6 cores com fillVar NULL', code: '--ds-tag-abbr-* (Figma-aligned)', drift: true, note: 'TC3 · Figma deve tokenizar as 6 cores' },
    ],
  },
];
