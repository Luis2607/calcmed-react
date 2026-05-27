export const INPUT_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Inputs',
  figmaNodeId: '127:3219', // Component Set "Input Field"
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

// Spec extraido ao vivo do Figma (Light · Modo Adulto) via Desktop Bridge.
export const INPUT_TOKEN_GROUPS = [
  {
    title: 'Mapeamento de Tamanho (Altura & Caixa)',
    description: 'Altura touch-target, padding, gap e radius da caixa do input contra o Figma.',
    tokens: [
      {
        size: 'Default',
        figmaHeight: '48px',
        figmaPaddingH: '16px',
        figmaGap: '12px',
        figmaRadius: '12px',
        figmaText: 'Value 16px Regular',
        codeHeight: '48px',
        codePaddingH: '16px (var(--esp-4))',
        codeText: '16px (var(--fonte-tamanho-input))',
      },
    ],
  },
  {
    title: 'Estados Visuais (variant State)',
    description: 'Os 7 estados do Component Set e como o código os representa. Filled e Disabled divergem.',
    tokens: [
      { state: 'Normal', codeState: 'default', figmaStroke: '1px #E2E8F0', figmaFill: '#FFFFFF', codeSpec: '1px var(--ds-borda-padrao)', drift: false },
      { state: 'Focus', codeState: 'default (:focus-within)', figmaStroke: '2px #007993', figmaFill: '#FFFFFF', codeSpec: '2px var(--ds-input-borda-foco)', drift: false },
      { state: 'Typing', codeState: 'default (:focus-within)', figmaStroke: '2px #007993', figmaFill: '#FFFFFF', codeSpec: 'coberto por :focus-within (== Focus)', drift: false },
      { state: 'Filled', codeState: 'filled (auto)', figmaStroke: '1px #E2E8F0', figmaFill: '#FFFFFF', codeSpec: '1px var(--ds-borda-padrao)', drift: false },
      { state: 'Error', codeState: 'error', figmaStroke: '2px #991B1B', figmaFill: '#FFFFFF', codeSpec: '2px var(--ds-input-borda-erro)', drift: false },
      { state: 'Success', codeState: 'sucesso', figmaStroke: '2px #047857', figmaFill: '#FFFFFF', codeSpec: '2px var(--ds-retorno-sucesso)', drift: false },
      { state: 'Disabled', codeState: 'disabled', figmaStroke: '1px #E2E8F0', figmaFill: '#F1F5F9', codeSpec: 'fill var(--ds-fundo-elevado) + 1px', drift: false },
    ],
  },
  {
    title: 'Anatomia & Tipografia',
    description: 'Cada parte do input contra o Figma. Tudo sincronizado.',
    tokens: [
      { part: 'Label', figma: '14px Medium · #475569', code: 'var(--fonte-tamanho-corpo) 500 · --ds-input-rotulo', drift: false },
      { part: 'Valor / Placeholder', figma: '16px Regular · placeholder #94A3B8', code: 'var(--fonte-tamanho-input) · --ds-input-placeholder', drift: false },
      { part: 'Unit suffix', figma: '14px Regular · #94A3B8', code: '14px · --ds-texto-terciario', drift: false },
      { part: 'Helper', figma: '12px Regular · #94A3B8', code: 'var(--fonte-tamanho-auxiliar) · terciario', drift: false },
      { part: 'Radius', figma: '12px', code: 'var(--radius-input)', drift: false },
      { part: 'Padding H', figma: '16px', code: 'var(--esp-4)', drift: false },
      { part: 'Gap', figma: '12px', code: 'var(--esp-3)', drift: false },
    ],
  },
  {
    title: 'Properties & Gaps (Figma vs Codigo)',
    description: 'Component properties do Figma e cobertura no codigo.',
    tokens: [
      { prop: 'Show label / Label text', figma: 'BOOLEAN + TEXT', code: 'prop label', drift: false },
      { prop: 'Show helper / Helper text', figma: 'BOOLEAN + TEXT', code: 'prop helperText', drift: false },
      { prop: 'Show Unit / Unit Text', figma: 'BOOLEAN + TEXT', code: 'props showUnit + unit', drift: false },
      { prop: 'Show left icon / Left icon', figma: 'BOOLEAN + INSTANCE_SWAP', code: 'prop leftIcon (atomo Icon)', drift: false },
      { prop: 'Show right icon / Right icon', figma: 'BOOLEAN + INSTANCE_SWAP', code: 'prop rightIcon (atomo Icon)', drift: false },
      { prop: 'Dark mode (variant)', figma: 'False/True', code: 'escopo .modo-escuro (tokens base remapeados, grounded no Figma)', drift: false },
      { prop: 'Modo (variant)', figma: 'Adulto/Pediatria', code: 'PARCIAL (radius global .modo-pediatrico)', drift: true, driftNote: 'Sem variante por-input.' },
    ],
  },
];
