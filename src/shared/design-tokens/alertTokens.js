export const ALERT_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Componentes (Alert Card 130:4043)',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
  note: 'Specs lidos nó-a-nó via Desktop Bridge (REST token expirado). 20 variantes = Level(5)×Dark(2)×Modo(2).',
};

// Eixos reais do component set Alert Card (figma_get_component_details).
export const ALERT_VARIANT_AXES = [
  { name: 'Level', values: ['Info', 'Result', 'Critical', 'Warning', 'Footnote'] },
  { name: 'Dark mode', values: ['False', 'True'] },
  { name: 'Modo', values: ['Adulto', 'Pediatria'] },
];

// Component properties do Figma (defaults reais).
export const ALERT_PROPERTIES = [
  { prop: 'Title text', figma: 'TEXT · "Título do alerta"', code: 'prop title', status: 'ok' },
  { prop: 'Body text', figma: 'TEXT · "Descrição do alerta"', code: 'children', status: 'ok' },
  { prop: 'Show icon', figma: 'BOOLEAN · default true', code: 'prop showIcon', status: 'ok' },
  { prop: 'Show Body', figma: 'BOOLEAN · default true', code: 'render se children (implícito)', status: 'parcial' },
  { prop: 'Show Chevron', figma: 'BOOLEAN · default false', code: 'AUSENTE', status: 'gap' },
  { prop: 'Show Value (Dose+Unit)', figma: 'BOOLEAN · default false · Dose 32 Bold + Unit 20 Medium', code: 'props showValue/value/unit (cor do level) — usado no ClinicalCard', status: 'ok' },
  { prop: 'Modo (Adulto/Pediatria)', figma: 'VARIANT', code: 'via .modo-pediatrico (fill tint + título + radius 24)', status: 'ok' },
  { prop: 'Dark mode', figma: 'VARIANT (vars modo/* dark)', code: 'via .modo-escuro · prop darkMode aplica o escopo', status: 'ok' },
];

// Matriz de drift por spec (Adulto · Light salvo nota).
export const ALERT_TOKEN_GROUPS = [
  {
    title: 'Frame / Box',
    figmaNode: '130:4043',
    tokens: [
      { part: 'Radius', figma: '12 (Adulto) · 24 (Pediatria)', code: 'var(--radius-alert) 12 · 24 sob .modo-pediatrico', drift: false },
      { part: 'Stroke weight', figma: '2px', code: '2px', drift: false, note: 'MT-B aplicado' },
      { part: 'Padding', figma: '16 / 16 / 16 / 20 (left=20)', code: '16/16/16/20 (--esp-5)', drift: false, note: 'MT-B aplicado' },
      { part: 'Layout', figma: 'vertical: Header[Icon+Title] / Value / Body (full-width)', code: 'horizontal: icon | coluna(title, body)', drift: true, note: 'MT-E estrutural' },
    ],
  },
  {
    title: 'Texto',
    figmaNode: '130:4043',
    tokens: [
      { part: 'Title (Adulto)', figma: 'alerta-X-titulo = #0F172A (escuro)', code: '--ds-texto-padrao (#0F172A)', drift: false, note: 'MT-D aplicado' },
      { part: 'Title (Pediatria)', figma: 'alerta-X-titulo colorido por level', code: '--ds-texto-padrao (ainda escuro)', drift: true, note: 'MT-G · Pediatria title colorido pendente' },
      { part: 'Body', figma: 'texto/secundario (#475569) em TODOS os levels', code: '--ds-texto-secundario (hardcodes removidos)', drift: false, note: 'MT-C aplicado' },
      { part: 'Value Dose/Unit', figma: '32 Bold / 20 Medium · cor do level', code: 'ausente no AlertCard', drift: true, note: 'MT-H' },
    ],
  },
  {
    title: 'Cores por Level (Adulto Light)',
    figmaNode: '130:4043',
    tokens: [
      { part: 'Info', figma: 'fill #fff · border #E2E8F0 (borda-padrao)', code: 'bg --ds-fundo-cartao · border --ds-borda-padrao', drift: false, note: 'MT-D aplicado' },
      { part: 'Result', figma: 'fill #fff · border #047857 (retorno/sucesso)', code: 'bg --ds-fundo-cartao · border --retorno-sucesso', drift: false, note: 'medido #047857' },
      { part: 'Critical', figma: 'fill #fff · border #991B1B (retorno/critico)', code: 'bg --ds-fundo-cartao · border --retorno-critico', drift: false, note: 'medido #991B1B' },
      { part: 'Warning', figma: 'fill #fff · border #92400E (retorno/atencao)', code: 'bg --ds-fundo-cartao · border --retorno-atencao', drift: false, note: 'medido #92400E' },
      { part: 'Footnote', figma: 'fill #fff (fundo/cartao) · border #F1F5F9 (fundo-elevado)', code: 'bg --ds-fundo-cartao · border --ds-fundo-elevado', drift: false, note: 'MT-D aplicado' },
    ],
  },
  {
    title: 'Ícones por Level (glifo confirmado via export SVG do Figma)',
    figmaNode: '130:4043',
    tokens: [
      { part: 'Info', figma: 'icone/informacao (círculo + i)', code: 'círculo + i', drift: false },
      { part: 'Result', figma: 'icone/sucesso (círculo + check)', code: 'círculo + check', drift: false },
      { part: 'Critical', figma: 'icone/atencao (TRIÂNGULO)', code: 'triângulo (corrigido de círculo)', drift: false, note: 'estava errado · fix verificado' },
      { part: 'Warning', figma: 'icone/critico (OCTÓGONO)', code: 'polígono 8 pontos (corrigido de triângulo)', drift: false, note: 'estava errado · fix verificado' },
      { part: 'Footnote', figma: 'icone/rodape (nota + dobra)', code: 'nota + dobra (corrigido de círculo-i)', drift: false, note: 'estava errado · fix verificado' },
      { part: 'Átomo Icon (DS)', figma: 'icone/critico=octógono · icone/rodape=nota', code: 'atom critico=CÍRCULO (drift) · rodape=fallback', drift: true, note: 'drift NO ÁTOMO Icon — corrigir à parte com análise de impacto (não afeta AlertCard, que usa SVG próprio)' },
    ],
  },
  {
    title: 'Toast / Snackbar (base Alert Compact 131:4093)',
    figmaNode: '131:4093',
    tokens: [
      { part: 'Type', figma: 'Success / Error (2)', code: "prop type 'success'|'error'", drift: false },
      { part: 'Fill / Borda', figma: 'fundo/cartao · borda 1px (#A7F3D0 / #FECACA)', code: '--ds-fundo-cartao · --retorno-X-borda', drift: false },
      { part: 'Ícone', figma: 'Success=sucesso(check) · Error=atencao(TRIÂNGULO)', code: 'check-circle / triângulo', drift: false },
      { part: 'Mensagem', figma: '14 Medium · texto/padrao (1 linha)', code: '14/500 · --ds-texto-padrao', drift: false },
      { part: 'Geometria', figma: 'r12 · pad 12/16 · gap 8 · sombra-toast', code: '--ds-r-md · esp-3/esp-4 · esp-2 · --sombra-toast', drift: false },
      { part: 'Show dismiss', figma: 'BOOLEAN', code: 'prop onDismiss → X', drift: false },
      { part: 'Ação Desfazer', figma: 'NÃO existe no Figma', code: 'prop onUndo → botão Desfazer (extensão)', drift: true, note: 'pendência Figma logada em docs/ds-issues-figma.md' },
      { part: 'Dark border (combo)', figma: 'Success #065f46 / Error #991b1b', code: '--retorno-X-borda (tint light)', drift: true, note: 'gap residual · -borda não tem dark' },
    ],
  },
  {
    title: 'Tema / Modo',
    figmaNode: '130:4043',
    tokens: [
      { part: 'Dark mode', figma: '10 variantes dark · bordas #fca5a5/#34d399/#fcd34d/#2a3f5f', code: 'via .modo-escuro (tokens) · prop darkMode aplica o escopo', drift: false, note: 'MT-F aplicado · medido #1A2942/#34D399' },
      { part: 'Pediatria fill + título', figma: 'tint #f1f5f9/#ecfdf5/#fef2f2/#fffbeb + título colorido', code: ':global(.modo-pediatrico) tint + título', drift: false, note: 'MT-G aplicado · medido #ECFDF5/#FEF2F2 + título colorido' },
      { part: 'Pediatria radius', figma: '24', code: 'cascateia via .modo-pediatrico', drift: false },
      { part: 'Layout (vertical)', figma: 'Header[ícone+título] / Body full-width', code: 'horizontal [ícone | coluna]', drift: true, note: 'MT-E DEFERIDO — layout horizontal funciona; fidelidade adiada' },
      { part: 'Pediatria + Dark (combo)', figma: 'tint escuro #223249/#022c22/#450a0a', code: 'usa tint light (retorno-*-fundo não tem dark)', drift: true, note: 'combo raro · gap residual logado' },
    ],
  },
];
