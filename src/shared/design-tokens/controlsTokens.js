export const CONTROLS_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Controles de Seleção',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

// Specs extraidos ao vivo do Figma (Light · Adulto) via Desktop Bridge.
export const CONTROLS_TOKEN_GROUPS = [
  {
    title: 'Checkbox',
    figmaNode: '128:3664',
    tokens: [
      { part: 'Box', figma: '24×24 · r4', code: '24×24 · var(--ds-r-xs) 4px', drift: false },
      { part: 'Unchecked', figma: 'stroke 2px #E2E8F0', code: '2px var(--ds-borda-padrao)', drift: false },
      { part: 'Checked', figma: 'fill #007993', code: 'var(--ds-interativo-primario)', drift: false },
      { part: 'Label', figma: '14 Regular #0F172A', code: '14 · var(--ds-texto-padrao)', drift: false },
      { part: 'Strikethrough on check (bool)', figma: 'BOOLEAN', code: 'prop strikethrough (line-through no label marcado)', drift: false },
      { part: 'Maior (variant)', figma: 'Sim/Não', code: '❓ não implementado — box/label idênticos no Figma, não está claro o que muda', drift: true, note: 'Logado em docs/ds-issues-figma.md' },
    ],
  },
  {
    title: 'Radio',
    figmaNode: '128:3623',
    tokens: [
      { part: 'Círculo', figma: '24×24', code: '24×24', drift: false },
      { part: 'Selected', figma: 'stroke 1.5px #007993 + dot', code: 'border 2px teal + dot 10px', drift: true, note: 'stroke 2px no código vs 1.5px Figma' },
      { part: 'Unselected', figma: 'stroke 2px #E2E8F0', code: '2px var(--ds-borda-padrao)', drift: false },
      { part: 'Label', figma: '14 Regular', code: '14', drift: false },
      { part: 'Modo Adulto/Pediatria (variant)', figma: 'Adulto/Pediatria', code: 'AUSENTE no Radio', drift: true },
    ],
  },
  {
    title: 'Toggle',
    figmaNode: '1628:568',
    tokens: [
      { part: 'Track', figma: '51×31 · pill', code: '51×31 · pill (atom novo)', drift: false },
      { part: 'On', figma: 'fill #007993', code: 'var(--ds-interativo-primario)', drift: false },
      { part: 'Off', figma: 'fill #F1F5F9', code: 'var(--ds-fundo-elevado)', drift: false },
      { part: 'Thumb', figma: '27 branco', code: '27 #fff · translateX 20', drift: false },
    ],
  },
  {
    title: 'Segmented',
    figmaNode: '128:3688',
    tokens: [
      { part: 'Container', figma: '52h · r12 · #F1F5F9 · pad 4', code: 'r12 · --ds-fundo-elevado · pad esp-1', drift: false },
      { part: 'Segmento ativo', figma: 'branco', code: '--ds-fundo-cartao + sombra-cartao', drift: false },
      { part: 'Options (Number of options 2/3)', figma: 'variant', code: 'options[] dinâmico (N)', drift: false },
      { part: 'Show Tab Points', figma: 'BOOLEAN', code: 'AUSENTE', drift: true },
      { part: 'Dark mode', figma: 'False/True', code: 'via .modo-escuro', drift: false, note: 'medir' },
    ],
  },
  {
    title: 'RadioGroup / CheckboxGroup',
    figmaNode: '173:11246 / 901:164669',
    tokens: [
      { part: 'Group Label', figma: 'TEXT', code: 'prop label', drift: false },
      { part: 'Opção bordeada (card)', figma: 'card · borda 1.5px · r12 (calc/radio-group, calc/checkbox-group)', code: 'variant="card" (default) · .optionCard · borda 1.5px --ds-borda-sutil · r --ds-r-md · selected teal', drift: false, note: 'antes faltava: grupo renderizava controle nu. Agora card por opção.' },
      { part: 'Radius da opção (card/pill)', figma: 'cantos arredondados e pill', code: 'prop radius card|pill', drift: false },
      { part: 'Columns (1/2)', figma: 'variant', code: 'prop columns', drift: false },
      { part: 'Options (Show Option 3–8)', figma: 'BOOLEAN×N', code: 'options[] dinâmico (cobre N)', drift: false, note: 'array em vez de booleanos individuais' },
      { part: 'Modo (radio-group)', figma: 'Adulto/Pediatria', code: 'AUSENTE', drift: true },
    ],
  },
  {
    title: 'Toggle Tab',
    figmaNode: '128:3673',
    tokens: [
      { part: 'Pill', figma: '58×44 · r8', code: 'min-h44 · --ds-r-sm (8)', drift: false },
      { part: 'Active', figma: 'fill #F8FAFC + texto teal', code: '--ds-fundo-padrao + --ds-interativo-primario', drift: false },
      { part: 'Inactive', figma: 'transparente + secundário', code: 'transparent + --ds-texto-secundario', drift: false },
      { part: 'Show Icon / Show Points', figma: 'BOOLEAN + swap/text', code: 'props icon + points (via presença)', drift: false },
    ],
  },
  {
    title: 'Toggle-Field',
    figmaNode: '1630:585',
    tokens: [
      { part: 'Layout', figma: 'label + toggle (row)', code: 'label esquerda + Toggle direita', drift: false },
      { part: 'Toggle', figma: '51×31', code: 'atom Toggle', drift: false },
    ],
  },
  {
    title: 'Carousel Dots',
    figmaNode: '133:9766',
    tokens: [
      { part: 'Dot ativo', figma: '20×8 · pill', code: 'width 20 · pill', drift: false },
      { part: 'Dot inativo', figma: '8×8', code: '8×8', drift: false },
      { part: 'Cor', figma: 'branco (overlay imagem)', code: 'teal/cinza (light) + prop onMedia (branco)', drift: false, note: 'Figma é p/ overlay; adaptado p/ fundo claro' },
    ],
  },
];
