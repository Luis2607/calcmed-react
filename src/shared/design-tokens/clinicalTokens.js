export const CLINICAL_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Componentes Clínicos (114:3750)',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

// Inventário completo da página (status real por componente).
export const CLINICAL_INVENTORY = [
  { comp: 'calc/section-label', node: '173:10833', variants: 4, code: 'atoms/SectionLabel (+ onInfo)', status: 'ok' },
  { comp: 'calc/dose-display', node: '173:10850', variants: 6, code: 'molecules/DoseDisplay (novo)', status: 'ok' },
  { comp: 'diluicao/divider-ou', node: '331:1558', variants: 4, code: 'molecules/DividerOu (novo)', status: 'ok' },
  { comp: 'diluicao/solucao-card', node: '327:102662', variants: 2, code: 'molecules/DisclosureCard (row → BottomSheet)', status: 'ok' },
  { comp: 'calc/checklist-block', node: '1895:67043', variants: 3, code: 'organisms/ChecklistBlock (novo)', status: 'ok' },
  { comp: 'calc/drug-card-vaso', node: '1965:33074', variants: 2, code: 'organisms/ClinicalCard (container composável) + composição', status: 'ok' },
  { comp: 'calc/score-result', node: '283:145619', variants: 6, code: 'molecules/ScoreResult (novo)', status: 'ok' },
  { comp: 'calc/score-range-table', node: '283:150321', variants: 2, code: 'molecules/ScoreRangeTable (novo)', status: 'ok' },
  { comp: 'calc/score-criterion-group', node: '2227:59924', variants: 6, code: 'organisms/ScoreCriterionGroup (acordeão · reusa Radio)', status: 'ok' },
  { comp: 'calc/score-actions', node: '2235:94802', variants: 2, code: 'organisms/ScoreActions (orquestra Button Secondary)', status: 'ok' },
  { comp: 'calc/score-criterion', node: '283:150286', variants: 56, code: 'organisms/ScoreCriterion (dispatcher · 6 tipos · reusa Checkbox/Radio/Segmented/Stepper)', status: 'ok' },
  { comp: 'overlay/success-sheet', node: '327:102680', variants: 2, code: 'coberto por sheets/* (verificar)', status: 'pendente' },
];

export const CLINICAL_TOKEN_GROUPS = [
  {
    title: 'calc/section-label',
    figmaNode: '173:10833',
    tokens: [
      { part: 'Label', figma: '11 Semi Bold uppercase · modo/secao-label', code: '--ds-texto-terciario (token difere)', drift: true, note: 'CC4 · Figma usa modo/secao-label; código usa texto-terciario' },
      { part: 'Show Info Button', figma: 'BOOLEAN · botão "?"', code: 'prop onInfo (aditivo)', drift: false },
      { part: 'Modo Adulto/Pediatria', figma: 'VARIANT', code: 'não diferenciado (sem efeito conhecido)', drift: true, note: 'CC4 · medir o que muda' },
    ],
  },
  {
    title: 'calc/dose-display',
    figmaNode: '173:10850',
    tokens: [
      { part: 'Valor', figma: '32 Bold · interativo/primario', code: '32/700 · --ds-interativo-primario', drift: false },
      { part: 'Unidade', figma: '20 Medium · interativo/primario', code: '20/500 · --ds-interativo-primario', drift: false },
      { part: 'Via', figma: '14 Regular · texto/terciario', code: '14/400 · --ds-texto-terciario', drift: false },
      { part: 'Tipo', figma: 'Range / Single / Conversor', code: "prop tipo (value como string)", drift: false },
    ],
  },
  {
    title: 'diluicao/divider-ou',
    figmaNode: '331:1558',
    tokens: [
      { part: 'Linha + Label', figma: 'linha + "OU" 14 Medium terciario · gap 12', code: 'flex linhas + label · esp-3', drift: false },
    ],
  },
  {
    title: 'DisclosureCard (base solucao-card · repositionado)',
    figmaNode: '327:102662',
    tokens: [
      { part: 'Card', figma: 'fundo/cartao · borda 1px rgba(0,0,0,.06) · r12 · pad16 · gap12', code: '--ds-fundo-cartao · borda rgba · --ds-r-md', drift: false },
      { part: 'Conteúdo', figma: '[ícone | título 16 + subtítulo 14 terciario | chevron]', code: 'leftIcon + text(title/subtitle) + chevron', drift: false },
      { part: 'Papel (Teoria)', figma: 'card de diluição estático', code: 'row tappável → abre BottomSheet (InfoSheet/DetailSheet)', drift: true, note: 'CC-DISC · repositionado p/ Teoria/referência (ledger)' },
    ],
  },
  {
    title: 'calc/checklist-block',
    figmaNode: '1895:67043',
    tokens: [
      { part: 'Card', figma: 'fundo/cartao · r12 · pad16 · gap12', code: '--ds-fundo-cartao · borda-sutil · --ds-r-md', drift: false },
      { part: 'Header', figma: 'Tag estado + Tag Count rose #F43F5E + subtitle 14 secundario', code: 'Tag + count badge + subtitle', drift: true, note: 'CC5 · count #F43F5E não tokenizado no Figma' },
      { part: 'Itens', figma: 'até 9 itens (Show Item 1-9) · checkbox + label', code: 'items[] · átomo Checkbox', drift: false, note: 'array em vez de 9 booleanos' },
    ],
  },
  {
    title: 'calc/score-result',
    figmaNode: '283:145619',
    tokens: [
      { part: 'Card', figma: 'tint por risco · borda · r12 · pad 16/20 · gap 12', code: 'risk baixo/moderado/alto · --ds-retorno-X-fundo/-borda', drift: false },
      { part: 'Valor + risco', figma: 'valor 32 Bold + "pontos" 14 + risco 16 (cor do retorno)', code: '32/700 + 14 secundario + 16 cor risco', drift: false },
      { part: 'Borda Moderado', figma: '#FDE68A (amber-200, sem token)', code: '--ds-retorno-atencao-borda (#FCD34D)', drift: true, note: 'micro-drift · Figma não tokenizou amber-200' },
    ],
  },
  {
    title: 'calc/score-range-table',
    figmaNode: '283:150321',
    tokens: [
      { part: 'Tabela', figma: 'card branco + borda elevado · r12 · header INTERPRETAÇÃO', code: '--ds-fundo-cartao + borda --ds-fundo-elevado', drift: false },
      { part: 'Linhas', figma: 'até 6 (Show Row 3-6) · pts 14 Bold + label 14 · linha 0 verde', code: 'rows[] · firstRow verde', drift: false, note: 'array em vez de Show Row N' },
    ],
  },
  {
    title: 'ClinicalCard (container · base drug-card-vaso, generalizado)',
    figmaNode: '1965:33074',
    tokens: [
      { part: 'Shell', figma: 'Ativa: borda teal 2px · Inativa: borda neutra 1px · r12 · pad16 · gap16', code: 'state default/ativo/inativo · --ds-interativo-primario 2px / borda-*', drift: false },
      { part: 'Header (props)', figma: 'tags + nome + instrução fixos no master', code: 'props tags[]/title/subtitle (= component properties)', drift: false, note: 'generalizado: configurável por prop' },
      { part: 'Body (children)', figma: 'conteúdo fixo do vaso (Input + 2 Alerts)', code: 'children livre: InputField, AlertCard, ChecklistBlock, RadioGroup, DoseDisplay…', drift: true, note: 'CC-CLIN · container agnóstico; vaso vira composição (ledger)' },
    ],
  },
  {
    title: 'calc/score-actions',
    figmaNode: '2235:94802',
    tokens: [
      { part: 'Row', figma: '2 botões Secondary MD lado a lado · gap 12', code: 'flex row · esp-3 · reusa átomo Button', drift: false },
      { part: 'Botões', figma: 'Copiar (left icon copiar) + Compartilhar (left icon compartilhar)', code: "actions[] default { Copiar, Compartilhar } · ícones do átomo Icon", drift: false },
      { part: 'Largura', figma: 'cada botão FIXED 165px (largura igual)', code: 'flex:1 (divide igual · responsivo)', drift: true, note: 'CC-SA · código usa flex:1 em vez de largura fixa' },
    ],
  },
  {
    title: 'calc/score-criterion-group',
    figmaNode: '2227:59924',
    tokens: [
      { part: 'Card', figma: 'r12 · borda cartao/borda → cartao/borda-selecionado (teal) quando Expanded', code: '--ds-cartao-borda → --ds-cartao-borda-selecionado (.expanded)', drift: false },
      { part: 'Header', figma: 'System Name 14 SemiBold + Selected Criterion 14 Regular secundario + pts-badge + chevron', code: 'systemName + criterionValue + ptsBadge + Icon dropdown/dropdown-up', drift: false },
      { part: 'pts-badge', figma: 'r12 · pad 4/8 · dominio/escores-fundo #ECFEFF · texto 11 SB dominio/escores-texto #0891B2', code: '--ds-tag-escores-fundo / --ds-tag-escores-texto (mesmos valores)', drift: false, note: 'dominio/escores-* (#ECFEFF/#0891B2) = --ds-tag-escores-* no código; difere do --ds-dominio-escores-* legado (#FFFBEB)' },
      { part: 'Opções', figma: 'até 10 (Show Option 1-10 · Label+Points) · indicador Box quadrado r4', code: 'options[] {label,points} · seleção única reusa átomo Radio (círculo)', drift: true, note: 'CC-SCG · array em vez de Show Option N; Radio (círculo, semântica single-select) em vez do Box quadrado do Figma' },
    ],
  },
  {
    title: 'calc/score-criterion',
    figmaNode: '283:150286',
    tokens: [
      { part: 'Dispatcher', figma: 'Type = Checkbox|Radio|Stepper|Numeric|Slider|Segmented (56 var)', code: "prop type despacha pro átomo/molécula DS", drift: false },
      { part: 'Checkbox/Radio', figma: 'linha pad12/16 gap12 · indicador 24px + label 16 + pts 11 terciario', code: 'reusa átomo Checkbox/Radio (sem label próprio) + label 16 + ptsBadge', drift: false },
      { part: 'Segmented', figma: 'header [label+pts] + segmented-control (tab = Label + Points)', code: 'reusa molécula Segmented · label montado como "Label  +pts"', drift: true, note: 'CC-SC1 · Segmented atual não tem slot de Points por tab; pontos concatenados no label' },
      { part: 'Numeric', figma: 'box r8 pad8/12 (Value 16 + Unit 14) · helper retorno/critico no Error', code: 'input compacto inline · --ds-input-* · helper --ds-retorno-critico', drift: true, note: 'CC-SC2 · box compacto próprio (não o InputField full 48h) p/ bater a anatomia do Figma' },
      { part: 'Stepper', figma: 'Minus/Plus 40px r12 fundo/elevado (sem borda) · Value 32 Bold', code: 'reusa molécula Stepper (botões redondos teal-outline · Value 18) + Unit', drift: true, note: 'CC-SC3 · molécula Stepper existente tem anatomia diferente (botão redondo/borda, value 18 vs 32 quadrado). Reuso > recriar; visual diverge do Figma' },
      { part: 'Slider', figma: 'track vazio cyan borda/foco · filled+thumb interativo/primario-ativo · thumb 20px', code: 'input range nativo estilizado · --ds-borda-foco / --ds-interativo-primario-ativo', drift: true, note: 'CC-SC4 · não há componente Slider no DS; range nativo estilizado a tokens (sem átomo dedicado)' },
    ],
  },
];
