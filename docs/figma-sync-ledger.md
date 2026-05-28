# Ledger de Sincronização Código → Figma

> **Propósito:** registro único e acionável de **tudo que o código faz DIFERENTE ou A MAIS** que o
> Figma. Um prompt futuro deve conseguir ler este arquivo e **ajustar o Figma** item a item.
>
> **Figma alvo:** `zcLBv8e2kQsrsRko9FIrbZ` (Design System).
> **Distinção de docs:**
> - `ds-issues-figma.md` = problemas de modelagem **do próprio Figma** (corrigir no Figma, independente do código).
> - `figma-sync-ledger.md` (este) = divergências/adições **introduzidas no código** que precisam ser **portadas pro Figma**.

## Como ler cada entrada

| Campo | Significado |
|---|---|
| **Componente** | nome no código + nó Figma correspondente (ou "NÃO EXISTE no Figma") |
| **Tipo** | `NOVO` (não existe no Figma) · `MUDADO` (existe, mas código diverge de propósito) · `ESTENDIDO` (existe, código adiciona algo) |
| **O que no código** | o estado atual no protótipo React |
| **O que no Figma** | o estado atual no Figma (ou ausência) |
| **Ação no Figma** | instrução literal pro prompt futuro executar no Figma |
| **Motivo** | por que divergimos (decisão de produto/UX/urgência) |
| **Status** | `aberto` (esperando sync) · `sincronizado` |

---

## Alertas

### A1 · Toast/Snackbar — ação "Desfazer" (ESTENDIDO)
- **Componente:** `molecules/Toast` ↔ Figma `Alert Compact` (131:4093).
- **O que no código:** prop `onUndo` renderiza botão "Desfazer" (text button teal) à direita, antes do dismiss.
- **O que no Figma:** Alert Compact só tem `Show dismiss` (X). Não há slot de ação.
- **Ação no Figma:** adicionar property `Show action` (BOOLEAN) + slot de texto "Action label" ao Alert Compact 131:4093; ação alinhada à direita, cor `interativo/primario`, peso Bold.
- **Motivo:** padrão snackbar (Material) p/ reverter operações em Urgência (ex.: "Evento removido · Desfazer").
- **Status:** aberto

### A2 · Alert Card — layout horizontal mantido (MUDADO, deliberado)
- **Componente:** `organisms/AlertCard` ↔ Figma `Alert Card` (130:4043).
- **O que no código:** layout horizontal `[ícone | coluna(título, corpo)]`.
- **O que no Figma:** vertical `Header[ícone+título] / Value / Body full-width`.
- **Ação no Figma:** decidir — ou aceitar horizontal como novo padrão (re-layout do master), ou marcar código como débito p/ adotar vertical. NÃO sincronizar sem decisão.
- **Motivo:** horizontal é padrão de alerta consagrado, menor risco; vertical é fidelidade pura.
- **Status:** aberto (decisão pendente — ver `ds-issues-figma.md` item 6)

---

## Tags e Chips

### TC1 · Tag Domain — cores divergem do `--ds-dominio-*` legado (MUDADO / débito)
- **Componente:** `molecules/Tag` (variant domain) ↔ Figma `Tag Domain` (128:3744).
- **O que no código:** o Tag usa tokens NOVOS `--ds-tag-{dominio}-fundo/-texto` com os valores
  REAIS do Figma (tint-bg + texto colorido — ex.: urgências #FFF1F2 / #E11D48).
- **O que no Figma:** `dominio/*` = tint-bg + texto colorido (correto, é a fonte).
- **Conflito interno:** o token legado `--ds-dominio-*` (usado por cards/home) usa OUTRO modelo
  (solid-bg escuro + texto branco, ex.: urgências #991B1B) — drift 0/18 conhecido (ver index.md).
- **Ação no Figma:** nenhuma (Figma está certo). **Ação no CÓDIGO (futuro):** reconciliar
  `--ds-dominio-*` legado → valores Figma e migrar cards/home; depois fundir com `--ds-tag-*`.
- **Motivo de não fazer agora:** mudar `--ds-dominio-*` impacta cards/home (regressão). Tag isolado em token novo = zero regressão.
- **Status:** aberto (débito de código, não de Figma)

### TC2 · Tag Status "Crítico"/"Alerta" — fill não tokenizado no Figma (NOVO no Figma)
- **Componente:** `Tag` tone critico/alerta ↔ Figma `Tag Status` (128:3769).
- **O que no código:** `--ds-tag-critico-fundo: #DC2626` e `--ds-tag-alerta-fundo: #F59E0B` (valores do Figma).
- **O que no Figma:** esses dois variants têm `fills` com **hex cru (fillVar = null)** — não há variável.
- **Ação no Figma:** criar variáveis (ex.: `feedback/critico-vivo #DC2626`, `feedback/alerta-vivo #F59E0B`) e bindar nesses variants.
- **Motivo:** consistência de token; hoje só existe no código.
- **Status:** aberto

### TC3 · Tag Abbr — construído no código; fills NÃO tokenizados no Figma (NOVO no Figma)
- **Componente:** `Tag` variant="abbr" (145:33146) — h36, r8, 18 Semi Bold, abreviações (ex.: "IOT").
- **O que no código:** CONSTRUÍDO. 6 tones de domínio via `--ds-tag-abbr-{dominio}-fundo/-texto`
  (fundo = cor a 12%, texto sólido). Valores REAIS do Figma.
- **O que no Figma:** as 6 variants têm fill+texto com **hex cru (fillVar null)** — nenhuma variável.
- **Ação no Figma:** criar 6 variáveis de cor (urgências #FA7087, diluições #61A6FA, calculadoras
  #FA913D, protocolos #BF85FC, escores #21D4ED, conversores #808CF7) e bindar fill(12%)+texto.
- **Status:** aberto (código pronto; falta tokenizar no Figma)

## Componentes Clínicos

### CC1 · DoseDisplay — componente novo (inline, ≠ ResultDisplay)
- **Componente:** `molecules/DoseDisplay` ↔ Figma `calc/dose-display` (173:10850).
- **O que no código:** valor 32 Bold teal + unidade 20 Medium teal + via 14 Regular terciario, inline (sem card). Tipo single/range/conversor.
- **No Figma:** idem (fonte). Sem divergência — só construído no código.
- **Ação no Figma:** nenhuma. **Nota:** NÃO confundir com `ResultDisplay` (card com level success/warning/critical).
- **Status:** sincronizado (código alinhado ao Figma)

### CC2 · DividerOu — componente novo
- **Componente:** `molecules/DividerOu` ↔ Figma `diluicao/divider-ou` (331:1558).
- **O que no código:** linha + label central "OU" (14 Medium terciario), gap 12. Alinhado ao Figma.
- **Status:** sincronizado

### CC3 · SectionLabel — estendido com info button (ESTENDIDO)
- **Componente:** `atoms/SectionLabel` ↔ Figma `calc/section-label` (173:10833).
- **O que no código:** prop `onInfo` adiciona botão "?" (aditivo; sem onInfo = comportamento antigo).
- **No Figma:** property `Show Info Button` JÁ existe. Código alinhado.
- **Status:** sincronizado

### CC4 · SectionLabel — token de cor e Modo divergem (MUDADO / a verificar)
- **Componente:** `atoms/SectionLabel`.
- **O que no código:** cor `--ds-texto-terciario`. **No Figma:** `modo/secao-label`.
- **Modo Adulto/Pediatria:** Figma tem a variante; código não diferencia (efeito desconhecido).
- **Ação no Figma:** confirmar valor de `modo/secao-label` e o que o Modo muda; alinhar código.
- **Status:** aberto

### CC5 · ChecklistBlock — contador "0/4" não tokenizado no Figma (NOVO no Figma)
- **Componente:** `organisms/ChecklistBlock` (count badge) ↔ Figma `Tag Count` rose dentro do checklist.
- **O que no código:** count badge `#F43F5E` (literal · rose/500).
- **O que no Figma:** fill rose #F43F5E sem variável.
- **Ação no Figma:** tokenizar (ex.: `feedback/contador #F43F5E`).
- **Status:** aberto

### CC6 · MT-H (Alert Card Show Value) — IMPLEMENTADO (uso real no DrugCardVaso)
- **Componente:** `organisms/AlertCard` props `showValue/value/unit`.
- **O que no código:** Dose 32 Bold + Unit 20 Medium, cor herdada do level. Default `showValue=false` (zero regressão nos 7 alertas CAD).
- **No Figma:** property `Show Value` já existe. Código alinhado.
- **Status:** sincronizado (antes deferido; reativado por DrugCardVaso usar 2 alertas com Dose).

### CC-CLIN · drug-card-vaso → `ClinicalCard` (container composável) (MUDADO · arquitetura)
- **Componente:** Figma `calc/drug-card-vaso` (1965:33074) era um card específico (vaso) com conteúdo fixo.
- **O que no código:** generalizado em `organisms/ClinicalCard` — shell + header (tags/title/subtitle = props) + **children livre**. O "vaso" virou uma composição (Tag + InputField + 2 AlertCards) montada pelo consumidor.
- **Ação no Figma:** considerar transformar `drug-card-vaso` num **container** com slots/instance-swap (header tags como component property; corpo como slot) em vez de card fixo. Permite reuso p/ conduta, diluição, score, etc.
- **Motivo:** escalabilidade — 1 container serve N condutas em vez de 1 componente por droga.
- **Status:** aberto (decisão de arquitetura no Figma)

### CC-DISC · solucao-card → `DisclosureCard` (row → BottomSheet) (MUDADO · papel)
- **Componente:** Figma `diluicao/solucao-card` (327:102662) era card de diluição estático.
- **O que no código:** `molecules/DisclosureCard` — row tappável (título + subtítulo + chevron) que **abre um BottomSheet** (InfoSheet/DetailSheet) com o conteúdo. Papel = Teoria / referência / "saiba mais".
- **Ação no Figma:** repositionar o componente como "disclosure row" (genérico), documentar que o chevron significa "abre detalhe em sheet". Hoje no Figma o nome/uso sugere só diluição.
- **Motivo:** o papel real é navegação p/ conteúdo (Teoria), não um card de solução específico.
- **Status:** aberto (rename/reposição no Figma)

### CC7 · InfoButton recorrente + contador à direita no ChecklistBlock (NOVO/ESTENDIDO)
- **Componente:** `atoms/InfoButton` (novo, "?") + `organisms/ChecklistBlock`.
- **O que no código:** extraí `InfoButton` como átomo reutilizável (SectionLabel + ChecklistBlock e futuros headers clínicos). No ChecklistBlock o header virou `space-between` → contador "0/4" alinhado à **direita** + `InfoButton` (prop onInfo) no cluster direito.
- **O que no Figma:** checklist-block (1895:67043) tem Tag + Tag Count juntos à esquerda, **sem info button**.
- **Ação no Figma:** (1) criar componente `Info Button` ("?") reutilizável; (2) no checklist-block, mover o contador pra direita (space-between) e adicionar property `Show Info Button`.
- **Motivo:** o "?" (abrir teoria/explicação) é recorrente em headers clínicos; e o contador à direita respira melhor.
- **Status:** aberto

### CC-PENDENTE · Subsistema Score (slice 3)
- `calc/score-result` (283:145619), `calc/score-range-table` (283:150321): construídos (slice anterior).
- `calc/score-criterion-group` (2227:59924), `calc/score-actions` (2235:94802), `calc/score-criterion` (283:150286 · 56 var): construídos abaixo (CC-SA / CC-SCG / CC-SC*).
- **overlay/success-sheet** (327:102680): verificar se já coberto por `overlays/patterns/*` (pendente).

### CC-SA · ScoreActions — componente novo (orquestra Button)
- **Componente:** `organisms/ScoreActions` ↔ Figma `calc/score-actions` (2235:94802 · 2 var = Dark).
- **O que no código:** linha (flex gap 12) de botões reusando o átomo `Button` variant Secondary MD com left icon. Default = Copiar (ícone `copiar`) + Compartilhar (ícone `compartilhar`); generalizável via `actions[]`.
- **No Figma:** 2 botões Secondary fixos (largura FIXED 165 cada). Código usa `flex:1` (divide igual, responsivo).
- **Ação no Figma:** nenhuma obrigatória; considerar `actions` como slot se houver mais variações.
- **Status:** sincronizado (anatomia alinhada; só largura fixa → flex)

### CC-SCG · ScoreCriterionGroup — componente novo (acordeão)
- **Componente:** `organisms/ScoreCriterionGroup` ↔ Figma `calc/score-criterion-group` (2227:59924 · 6 var = State × Dark).
- **O que no código:** card r12 borda neutra → teal (`--ds-cartao-borda-selecionado`) quando `expanded`; header (systemName 14 SB + selected criterion 14 + pts-badge + chevron) + lista de opções em seleção única reusando o átomo **Radio**.
- **Divergências:**
  - **Opções como array** `options:[{label,points}]` em vez dos 33 props `Show Option N`/`Option N Label`/`Option N Points` do Figma. Mais escalável.
  - **Indicador Radio (círculo)** em vez do `Box` quadrado (r4) que o Figma desenha na opção. Escolha semântica: seleção é ÚNICA → Radio é o átomo correto. Visual diverge (círculo vs quadrado).
  - **pts-badge:** Figma usa `dominio/escores-fundo` #ECFEFF + `dominio/escores-texto` #0891B2 — no código esses valores existem como `--ds-tag-escores-fundo`/`--ds-tag-escores-texto` (o `--ds-dominio-escores-*` legado é #FFFBEB, diferente). Usei os tag-escores p/ bater o pixel.
- **Ação no Figma:** alinhar o token do badge (`dominio/escores-*` vs família `tag/escores`); decidir se a opção deveria ser radio (círculo) já que é single-select.
- **Status:** aberto (decisões de token/semântica no Figma)

### CC-SC* · ScoreCriterion — componente novo (dispatcher mega · 6 tipos)
- **Componente:** `organisms/ScoreCriterion` ↔ Figma `calc/score-criterion` (283:150286 · 56 var = Type × State × Dark × Has image × Options).
- **O que no código:** prop `type` despacha pro átomo/molécula DS. Os 6 tipos foram construídos:
  - **Checkbox / Radio:** reusam os átomos `Checkbox`/`Radio` (sem label próprio) + criterion-label 16 + pts-badge. `Has image` → image-slot 179h. Estados Inactive/Active/Disabled. (alinhado)
  - **CC-SC1 · Segmented:** reusa a molécula `Segmented`. O Segmented atual não tem slot de Points por tab → os pontos são concatenados no label (`"Alerta  +0"`). Ação Figma/código: adicionar slot de pontos ao Segmented se virar padrão.
  - **CC-SC2 · Numeric:** box compacto próprio (r8, pad 8/12, Value 16 + Unit 14, helper de erro `--ds-retorno-critico`) — NÃO o `InputField` full (48h) — pra bater a anatomia compacta do Figma. Estado Error tokenizado.
  - **CC-SC3 · Stepper:** reusa a molécula `Stepper` existente, que tem anatomia diferente do Figma (botões redondos com borda teal + value 18, vs Minus/Plus 40px quadrados r12 `fundo/elevado` + value 32 Bold no Figma). Decisão reuso > recriar; **visual diverge**. Ação Figma: alinhar a anatomia do Stepper (qual é a canônica do DS?).
  - **CC-SC4 · Slider:** NÃO existe componente Slider no DS → `input[type=range]` nativo estilizado a tokens (track vazio `--ds-borda-foco` cyan, filled+thumb `--ds-interativo-primario-ativo`, thumb 20px). Ação Figma/código: criar átomo `Slider` dedicado se recorrente.
- **Status:** aberto (CC-SC1..4 com divergências documentadas; Checkbox/Radio sincronizados)

## Central de Urgência (kit) — CODE-FIRST (construído no código → portar pro Figma)

> Estes NÃO foram aterrissados no Figma (decisão Luis: construir aqui a partir dos prints, sincronizar
> depois). Cada um é referência visual = print do app. Ver `docs/kit-central-urgencia.md`. QA em `?qa=urgencia`.

### K2 · StepItem (átomo novo) + ProtocolSteps recomposto (NOVO no Figma)
- **Componente:** `atoms/StepItem` (extraído de `molecules/ProtocolSteps`).
- **O que no código:** átomo de passo (círculo 24 + label) com estados `pending`/`active`/`completed` (+hover/disabled). `ProtocolSteps` agora COMPÕE StepItem (aceita N=4..7). Visual idêntico ao anterior (CSS movido verbatim).
- **Ação no Figma:** criar componente átomo `Step Item` com variant State (pending/active/completed) + hover; `ProtocolSteps` vira instância repetida dele.
- **Status:** aberto

Atualização 2026-05-27: SCA usa `activePresentation="capsule"` no `ProtocolSteps` para bater com o protótipo antigo (container tint envolvendo o passo ativo). Portar essa property/variant para Figma.

### K1 · ProtocolHeader + Show Steps + variante por doença (ESTENDIDO)
- **Componente:** `organisms/ProtocolHeader`.
- **O que no código:** props novas `steps`/`currentStep`/`onStepClick` embutem o `ProtocolSteps` dentro do header (divisor superior, colado às bordas). Prop `domain` ('sca'|'pcr'|'cad'|'sepse'|'avc') aplica `data-domain` (hook de acento por doença — SEM cor forçada ainda).
- **Ação no Figma:** adicionar property booleana `Show Steps` ao header de protocolo; definir o acento/cor por doença (mapeamento doença→cor a decidir).
- **Status:** aberto (mapeamento de cor por doença pendente de decisão)

### K5 · ActionFooter — barra fixa acima da navbar (NOVO no Figma)
- **Componente:** `organisms/ActionFooter`.
- **O que no código:** barra de ações para rodapé operacional, com `hint` opcional em cima,
  `meta` à direita (ex.: `T+04:10`) e `primary`/`secondary`/`actions[]`. Pode ser `sticky`.
- **O que no Figma:** precisa virar componente próprio porque hoje aparece como layout de tela,
  não como componente do DS.
- **Ação no Figma:** criar `protocol/action-footer` com properties `Show Hint`, `Hint`, `Meta`,
  `Primary Label`, `Secondary Label`, `Primary Variant`, `Secondary Variant`.
- **Status:** aberto (código pronto; falta portar pro Figma)

### K6 · TabBar — navbar inferior de protocolo (NOVO no Figma)
- **Componente:** `molecules/TabBar`.
- **O que no código:** tabs inferiores com ícone, label, estado ativo e badge opcional. Aceita N itens
  via `items[]` (ex.: Executar / Histórico / Teoria).
- **O que no Figma:** precisa decidir se substitui/estende `nav/tab-bar` existente ou vira variante
  específica de protocolo.
- **Ação no Figma:** criar/estender `nav/tab-bar` com `Active Item`, `Show Badge`, `Mode=protocol`.
- **Status:** aberto

### K7 · Timeline — linha do tempo de eventos (NOVO no Figma)
- **Componente:** `organisms/Timeline`.
- **O que no código:** lista cronológica com rail/dot, `time`, `title`, `description`, `meta`,
  `statusLabel` e tons info/success/warning/critical.
- **O que no Figma:** ainda não aterrissado; deve cobrir histórico de PCR/eventos e log de CAD.
- **Ação no Figma:** criar `timeline/event-item` e `timeline/list`; variants por Status.
- **Status:** aberto

### K8 · PatientDetail — caso aberto em blocos (NOVO no Figma)
- **Componente:** `organisms/PatientDetail`.
- **O que no código:** header com iniciais + protocolo + status, cards de resumo e blocos `sections[]`
  com linhas label/valor. Pensado para tela/sheet de caso aberto no Histórico.
- **O que no Figma:** substituir detalhes soltos por um bloco canônico de histórico.
- **Ação no Figma:** criar `history/patient-detail` com slots para Summary e Sections; decidir se
  vive dentro de `DetailSheet` ou tela cheia.
- **Status:** aberto

### K3 · TimerCard (NOVO no Figma)
- **Componente:** `organisms/TimerCard`.
- **O que no código:** card de cronômetro clínico code-first com `label`, `value`, `description`, `tone`, `meta` e slot de ações. Aplicado no SCA como Porta-ECG; deve ser reaproveitado/adaptado para compressões e adrenalina no PCR.
- **Ação no Figma:** criar Component Set `TimerCard` com tones `primary/warning/critical` e properties `label/value/description/meta/actions`. Usar como base para PCR.
- **Status:** parcial (SCA aplicado; PCR ainda pendente)

### K4 · ActionTile
- Ainda pendente. Deve ser aterrissado em PCR antes de construir porque carrega regras clínicas
  (ritmo/desfibrilar).

### K1-update · ProtocolHeader refinado para SCA
- **Componente:** `organisms/ProtocolHeader`.
- **O que no código:** props opcionais `showStatusDot` e `showTimerIcon`; variante `timerVariant="stacked"` com padding maior, ações 44px e cronômetro no token `--ds-font-crono-card`.
- **Ação no Figma:** portar como component properties no header de protocolo.
- **Status:** aberto

---

## Sepse port 2026-05-28 (port golden → React · sessão completa)

> Bloco de 11 mudanças no DS introduzidas durante o port da Sepse (commits
> a898dde · f66fc34 · fdb9961 · ee328cd · 765f51e · 1d94b05 · 70691b5).
> Cada item precisa virar microtask Figma quando o time de DS atualizar a library.

### S1 · AlertCard — layout VERTICAL (CORREÇÃO · fecha task #16 deferida MT-E)
- **Componente:** `organisms/AlertCard` ↔ Figma `Alert Card 130:4043`.
- **O que no código (antes):** layout horizontal `[ícone | coluna(título, body)]`. Body herdava indent do row → perda de largura útil em 390px.
- **O que no código (agora):** layout vertical `topRow [Ícone + Título] + body sem indent`. Padding 16 uniforme, gap `--esp-2`.
- **O que no Figma:** já era vertical (anatomia correta) — o drift era SÓ no React.
- **Ação no Figma:** ✅ **nenhuma** (Figma estava certo; código se alinhou).
- **Substitui:** entrada A2 do ledger original ("layout horizontal mantido") → resolvida.
- **Status:** sincronizado

### S2 · AnnotationSheet — prop `onClear` (ESTENDIDO · DS.1 aprovado por Luis)
- **Componente:** `overlays/patterns/AnnotationSheet` ↔ Figma (sem cset dedicado — pattern).
- **O que no código:** quando `onClear` é passada, renderiza botão secundário **"Limpar"** (variant=fantasma) que zera o textarea SEM fechar o sheet. Sem `onClear`: comportamento atual preservado (só Salvar).
- **O que no Figma:** AnnotationSheet só tem Salvar + Cancelar.
- **Ação no Figma:** adicionar variante "Com limpar" (3 botões: Limpar fantasma · Salvar primary · close via X).
- **Motivo:** golden Sepse `limparAnotacao` zera texto sem fechar (apoio à memória do plantonista).
- **Status:** aberto

### S3 · HistoryView — prop `onCaseClick` (ESTENDIDO · DS.2 aprovado por Luis)
- **Componente:** `organisms/HistoryView` ↔ Figma (sem cset dedicado).
- **O que no código:** quando `onCaseClick(case)` é passada, cada card vira `<button>` clivável (`.cardButton` reset visual + focus-visible). Sem ela: `<div>` estático.
- **O que no Figma:** não modelado.
- **Ação no Figma:** criar `history/case-card` com property "Interactive" (boolean) — quando true, hover/focus visíveis.
- **Status:** aberto

### S4 · ClinicalCard — prop `onInfo` (ESTENDIDO)
- **Componente:** `organisms/ClinicalCard` ↔ Figma `calc/drug-card-vaso 1965:33074` (base).
- **O que no código:** prop `onInfo` opcional → renderiza `<InfoButton/>` no canto superior direito do header, alinhado com o título via `.titleRow` flex row justify=space-between.
- **O que no Figma:** drug-card-vaso golden tem ícone no canto superior direito (cronômetro/info), mas React anterior não usava.
- **Ação no Figma:** adicionar property "Show info" (boolean) + slot fixo no canto superior direito do header (mesma posição do cronômetro de drug-card).
- **Status:** aberto

### S5 · ScoreCriterionGroup — `binary` + `alwaysOpen` + `optionsLayout=horizontal` (ESTENDIDO · 3 props)
- **Componente:** `organisms/ScoreCriterionGroup` ↔ Figma `calc/score-criterion-group 2227:59924`.
- **O que no código (3 modos novos):**
  - **`binary`** (bool) + `binaryChecked` + `onBinaryChange` + `points`: anatomia muda pra `<label>` + header com Checkbox + badge no rightCol (sem body, sem chevron). SIRS, NEWS O₂ suplementar.
  - **`alwaysOpen`** (bool): força conteúdo aberto, esconde chevron, header vira div não-clickable. Replica golden `shouldBeOpenByDefault` (critérios com 2-3 opções).
  - **`optionsLayout`: 'vertical'|'horizontal'**: layout do `.list`. Em `horizontal`, opções viram cards lado a lado em row (radio + label + pts). Replica golden `shouldRenderHorizontal` (≤24 chars totais, nenhuma >10).
- **O que no Figma:** ScoreCriterionGroup hoje só tem variants Collapsed-Empty / Collapsed-Filled / Expanded × Dark = 6 vars. Faltam os 3 modos acima.
- **Ação no Figma:** adicionar properties:
  - `Mode: Multi-level | Binary | AlwaysOpen-Horizontal`
  - Quando `Binary`: trocar slot `Selected-criterion + Chevron` por `Checkbox + Badge`.
  - Quando `AlwaysOpen-Horizontal`: esconder chevron + render `Options` em row (cards mini lado a lado).
- **Motivo:** golden tinha esses 3 layouts; port React precisa replicar pra cobrir SIRS (binary), Consciência/MEWS Temp (horizontal).
- **Status:** aberto

### S6 · Radio — prop `description` (ESTENDIDO · atom)
- **Componente:** `atoms/Radio` ↔ Figma `Radio 128:3623`.
- **O que no código:** quando `description` (string) é passada, renderiza `<span class=label>` + `<span class=description>` em coluna. Container muda pra `align-items: flex-start` + radio com margin-top 2px. Sem `description`: comportamento atual preservado.
- **O que no Figma:** Radio só tem label simples (sem description).
- **Ação no Figma:** adicionar property "Show description" (boolean) + slot de description (12/400/secundário) abaixo do label, alinhado com o radio circle no topo.
- **Status:** aberto

### S7 · RadioGroup — option ganha `description` (ESTENDIDO · molecule)
- **Componente:** `molecules/RadioGroup` ↔ Figma `calc/radio-group 173:11246`.
- **O que no código:** `options: [{value, label, description?, disabled?}]`. Repassa `opt.description` pro `<Radio description=...>` interno. Mantém variant=card/plain + columns=1/2 + radius=card/pill.
- **O que no Figma:** RadioGroup atual tem opções com label só.
- **Ação no Figma:** alinhar com S6 (Radio com description) — RadioGroup variant card permite description opcional por option.
- **Aplicação:** Veredito clínico T1 (4 opções com ramo) + NEWS versão (2 opções com SSC 2026).
- **Status:** aberto

### S8 · ProtocolHeader actionBtn — fundo cinza (MUDADO deliberado · decisão Luis)
- **Componente:** `organisms/ProtocolHeader` `.actionBtn` ↔ Figma (variant pendente).
- **O que no código (antes):** border 1.5px teal + background transparent + color teal.
- **O que no código (agora):** background `var(--ds-fundo-elevado)` (cinza neutro) + color `--ds-texto-secundario` + sem borda. Estado active (badge "há anotação"): fundo teal sólido + texto branco.
- **O que no Figma:** anterior tinha borda teal.
- **Ação no Figma:** atualizar master do header actionBtn pra fundo cinza neutro (igual closeBtn dos sheets). State Active = fundo teal sólido.
- **Motivo:** Luis 2026-05-28 — borda teal distrai da informação clínica; fundo cinza é mais discreto.
- **Status:** aberto

### S9 · ProtocolSteps — conector visual entre StepItems (ESTENDIDO)
- **Componente:** `molecules/ProtocolSteps` ↔ Figma `nav/stepper-top 1831:18555`.
- **O que no código:** entre cada par de StepItems renderiza `<span class=connector data-done>` (linha tracejada teal quando step anterior está `completed`). Centro vertical alinhado com o centro do círculo (margin-top `--esp-4`). CSS `.connector` já existia mas não estava sendo wirado no JSX.
- **O que no Figma:** stepper-top atual mostra só 5 StepItems sem conector entre eles.
- **Ação no Figma:** adicionar elemento `connector` entre StepItems (linha tracejada 2px, gradient `--ds-borda-padrao`, sólido `--ds-retorno-sucesso` quando completed).
- **Status:** aberto

### S10 · BottomSheet (InfoSheet) — `leadingIcon` "i" deprecated no padrão (PADRÃO DE APLICAÇÃO)
- **Componente:** `overlays/BottomSheet` + `InfoSheet` pattern.
- **O que no código:** removido `leadingIcon="i"` de TODOS os consumidores (CADFlow, SCAFlow, SepseFlow, CadSheets, PcrSheets, ScaSheets, SepseSheets). A prop continua existindo no DS pra casos extremos.
- **O que no Figma:** BottomSheet tem property `Show leading icon` ativa por default em info sheets.
- **Ação no Figma:** mudar default do `Show leading icon` pra OFF nos InfoSheet templates (decisão de aplicação).
- **Motivo:** Luis 2026-05-28 — ícone à esquerda do título cria coluna extra que reduz largura útil + ruído visual.
- **Status:** aberto

### S11 · SheetList — bullet item texto corrido (FIX INTERNO · sem mudança no Figma)
- **Componente:** `molecules/sheet/SheetList`.
- **O que no código (antes):** `<li class=bulletItem>{item}</li>` — quando item tinha múltiplos elementos (`<strong>X</strong>` + texto), `.bulletItem` (display:flex) os interpretava como flex items separados → criava 2 colunas.
- **O que no código (agora):** `<li><span class=bulletText>{item}</span></li>` — conteúdo vira 1 bloco com texto corrido.
- **O que no Figma:** SheetList no Figma já era texto corrido (anatomia correta).
- **Ação no Figma:** ✅ **nenhuma** (Figma estava certo; código se alinhou).
- **Status:** sincronizado

### S12 · ActionFooter — prop `backLink` (ESTENDIDO)
- **Componente:** `organisms/ActionFooter`.
- **O que no código:** prop opcional `backLink: {label, onClick}` renderiza link textual "← Voltar" discreto (sem botão cheio), em linha própria acima do hint, cor `--ds-interativo-primario`, font 14/600.
- **O que no Figma:** ActionFooter atual só tem `Primary` + opcional `Secondary` (ambos botões).
- **Ação no Figma:** adicionar property "Show back link" (boolean) + slot text-link à esquerda do hint row (não substitui Primary/Secondary).
- **Motivo:** Luis 2026-05-28 — wizard de 5 telas em mobile com stepper clicável: link textual cobre voltar sem competir com primary. Padrão Opção C da pesquisa NN/g/PatternFly.
- **Status:** aberto

### S13 · HistoryView — search input automático (≥3 casos) (ESTENDIDO)
- **Componente:** `organisms/HistoryView`.
- **O que no código:** quando `cases.length >= 3`, renderiza `<input type="search">` nativo com placeholder "Buscar por iniciais ou data…". Filtro case-insensitive em `initials || date`. Empty state customizado quando filtro não casa ("Nenhum caso encontrado").
- **O que no Figma:** HistoryView não tem search modelado.
- **Ação no Figma:** criar variant "Com busca" + slot Input + filtro empty-state. Threshold visual: aparecer quando 3+ casos.
- **Motivo:** auditoria #14 — golden `historico-busca` aparecia automaticamente ≥3 casos. Reduz fricção pra encontrar caso histórico específico.
- **Status:** aberto

---

## Resumo executivo das 11 mudanças (próxima sync Figma)

| # | Componente | Tipo | Status |
|---|---|---|---|
| S1 | AlertCard | CORREÇÃO (código→Figma) | 🟢 sincronizado |
| S2 | AnnotationSheet | ESTENDIDO (onClear) | 🟠 aberto |
| S3 | HistoryView | ESTENDIDO (onCaseClick) | 🟠 aberto |
| S4 | ClinicalCard | ESTENDIDO (onInfo) | 🟠 aberto |
| S5 | ScoreCriterionGroup | ESTENDIDO (3 modos) | 🟠 aberto |
| S6 | Radio | ESTENDIDO (description) | 🟠 aberto |
| S7 | RadioGroup | ESTENDIDO (option description) | 🟠 aberto |
| S8 | ProtocolHeader actionBtn | MUDADO (fundo cinza) | 🟠 aberto |
| S9 | ProtocolSteps | ESTENDIDO (conector) | 🟠 aberto |
| S10 | InfoSheet leadingIcon | DEPRECATED na aplicação | 🟠 aberto |
| S11 | SheetList | FIX (código→Figma) | 🟢 sincronizado |
| S12 | ActionFooter | ESTENDIDO (backLink) | 🟠 aberto |
| S13 | HistoryView | ESTENDIDO (search ≥3 casos) | 🟠 aberto |

**Total a aplicar no Figma:** 11 itens abertos (2 já sincronizados ↔ código alinhou ao Figma).

**Próximos passos sugeridos** quando o time pegar sync:
1. **Prioritários** (afetam consumidores existentes em produção): S4 (ClinicalCard.onInfo), S5 (ScoreCriterionGroup 3 modos), S6+S7 (Radio/RadioGroup description), S8 (actionBtn cinza), S9 (Stepper conector).
2. **Patterns** (criar variants nos sheet templates): S2 (AnnotationSheet com Limpar), S3 (HistoryView interactive), S10 (InfoSheet sem leadingIcon default).
