> ⚠️ **DOC HISTÓRICO** — descreve uma fase anterior do protótipo (iframe golden / não-portado / pré-git). Hoje as 5 centrais são React nativo e tudo está versionado. Mantido como registro; **não usar como verdade atual** (ver `docs/00-index.md`).

# QA Report - 2026-05-26

Escopo validado: estabilizacao inicial da base React da Central de Urgencia, preservando o HTML como golden master + entrega das Fases 2-5 do plano de padronizacao do BottomSheet.

## Resultado

- `npm run lint`: passou sem erro.
- `npm run build`: passou sem erro.
- HTML golden master: 9 arquivos JS verificados com `node --check`, sem erro de sintaxe.
- QA visual mobile 390x844: hub, CAD, Sepse, PCR, AVC e SCA renderizam sem erro de console, sem overflow horizontal, sem tela vazia e sem controles fora do viewport.
- Persistencia CAD: idade, peso, HGT, acidose e cetose sobreviveram a refresh; CTA retornou `Confirmar Diagnostico (3/3)`.
- Correcao pos-feedback: Sepse, PCR, AVC e SCA deixaram de ser placeholders e passaram a renderizar o HTML validado dentro do React por ponte `/golden/...`.

## Preservado

- `../calcmed/` continua intacto como referencia funcional.
- CAD segue sendo a unica migracao funcional em React neste incremento.
- Sepse, PCR, AVC e SCA foram mapeados no React sem falsa migracao: aparecem no hub e carregam o HTML validado enquanto a componentizacao real nao fica pronta.
- Estado local do CAD continua em `localStorage`.
- Historico do CAD continua preservado em `cad_historico`.

## Corrigido neste QA

- Icone `ico-teoria` tinha path SVG invalido e gerava erro no navegador.
- Rota salva invalida podia deixar a tela sem conteudo; agora cai no hub.
- Cronometro do CAD podia mostrar tempo negativo na primeira renderizacao; agora inicia em `00:00`.
- Placeholder de protocolos foi removido para evitar perda visual contra o HTML validado.
- Vite agora serve `../calcmed/` em `/golden/...` durante desenvolvimento e preview local.

## Backlog Seguro

- Migrar Sepse por paridade completa.
- Migrar PCR por paridade completa.
- Migrar AVC por paridade completa.
- Migrar SCA por paridade completa.
- Extrair o header/stepper do CAD para componentes compartilhados antes de duplicar padrao em outros fluxos.
- Criar QA automatizado versionado para smoke visual e persistencia.

## BottomSheet — Fases 2-5 entregues (2026-05-26)

Plano de referencia: [bottom-sheet-standardization-plan.md](./bottom-sheet-standardization-plan.md).

### Fase 2 · Moleculas
`src/shared/components/molecules/sheet/`:
- `SheetHeader` (handle + leading icon + title + description + close · tones neutral/info/success/warning/critical)
- `SheetBody` (rolavel · gap padronizado · scrollbar 4px)
- `SheetFooter` (1 ou 2 botoes · `loading` controla disabled + label)
- `SheetSection` (subgrupo com titulo eyebrow)
- `SheetAlert` (alerta inline · 4 tones)
- `SheetOptionList` (radio group · selected check)

### Fase 3 · Organismo
`src/shared/components/overlays/BottomSheet/BottomSheet.jsx`:
- props: `open`, `onClose`, `title`, `description`, `leadingIcon`, `tone`, `closeOnBackdrop`, `closeOnEsc`, `showCloseButton`, `showHandle`, `footer`, `maxHeight` (auto/tall/full), `children`.
- Backdrop confinado ao viewport (`position:absolute; inset:0;` herda do prototipo HTML golden).
- Late unmount via `onTransitionEnd` + `wasOpen` (compativel com `react-hooks/set-state-in-effect`).
- ESC fecha quando `closeOnEsc`. Backdrop click fecha quando `closeOnBackdrop`.
- Foco inicial no sheet · foco devolvido ao trigger no unmount.
- `prefers-reduced-motion` desliga transitions.

### Fase 4 · Patterns
`src/shared/components/overlays/patterns/`:
- `InfoSheet` (footer obrigatorio com 1 acao · default `Entendi`)
- `SelectSheet` (modo `immediate` default · modo `confirm` com Cancelar + Aplicar)
- `ConfirmSheet` (modo `destructive` desliga `closeOnBackdrop` + variant `danger`)

### Fase 5 · Migracao piloto CAD
`src/features/cad/CADFlow.jsx`:
- Faixa de K (T2) deixou de ser 3 chips inline e virou trigger -> `SelectSheet` com 3 opcoes ricas (label + description clinico).
- Novo botao `?` ao lado de "Potassio Serico (K)" abre `InfoSheet` "Por que o K bloqueia a insulina?" (gate de seguranca CAD).
- Botao back (`<-`) do header agora abre `ConfirmSheet` "Sair do protocolo?" quando ha dados em andamento, em vez de sair direto.

### QA
- `npm run lint`: passou (1 erro `react-hooks/set-state-in-effect` corrigido refatorando para padrao oficial React — setState em render guarded + ref em effect).
- `npm run build`: passou em ~280ms · 57 modulos · bundle 230.75 kB.
- Golden master `../calcmed/` intacto — nenhum HTML alterado.

### Inventario de sheets (golden master · base p/ proximas fases)

| Origem (golden) | Tipo plano | Status |
|---|---|---|
| `cad.js:abrirConfirmacao({sair})` | ConfirmSheet | Migrado (CAD React) |
| `cad.js:modais['o-que-e-reavaliacao']` | InfoSheet | A migrar |
| `cad.js:modais['como-ajustar-insulina']` | InfoSheet | A migrar |
| `cad.js:abrirAnotacao()` (textarea + Salvar/Limpar) | FormSheet/AnnotationSheet | Aguarda Fase 5 (state) |
| `cad.js:modais` com `acao: resetar` | ConfirmSheet (destructive) | A migrar |
| Sepse/PCR/AVC/SCA | varios | Permanecem no golden via `/golden/...` ate paridade |

## BottomSheet - QA Codex final (2026-05-26)

Escopo: sistema de BottomSheet em React, sem migrar ainda os fluxos clinicos completos de Sepse/PCR/AVC/SCA.

### Componentizacao validada

- Organismo: `src/shared/components/overlays/BottomSheet/BottomSheet.jsx`.
- Moleculas: `SheetHeader`, `SheetBody`, `SheetFooter`, `SheetSection`, `SheetAlert`, `SheetOptionList`, `SheetTextarea`, `SheetText`, `SheetList`, `SheetMedia`, `SheetChecklistItem`, `SheetCalculationBlock`, `SheetActionItem`, `SheetDetailRow`.
- Patterns: `InfoSheet`, `SelectSheet`, `ConfirmSheet`, `FormSheet`, `ToolSheet`, `ActionSheet`, `ChecklistSheet`, `DetailSheet`.
- Galeria viva: `src/features/ds/SheetGallery.jsx`, acessivel por `http://127.0.0.1:5174/?qa=bottomsheets` durante o dev server.
- QA por protocolo dentro da galeria: CAD (8 sheets), SCA (10), Sepse (5), PCR (5), AVC (4).

### Ajustes feitos neste QA

- Focus trap confirmado e mantido: Tab/Shift+Tab permanecem dentro do dialog.
- Scroll lock confirmado em `.scroll-container` enquanto o sheet esta aberto.
- CSS critico de `BottomSheet` e `Sheet` ficou sem cor/px solto; medidas de componente foram movidas para tokens em `tokens.css`.
- `ChecklistSheet` ficou robusto para itens com `id`, `value` ou apenas `label`.
- Microcopy da galeria principal foi revisada para pt-BR com acentos corretos.

### Provas executadas

- `npm run lint`: passou.
- `npm run build`: passou.
- Golden master HTML: 9 arquivos JS verificados com `node --check`.
- Browser QA mobile 390x844: 8 patterns principais abrem, fecham via ESC, mantem foco preso, usam footer fixo quando aplicavel e travam scroll de fundo.
- `SelectSheet` modo immediate: selecionar opcao fecha o sheet.
- `ConfirmSheet` destructive: clique no backdrop nao fecha.
- `FormSheet`: textarea presente e salvar desabilitado quando vazio.
- `ChecklistSheet`: toggle validado por `aria-checked`.
- QA por protocolo: 32 launchers em `ds-sheets` abriram e fecharam sem erro.
- Console do navegador: sem erros.

### Consistencia entre protocolos

- `AnnotationSheet` criado como pattern unico para anotacao livre de caso.
- CAD, Sepse, PCR, AVC e SCA usam a mesma anotacao: titulo `Anotação`, helper `Opcional · salva no histórico deste aparelho`, label `OBSERVAÇÕES`, placeholder `Evolução, condutas, intercorrências...`, limite `500`, footer `Cancelar` + `Salvar`.
- Smoke visual/interativo: 32 sheets de protocolo abriram/fecharam, mantiveram titulo `18px/24px`, footer fixo e sem erros de console.

### Backlog seguro do sistema de sheets

- Variante `floating/inset` pode ser adicionada depois como opt-in no organismo, sem mudar o default edge-to-edge validado.
- Migrar os sheets reais dos protocolos por paridade, com CAD primeiro: anotacao -> `FormSheet`, reavaliacao/insulina -> `InfoSheet`, resetar/sair -> `ConfirmSheet`, historico -> `DetailSheet`.

## DS Colors - QA viva criada (2026-05-26)

Escopo: pagina isolada de auditoria visual de cores, sem alterar tokens existentes nem telas reais do produto.

- Rota: `http://127.0.0.1:5174/?qa=colors`.
- Fonte Figma: arquivo DS `zcLBv8e2kQsrsRko9FIrbZ`, pagina `Cores`.
- Estrutura espelhada: Primitivos, Tokens Semanticos, Cores de Dominio, Tokens de Componentes e Modo Adulto/Pediatria.
- A pagina compara o valor Light do Figma com o alias CSS `--ds-*` resolvido no React e marca cada token como sincronizado, divergente ou faltando no codigo.
- Objetivo: transformar drift Figma <-> codigo em pendencia visivel antes de qualquer alteracao nos fluxos clinicos.
- Dados da QA foram separados em `src/shared/design-tokens/colorTokens.js`, deixando `ColorGallery.jsx` como camada de render/auditoria. Isso prepara sync futuro Figma -> registry -> CSS sem reescrever a pagina.

## DS Typography - QA viva criada (2026-05-26)

Escopo: pagina isolada de auditoria visual e computada de estilos de texto, sem alterar fontes reais de producao.

- Rota: `http://127.0.0.1:5174/?qa=typography`.
- Fonte Figma: arquivo DS `zcLBv8e2kQsrsRko9FIrbZ`, pagina `Tipografia`.
- Estrutura espelhada: Titulos, Corpo, Formularios, Botoes, Alertas, Modo PCR.
- Funcionamento: A pagina monta elementos invisiveis no DOM, aplica o shorthand `font: var(--ds-font-*)` e extrai dinamicamente o valor computado final do browser (`fontSize`, `fontWeight`, `lineHeight`) comparando com o Figma e apontando drifts ou faltas de forma exata.
- Registry de dados: criado de forma modular e limpa em `src/shared/design-tokens/typographyTokens.js`.

## DS Spacing & Radius - QA viva criada (2026-05-26)

Escopo: pagina isolada de auditoria computada da escala de espaçamento base-4 e cantos arredondados (radius).

- Rota: `http://127.0.0.1:5174/?qa=spacing`.
- Fonte Figma: arquivo DS `zcLBv8e2kQsrsRko9FIrbZ`, pagina `Espacamento`.
- Estrutura espelhada: Escala de Espacamento (4px-base) e Raios de Borda (Radius).
- Funcionamento: Compara o espaçamento Figma com o valor computado resolvido no browser aplicando a variavel `--ds-espaco-*` e `--ds-r-*` (ex: `16px` para `--ds-espaco-4`), indicando conformidade total e drifts.
- Registry de dados: criado de forma modular em `src/shared/design-tokens/spacingTokens.js`.

## DS Dashboard - Portal de QA Unificado (2026-05-26)

Escopo: painel web de controle unificado (dashboard) para centralizar a navegacao entre as 4 galerias de Design System do CalcMed.

- Rota: Qualquer URL parametrizada com `?qa` (ex: `?qa=colors`, `?qa=typography`, `?qa=spacing`, `?qa=bottomsheets` ou `?qa=hub`).
- Estrutura Visual: Sidebar na esquerda com layout web fixo (260px) contendo branding do CalcMed, lista de abas interativas, status/badge de desenvolvimento e footer de versao. Area de conteudo na direita com rolagem independente responsiva.
- Funcionamento: Ao detectar `?qa` ativo na URL, a visualizacao clinica centralizada em 390px mobile e interceptada, renderizando o `<DsDashboard />` em tela cheia desktop-first. As trocas de abas alteram a URL dinamicamente via `window.history.pushState` sem recarregar a pagina, provendo navegacao instantanea e fluida.
- Responsividade: Layout flexivel que se rearranja para modo coluna superior horizontal em telas menores que 768px (viewport mobile de testes).

## DS Icons - QA viva criada (2026-05-26)

Escopo: página isolada de auditoria de ativos de ícones, mapeando conformidade contra a biblioteca Figma oficial.

- Rota: `http://127.0.0.1:5174/?qa=icons`.
- Fonte Figma: arquivo DS `zcLBv8e2kQsrsRko9FIrbZ`, página `Ícones`.
- Mapeamento: Criado o registry de tokens `iconsTokens.js` no React contendo o mapeamento de todos os 89 componentes de ícones da biblioteca Figma e seus respectivos IDs.
- Centralização de Componente: Implementado o átomo central de ícone `<Icon name="..." />` em `src/shared/components/atoms/Icon/`. Ele atua como dicionário centralizado de SVG vectors para o React.
- Diagnóstico de Drift: A galeria viva renderiza todos os 89 ícones sequencialmente por grupo (App Bar, Clínicos, Feedbacks, etc.). Se um ícone não tiver seu SVG codificado no React ainda, a galeria renderiza o vetor fallback de auditoria em cinza com a tag "Pendente no código", acusando o drift exato de ativos.

## DS Buttons - 100% Sincronizado e Calibrado (2026-05-26)

Escopo: alinhamento cirúrgico de botões React com as especificações microscópicas do Figma e introdução do novo componente circular `IconButton`.

- **Rota:** `http://127.0.0.1:5174/?qa=buttons`.
- **Fonte Figma:** arquivo DS `zcLBv8e2kQsrsRko9FIrbZ`, página `Botões`.
- **Resolução de Drift de Alturas (Drift Metric = 0px):**
  - Tamanho **SM**: Figma `32px` | React `32px` (Sincronizado)
  - Tamanho **MD**: Figma `44px` | React `44px` (Sincronizado via CSS padding 0 24px)
  - Tamanho **LG**: Figma `56px` | React `56px` (Sincronizado via CSS padding 0 24px)
  *Todos os botões agora exibem o badge verde "SINCRONIZADO" na galeria viva, garantindo conformidade absoluta.*
- **Refatoração com forwardRef:** O componente `<Button />` foi refatorado para envolver `React.forwardRef`, eliminando avisos de ciclo de vida e permitindo que o auditor de QA use `getBoundingClientRect()` com precisão em refs diretas do DOM.
- **Component Properties & Slots Playground:** Adicionado suporte para propriedades de ícone (`leftIcon`, `rightIcon`, `showLeftIcon`, `showRightIcon`) que espelham perfeitamente o comportamento do Figma, com um painel interativo de testes em tempo real no dashboard.
- **Componente Circular `<IconButton />` (Fase 1B):**
  - Implementado átomo circular para botões de ícone único (sempre `border-radius: 100px` circular).
  - Escala oficial implementada: **SM** (36x36px com ícone de 16px) e **MD** (48x48px com ícone de 20px).
  - Suporta todas as 6 variantes (`primary`, `secondary`, `danger`, `ghost`, `discrete`, `text`) e override explícito de `darkMode`.
- **Garantia de Qualidade:**
  - `npm run lint`: 0 erros, 0 warnings.
  - `npm run build`: built in 366ms (passing).
  - Verificação de regressão visual: layouts e espaçamentos internos de ícones testados com `gap: var(--esp-2)` (8px) e `gap: var(--esp-3)` (12px) de forma 100% retrocompatível.

