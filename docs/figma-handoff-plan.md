# Plano de Handoff Código → Figma (DS + Telas da IA)

> **Quando executar:** só depois que o fluxo do protótipo for **aprovado com o cliente**. Este doc
> deixa tudo "tinindo" para a passagem ser cirúrgica e rápida.
> **Princípio:** **estender** o pipeline Figma que o repo já tem — **não** criar processo paralelo.
> **Docs base:** `figma-sync-ledger.md` (divergências código→Figma) · `ds-issues-figma.md` (problemas de
> modelagem do Figma) · `ia-response-system.md` (spec do renderer) · `prd-ia-calcmed.md` (produto).

---

## 0. O que já existe (não reinventar)

| Ativo | Onde | Uso no handoff |
|---|---|---|
| **Arquivo DS no Figma** | `zcLBv8e2kQsrsRko9FIrbZ` | destino dos componentes/tokens novos |
| **Ledger de sync** | `docs/figma-sync-ledger.md` | formato NOVO/MUDADO/ESTENDIDO — adicionar entradas da camada IA |
| **Variáveis de cor** | coleções `fundo/ texto/ borda/ interativo/ retorno/ dominio/` | bindar nos componentes novos |
| **29 text styles** | conferidos 1:1 com `--ds-font-*` | usar nos blocos de texto |
| **Escala 4-base** | `espaco/*` + `--esp-*` | autolayout gaps/padding |
| **Raios** | `r-*` / `--ds-r-*` | corner radius |
| **Dark mode** | escopo `.modo-escuro` (remapeia base) | → **modos da coleção de variáveis** no Figma |
| **Galerias de DS (código)** | `src/features/ds/*Gallery.jsx` | referência viva de cada componente (incl. `AiResponseSystemGallery`) |

**Conclusão:** o repo é **token-first** e já espelha a nomenclatura do Figma. A passagem é majoritariamente
(a) **tokenizar** o que ficou com hex cru no Figma e (b) **criar os componentes da camada IA** que ainda
não existem lá.

---

## 1. Princípios de construção no Figma (obrigatórios)

1. **Auto Layout em tudo.** Nenhum frame com posição absoluta (exceto overlays flutuantes intencionais
   — ex.: copiar no card → usar *absolute position* dentro do Auto Layout, com padding reservado).
2. **Variáveis, não valores.** Cor/espaço/raio/tipografia sempre via variável/estilo. Zero hex cru
   (o código já é zero-hardcode; o Figma precisa empatar — ver §5).
3. **Component Properties** corretas por tipo:
   - **Variant** → estados mutuamente exclusivos que mudam aparência (ex.: `Risk`, `Tone`, `State`).
   - **Boolean** → mostrar/ocultar elemento (ex.: `Show bar`, `Copyable`, `Show action`).
   - **Instance swap** → trocar um filho por outro (ex.: ícone, chip).
   - **Text** → conteúdo (título, label, valor).
4. **Naming:** `camada/Componente` no DS (ex.: `ai/DoseBlock`), `Property=Value` em variants.
   Telas: `Fluxo / Tela / Estado`.
5. **Grid & constraints:** mobile = 1 coluna, margem 16, frame 390. Web = grid de 12 colunas (ver §7).
   Constraints `Left&Right` / `Top` nos elementos que esticam.
6. **Min-width/Hug/Fill** explícitos (espelha `flex`, `min-width:0`, `flex-shrink:0` do código).
7. **Slots** via *instance/section* para conteúdo variável (corpo da resposta, body do BottomSheet).

---

## 2. Auditoria de prontidão da atomização (código → Figma)

> Pergunta-chave: a atomização do **código** está correta para virar componentes escaláveis no Figma?

| Camada | Veredito | Observações |
|---|---|---|
| **atoms** (Button, Icon, Checkbox, Radio, Toggle, FAB, InfoButton, SectionLabel, StepItem) | ✅ pronto | Já espelham átomos do Figma. Ressalvas conhecidas em `ds-issues-figma` (Radio átomo vs option; Icon critico/rodape; Checkbox "Maior"). |
| **molecules** (Chip, Tag, InputField, DoseDisplay, Select, Segmented, Toast, Stepper, …) | ✅ pronto | Toast tem extensão `onUndo` (ledger A1) — **portar** como `Show action`. |
| **organisms** (Table, AlertCard, ChecklistBlock, ProtocolHeader, BottomSheet, ClinicalCard, …) | ✅ pronto | `ClinicalCard` é container composável (ledger CC-CLIN): no Figma virar **container com slots**. AlertCard layout (ledger A2/ds-issue 6) = **decisão pendente**. |
| **overlays** (BottomSheet + patterns: InfoSheet, ConfirmSheet, …) | ✅ pronto | `InfoSheet` ganhou prop **`blocking`** (sheet de aviso só fecha pelo CTA) — **portar** como property. |
| **ai/** (AIResponse + 12 blocos + CopyButton) | ⚠️ **novo no Figma** | É o grosso do trabalho. Atomização correta (ver §3). |
| **templates** (ProtocolShell, TheoryScreen, HistoryScreen) | ✅ pronto | Servem de molde para as sections de tela. |
| **screen-level IA** (faixa de sugestões, composer multilinha, thread, conv card, message actions, interrupted marker) | ⚠️ **novo** | Componentizar os reusáveis (§4) antes de montar telas. |

**Veredito geral:** a atomização do código **está correta e escalável** — átomos puros, moléculas que
compõem átomos, organismos que compõem moléculas, e a camada `ai/` que compõe organismos. Isso mapeia
1:1 para a hierarquia de componentes do Figma. **A camada IA é a única lacuna real** no arquivo DS.

---

## 3. Inventário da camada IA → modelagem no Figma (NOVO)

> Adicionar como nova seção no `figma-sync-ledger.md`. Cada componente abaixo é **NOVO no Figma**.
> Coluna "Component properties" = receita de modelagem escalável.

| Componente (código) | Compõe | Component properties recomendadas (Figma) |
|---|---|---|
| **`ai/AIResponse`** | container | `Variant`=Card·Plain · `Risk`=None·Baixo·Medio·Alto · bool `Show bar` · **slot** Body (Auto Layout vertical, gap `espaco/12`) |
| **`ai/ResponseHeader`** | — | text `Title`·`Context` · `Intent`=dose·triagem·exame·comparacao·protocolo·critico·aprendizado·resumo·operacional·ambigua (cor do badge por intent) · bool `Show context` |
| **`ai/PrimaryAction`** | — | `Tone`=neutro·info·critico · text `Label`·`Content` |
| **`ai/DoseBlock`** | DoseDisplay | bool `Copyable` (mostra copiar flutuante top-right, padding-right reservado) · instance `CopyButton` |
| **`ai/CopyButton`** ⭐ | Icon | `State`=Default·Copied (ícone copiar ⇄ check) · `Chrome`=Ghost·Floating·Inset (fundo/borda por contexto) |
| **`ai/CopyableBlock`** | Chip + CopyButton | bool `Has variants` (linha de chips de formato) · text `Body` |
| **`ai/ExpandableSection`** | — | `Open`=False·True · text `Title`·`Hint` · **slot** Content |
| **`ai/ContextSelector`** | option pills | text `Question` · **slot** Options (lista de pills, instance-swap) |
| **`ai/InterpretationBlock`** | Table + SuggestionChips | `Tone`=info·atencao·critico·sucesso (cor da leitura) · bool `Show chips` · **slot** Table |
| **`ai/LimitationNote`** | Icon | text `Content` (nota discreta, borda superior) |
| **`ai/ProtocolStep`** | — | item `State`=Done·Active·Pending (matriz de variants por passo) |
| **`ai/SuggestionChips`** | Chip | bool `Show label` (eyebrow) · **slot** Chips |
| **blocos de texto** (`heading`/`text`/`list`/`divider`) | — | `heading`: bool `Has icon` (instance Icon, cor `interativo/primario`) · usar text styles `--ds-font-*` |

**Regra de ouro da camada IA:** cada bloco é um componente **independente e composável**; a "resposta" é
um Auto Layout vertical que recebe N instâncias de bloco. Isso espelha exatamente o `AIResponseRenderer`
(payload → lista de blocos) e mantém o Figma escalável (adicionar um tipo de bloco = adicionar 1
componente, sem tocar nos demais).

---

## 4. Componentes de tela da IA (NOVO · vão pro DS como patterns ou ficam no arquivo de telas)

| Pattern | Component properties | Onde |
|---|---|---|
| **Header IA** | variante do `ProtocolHeader` (← + título + subtítulo + ação relógio/plus). **ESTENDIDO:** adicionar ícone `plus` ao set de ações do ProtocolHeader (ledger). | DS (variante) |
| **SuggestionStrip** (faixa rolável) | **slot** de SuggestionChip (instance) · scroll horizontal · `espaco/8` gap | DS pattern |
| **Composer** | `Mode`=Send·Stop · bool `Multiline` (textarea 1→5 linhas) · text `Placeholder` | DS pattern |
| **MessageActions** | bools `Copy`·`Up`·`Down`·`Regenerate` · `Feedback`=None·Up·Down | DS pattern |
| **UserBubble** | text `Message` (cinza sóbrio `fundo/elevado`) | DS pattern |
| **ConvCard** (histórico) | text `Title`·`Date` (só nome + data) | DS pattern |
| **InterruptedNote** | text + ação `Continuar` | DS pattern |
| **FeedbackSheet** (`IAFeedbackSheet`) | BottomSheet + chips de motivo (multi-seleção) + Textarea + footer "Enviar". `Tipo`=Útil·Não-útil (conjuntos de chips distintos). | DS pattern (sobre BottomSheet) |

---

## 5. Tokens → Figma Variables (com modos)

**Coleções de cor** (já existem): `fundo/`, `texto/`, `borda/`, `interativo/`, `retorno/`, `dominio/`,
`tag-*`. **Ação:** garantir **todos** os componentes novos bindados a variável (zero hex). Itens com hex
cru já catalogados no ledger (TC2/TC3, CC5) — tokenizar.

**Modos da coleção de cor (dark mode):**
- O código faz dark via `.modo-escuro` remapeando a **base**. No Figma, isso é uma **coleção com 2
  modos: `Light` e `Dark`** — cada variável semântica (`fundo/padrao`, `texto/padrao`, …) resolve para o
  valor claro/escuro. Componentes bindam na variável semântica → trocar o modo do frame troca o tema.
- **Não** duplicar componentes para dark; **um** componente + modo de variável.

**Espaço / raio / tipografia:** `espaco/*` (4-base) e `r-*` como variáveis de número; `--ds-font-*` como
**text styles** (já conferidos 1:1). Tracking já pareado.

---

## 6. Arquivo de TELAS — estrutura e organização

**Princípio:** o arquivo de telas **consome** os componentes do DS (instâncias), nunca redesenha.

### 6.1 Organização por fluxo (uma Section por fluxo, documentada)
1. **Entrada & seleção** (Protótipo × Design System) — se aplicável.
2. **IA · Onboarding** (1º acesso bloqueante + rever avisos).
3. **IA · Chat** (vazio → digitando → pensando → streaming → interrompida → concluída).
4. **IA · Cenários de resposta** (um quadro por bloco/intent — espelha o grafo do PRD §10).
5. **IA · Histórico** (vazio · com conversas · apagar/desfazer).
6. **(P1) Orquestração** (deep-link p/ calc/protocolo) — placeholders.

Cada Section: **título + descrição** (o que é o fluxo, gatilhos, estados), e os frames em ordem de
jornada. Conectar com **FigJam/flow arrows** ou prototype links para o P.O. navegar.

### 6.2 Superfícies (matriz)
| Superfície | Frame | Grid | Tema |
|---|---|---|---|
| Mobile Light | 390×844 | 1 col, margem 16 | modo `Light` |
| Mobile Dark | 390×844 | idem | modo `Dark` |
| Web Light | 1440 (conteúdo centrado, frame app 390–480) | 12 col, 1440 | modo `Light` |
| Web Dark | 1440 | idem | modo `Dark` |

> "Web white e dark" = Web Light + Web Dark. O app é mobile-shell; na web, o shell vive centrado num
> canvas mais largo (ver `--media (max-width:750px)` no código). Documentar a moldura web.

### 6.3 Documentação por frame
- Nome `Fluxo / Tela / Estado` · nota de comportamento · tokens/variáveis usados · links de protótipo.

---

## 7. Plano por fases (checklist de execução)

**Fase 0 — pré-flight (antes de tocar no Figma)**
- [ ] Fluxo do protótipo aprovado com o cliente.
- [ ] Congelar a taxonomia de blocos (PRD §7) e o grafo (PRD §10).
- [ ] Resolver decisões pendentes (§8).

**Fase 1 — DS: tokens**
- [ ] Tokenizar hex crus pendentes (ledger TC2/TC3, CC5).
- [ ] Confirmar coleção de cor com modos `Light`/`Dark` cobrindo todas as semânticas usadas pela IA.

**Fase 2 — DS: componentes IA (§3)**
- [ ] Criar os 12 blocos + `CopyButton` como componentes com as properties da tabela §3.
- [ ] Estender: `ProtocolHeader` (ícone `plus`/variante IA), `Toast` (`Show action`), `InfoSheet` (`blocking`).
- [ ] Criar patterns de tela (§4).
- [ ] Validar com a `AiResponseSystemGallery` (código) como referência visual 1:1.

**Fase 3 — Telas (§6)**
- [ ] Montar as Sections por fluxo, só com instâncias do DS.
- [ ] Aplicar as 4 superfícies (mobile/web × light/dark) via modos de variável.
- [ ] Documentar cada section/frame.
- [ ] Ligar o protótipo (navegação) para o P.O.

**Fase 4 — QA de paridade**
- [ ] Conferir cada componente IA contra o código (espaçamento por `espaco/*`, tipografia por text style).
- [ ] Conferir dark mode (nenhum hex cru "vazando" no escuro).
- [ ] Atualizar o `figma-sync-ledger.md` (status → sincronizado).

---

## 8. Decisões pendentes (resolver antes da Fase 2)
1. **AlertCard layout** — horizontal (código) vs vertical (Figma master). Ledger A2 / ds-issue 6.
2. **ClinicalCard como container** com slots/instance-swap (ledger CC-CLIN) — confirmar modelo.
3. **Radio átomo vs Radio Option** (ds-issue 1) — separar no Figma.
4. **Icon `critico`/`rodape`** (ds-issue 5) — corrigir átomo.
5. **Plataforma como dimensão**: web/mobile vira **modo** de variável (layout) ou apenas frames
   distintos? Recomendação: frames distintos + grid próprio; cor continua em modos Light/Dark.

---

## 9. Riscos
- **Drift de token** se algum componente IA for desenhado com valor cru → quebra o dark mode. Mitigação:
  checklist Fase 4 + lint visual contra a galeria.
- **Escopo da camada IA** é grande (13 componentes novos) → fatiar por bloco, validar incremental.
- **Decisões pendentes** (§8) bloqueiam consistência → resolver na Fase 0.
- **Plataforma web** ainda é pouco exercitada no código → validar a moldura antes de produzir 4 superfícies.

---

## 10. Increments do inventário (validação 97 componentes)

> Auditoria completa do `src/shared/components/` confirmou o plano e revelou pontos cirúrgicos:

1. **Zero hardcode de produto** — todos os `.module.css` usam `var(--token)`; hex só em comentários de
   anotação. Única exceção: `DevPanel` (`#fff`, tooling DEV fora do frame, intencional). → A maior parte
   do *binding de variável* no Figma já está garantida pela disciplina do código.
2. **Unificar os dois "Icon"** — existe o átomo `Icon` (dicionário grande PT-BR + aliases EN) **e** um
   `Icon` SVG **local** dentro do `ProtocolHeader` (dicionário reduzido: back/audio/edit/exit/clock/plus).
   No Figma, **um** componente Icon; o ProtocolHeader deve consumir o átomo (e o ícone `plus` que
   adicionei entra nesse set unificado). **Nota:** o glyph `ia` foi corrigido (era um sol idêntico ao
   `modo-claro`) → agora é um **sparkle**; `sparkles` é alias de `ia`. Garantir o sparkle no Figma.
3. **Família Table = 1 componente + presets** — `Table` (organism) é a base; `ScoreRangeTable`,
   `TETTabela` e `InterpretationBlock` são **wrappers de colunas fixas**. No Figma: **uma** `Table` com
   variants/instâncias, não 4 tabelas.
4. **Componentes com estado → variants explícitos no Figma** (não esquecer os dois lados do estado):
   `CopyButton` (`State`=Default·Copied), `ExpandableSection` (`Open`=False·True), `BottomSheet`
   (open/exit), `SelectSheet`, `EventList`, `HistoryView`. Os demais ~88 são apresentacionais/controlados.
5. **Famílias de variant (modelar como 1 Component + matriz de variants):** `Tag` (variant×tone),
   `Chip`/`UnitChip`/`RangeChip` (mesma família), `ScoreCriterion` (6 `type`), `ScoreCriterionGroup`
   (3 modos), `AlertCard` (5 `level`), `TimerCard` (tone×state×size), `BannerContextual` (4 tone).
6. **`InfoButton`** é o átomo mais reusado em headers (SectionLabel, StepHeader, ChecklistBlock,
   ClinicalCard, TimerCard) → garantir como instância única bem definida.
7. **Templates como molde de tela** — `ProtocolShell` (casca dos 5 protocolos), `TheoryScreen`,
   `HistoryScreen` já existem no código e servem de referência 1:1 para as sections do arquivo de telas.

## 11. Veredito
A base está **pronta e organizada** para a passagem: arquitetura token-first, atomização correta e
espelhada no Figma, pipeline de sync já existente. O trabalho concentra-se em **criar a camada IA no
Figma** (com as properties da §3) e **tokenizar os hex crus pendentes**. Seguindo as fases, a passagem é
incremental e auditável — sem retrabalho e sem linguagem visual paralela.
