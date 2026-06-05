# Plano de Handoff Código → Figma (DS + Telas das 5 Centrais de Urgência)

> **Quando executar:** depois que o fluxo dos protocolos for **aprovado com o cliente**. Este doc
> deixa tudo "tinindo" para a passagem das centrais (CAD · SCA · Sepse · PCR · AVC) ser cirúrgica.
> **Princípio:** **estender** o pipeline Figma que o repo já tem (mesmo do `figma-handoff-plan.md` da
> IA) — **não** criar processo paralelo.
> **Docs base:** `figma-handoff-plan.md` (template/qualidade — IA) · `figma-sync-ledger.md` (divergências
> código→Figma · seção "Central de Urgência" K1–K8 + Sepse port S1–S15) · `shell-estrutura-5-fluxos.md`
> (esqueleto dos 5) · `catalogo-componentes-padronizacao.md` (token-compliance + properties) ·
> `audit-central-urgencia-componentizacao.md` (estado) · `kit-central-urgencia.md` (kit K1–K8) ·
> `ds-issues-figma.md` (problemas de modelagem do Figma).

---

## 0. O que já existe (não reinventar)

| Ativo | Onde | Uso no handoff |
|---|---|---|
| **Arquivo DS no Figma** | `zcLBv8e2kQsrsRko9FIrbZ` | destino dos componentes/tokens das centrais |
| **Ledger de sync** | `docs/figma-sync-ledger.md` | já tem a seção **Central de Urgência** (K1–K8) + **Sepse port** (S1–S15) — estender/fechar entradas |
| **Variáveis de cor** | coleções `fundo/ texto/ borda/ interativo/ retorno/ dominio/ tag-*` | bindar nos componentes das centrais |
| **29 text styles** | conferidos 1:1 com `--ds-font-*` | usar nos blocos de texto (tipografia ainda literal em vários — ver §3) |
| **Escala 4-base** | `espaco/*` + `--esp-*` | autolayout gaps/padding |
| **Raios** | `r-*` / `--ds-r-*` (`--ds-r-md` 12 · `--ds-r-sm` 8 · `--radius-input`) | corner radius |
| **Dark mode** | escopo `.modo-escuro` (remapeia base) | → **modos da coleção de variáveis** no Figma |
| **Pediatria** | escopo `.modo-pediatrico` | → eventual modo extra (decisão pendente §8) |
| **Templates L2 (código)** | `templates/ProtocolShell` · `HistoryScreen` · `TheoryScreen` | molde 1:1 das sections de tela |
| **Galerias DS (código)** | `?qa=urgencia` + `features/ds/{Cad,Sca,Sepse,Pcr,Avc}Sheets.jsx` | referência viva de sheets/componentes |
| **Realidade do porte** | `features/{cad,sca,sepse,pcr,avc}/*Flow.jsx` | **os 5 já são React nativo** (iframe golden aposentado) → atomização final é a verdade |

**Conclusão:** as 5 centrais **já foram portadas do golden para React nativo** (CAD/SCA/Sepse/PCR/AVC
têm `*Flow.jsx` próprios consumindo o DS — o `GoldenProtocolFrame`/iframe foi aposentado). O shell é
**uniforme** (achado `shell-estrutura-5-fluxos.md`): `ProtocolHeader → painel da aba → ActionFooter →
TabBar`. A passagem é majoritariamente **portar pro Figma o kit code-first** (K1–K8 + extensões do Sepse
S1–S15, todos **aberto/parcial** no ledger) e **montar as telas** compondo instâncias.

---

## 1. Princípios de construção no Figma (obrigatórios)

Iguais ao handoff da IA (não reinventar):

1. **Auto Layout em tudo.** Posição absoluta só em overlays flutuantes intencionais (ex.: FAB do PCR
   ancorado acima do footer → *absolute position* dentro do Auto Layout, padding reservado).
2. **Variáveis, não valores.** Cor/espaço/raio sempre via variável; tipografia via text style. Zero hex
   cru (o código das centrais é **100% token em cor/spacing/radius** — `catalogo` confirma; tipografia
   ainda é literal em vários, ver §3).
3. **Component Properties** corretas por tipo:
   - **Variant** → estados mutuamente exclusivos que mudam aparência (ex.: `Level`, `Tone`, `State`, `Size`).
   - **Boolean** → mostrar/ocultar (ex.: `Show Steps`, `Show Icon`, `Show Value`, `Show Badge`, `Show Chevron`).
   - **Instance swap** → trocar filho (ícone da TabBar/ActionTile, chip do header).
   - **Text** → conteúdo (título, label, valor, meta).
4. **Naming:** `camada/Componente` no DS (ex.: `protocol/timer-card`, `protocol/action-footer`),
   `Property=Value` em variants. Telas: `Central / Tela / Estado`.
5. **Grid & constraints:** mobile = 1 coluna, margem 16, frame 390. Web = shell centrado (ver §4.2).
6. **Min-width/Hug/Fill** explícitos (espelha `flex`, `min-width:0`, `flex-shrink:0`). O shell é
   **app-shell**: header/footer/TabBar `flex-shrink:0`, só o `<main>.body` rola (regra CLAUDE.md §4).
7. **Slots** via *instance/section* para conteúdo variável (corpo da aba executar = N telas-passo OU
   dashboard; body do ClinicalCard; body do BottomSheet).

---

## 2. Auditoria de prontidão da atomização (código → Figma)

> Pergunta-chave: a atomização do **código das centrais** está correta para virar componentes escaláveis?

| Camada | Veredito | Observações |
|---|---|---|
| **templates** (`ProtocolShell`, `HistoryScreen`, `TheoryScreen`) | ✅ pronto | Shell uniforme cobre os 5 com **stepper opcional** (PCR sem) + **executar como slot** (dashboard PCR). Molde 1:1 das sections de tela. |
| **organisms da central** (`ProtocolHeader`, `TimerCard`, `ActionFooter`, `AlertCard`, `ChecklistBlock`, `ClinicalCard`, `Timeline`, `ScoreCriterionGroup`, `BannerContextual`, `EventList`, `HistoryView`, `PatientDetail`, `TETTabela`, `PanfletoPlaceholder`) | ⚠️ **code-first** | Atomização correta; **maioria ainda NÃO está no Figma** (K1–K8 aberto/parcial no ledger). É o grosso do trabalho. |
| **molecules da central** (`TabBar`, `ProtocolSteps`, `ActionTile`, `OptionCard`, `ScoreResult`, `RangeChip`, `RitmoIcon`, `HHTTPills`, `StatGrid`, `DetailRow`, `StepHeader`, `Segmented`, `ToggleTab`) | ⚠️ parcial | Vários novos (ActionTile, RitmoIcon, HHTTPills, StepHeader, OptionCard) — portar. `StepItem` (átomo) extraído de `ProtocolSteps` (K2). |
| **atoms** (`Button`, `Icon`, `Checkbox`, `Radio`, `InfoButton`, `SectionLabel`, `StepItem`, `FAB`) | ✅ pronto | Já espelham átomos. Ressalvas conhecidas no `ds-issues-figma` (Radio átomo vs option; Icon `critico`/`rodape`). `StepItem` é novo (K2). |
| **overlays** (`InfoSheet`, `ConfirmSheet`, `FormSheet`, `SavePatientSheet`, `AnnotationSheet`, `DetailSheet`, `SelectSheet`, `ActionSheet`, `ChecklistSheet`, `ToolSheet`) | ✅ pronto (patterns) | Sobre `BottomSheet`. `InfoSheet.blocking`, `AnnotationSheet.onClear` (S2) = extensões a portar. Sheets por central já demonstrados em `ds/*Sheets.jsx`. |

**Veredito geral:** a atomização do código das centrais **está correta e escalável** — átomos puros →
moléculas → organismos → templates, com o `ProtocolShell` compondo tudo. Mapeia 1:1 para a hierarquia
do Figma. **A lacuna real é que o kit é code-first** (construído a partir dos prints do golden, decisão
do Luis), então quase todo o inventário das centrais ainda precisa nascer/fechar no Figma — listado em §3.

---

## 3. Inventário de componentes das centrais → modelagem no Figma

> Cada componente abaixo já tem entrada no `figma-sync-ledger.md` (K1–K8 · S1–S15). Aqui ficam as
> **component properties recomendadas** e o status NOVO/ESTENDIDO. "Compõe" = filhos do componente.

### 3.1 Casca / chrome (compartilhado pelos 5)

| Componente (código) | Status Figma | Compõe | Component properties recomendadas |
|---|---|---|---|
| **`templates/ProtocolShell`** | NOVO (molde) | Header + main(slot) + ActionFooter + TabBar | bool `Show Steps` · bool `Show Footer` · bool `Show FAB` · `Active Tab`=Executar·Histórico·Teoria · slot **Body** (Auto Layout vertical) · `Domain`=cad·sca·sepse·pcr·avc |
| **`organisms/ProtocolHeader`** (K1+K1-update) | ESTENDIDO | ProtocolSteps · chips · Icon · timer | `Timer Variant`=Inline·Stacked · bool `Show Steps` · bool `Show Timer` · bool `Show Timer Icon` · bool `Show Status Dot` · bool `Compact` · `Domain`=5 · text `Title`·`Subtitle`·`Timer`·`Timer Label` · slot **Chips** (instance) · slot **Actions** (instance-swap de Icon: back/audio/audio-mute/edit/exit/clock/plus) |
| **`molecules/ProtocolSteps`** (K2) | NOVO | `StepItem` × N + conector | `Steps`=N(4–7) · `Current` · `Active Presentation`=circle·capsule (SCA usa capsule) · por-item override `pending·active·completed·warning` (Sepse) |
| **`atoms/StepItem`** (K2) | NOVO | círculo 24 + label | `State`=pending·active·completed·warning · +hover/disabled |
| **`molecules/TabBar`** (K6) | NOVO | Icon + label + badge | `Active Item`=0..N · bool `Show Badge` · `Mode`=protocol · `Item Count` (3) · bool `Safe Area`·`Sticky` · slot icon (instance-swap) |
| **`organisms/ActionFooter`** (K5+S12) | NOVO | Button ×N | bool `Show Hint` · text `Hint`·`Meta` · `Primary Label`·`Secondary Label` · `Primary Variant`·`Secondary Variant` · bool `Sticky` · `Secondary Compact` (par secondary+primary) · ~~`backLink`~~ (deprecated S12) |

### 3.2 Cards clínicos e timers

| Componente (código) | Status Figma | Compõe | Component properties recomendadas |
|---|---|---|---|
| **`organisms/TimerCard`** (K3) | NOVO/parcial | InfoButton + progress | **matriz `Tone`×`State`×`Size`:** `Tone`=primary·critical·warning (legado SCA) · `State`=idle·running·cycle-end·window-ok·window-overdue (PCR `.pcr-card-*`) · `Size`=md(32px)·lg(56px) · bool `Show Progress` (+markers adrenalina 3/5min) · bool `Show Info` · text `Label`·`Value`·`Description`·`Meta` · slot **Actions** (Segmented BPM/min + Button "Apliquei agora"). **Dívida (S/§8):** aposentar `Tone`→`State` quando padronizar SCA. |
| **`organisms/ClinicalCard`** (S4 · CC-CLIN) | ESTENDIDO | Tag + InfoButton + slot | `State`=default·ativo·inativo · `Variant`=default·plain · bool `Show Tags`·`Show Info` (S4 `onInfo`) · text `Title`·`Subtitle` · slot **Tags** + **Body** (container composável: InputField/AlertCard/ChecklistBlock/RadioGroup/DoseDisplay) |
| **`organisms/AlertCard`** (S1) | ESTENDIDO | Icon + InputField | `Level`=info·warning·critical·result·footnote (5) · bool `Show Icon`·`Show Value` · bool `Show Value Input` (peso embutido) · text `Title`·`Value`·`Unit` · slot **Body**. Layout **vertical** (S1 corrigiu o React; Figma já estava certo). Ícones por level: info=informacao · result=sucesso · critical=atencao(triângulo) · warning=critico(octógono) · footnote=rodape. |
| **`organisms/ChecklistBlock`** (S15) | ESTENDIDO | Tag + Checkbox + InfoButton | `Tag Tone`=critico·premium·novo·… · bool `Show Info` · bool `Highlight Pending` (S15 · borda vermelha em item incompleto) · text `Tag Label`·`Count`·`Subtitle` · slot **Items** (Checkbox ×N) |
| **`molecules/StepHeader`** | parcial | título + subtítulo + info/ação | `As`=h1·h2 · bool `Show Subtitle`·`Show Info`·`Show Action` · text `Title`·`Subtitle`. Topo de **toda tela** dos 5. Tokenizar tipografia (literal hoje). |
| **`organisms/BannerContextual`** (PCR) | NOVO | título + descrição + IconButton | `Tone`=warning·critical·pos-choque·success (4) · bool `Pulse` (critical) · bool `Show Dismiss` · text `Title`·`Description`. border-left grosso. |

### 3.3 Scores e seleção

| Componente (código) | Status Figma | Compõe | Component properties recomendadas |
|---|---|---|---|
| **`organisms/ScoreCriterionGroup`** (CC-SCG · S5) | ESTENDIDO | Radio/Checkbox + badge + chevron | **3 modos:** `Mode`=accordion·binary·alwaysOpen · `State`=Collapsed-Empty·Collapsed-Filled·Expanded · bool `Show Badge`·`Show Chevron`·`Show Selected` · `Options Layout`=vertical·horizontal (S5 · ≤3 opções curtas) · text `System Name`·`Parameter`·`Points` · slot **Options**. Usado em SCA (HEART/TIMI) · Sepse (SOFA/qSOFA/SIRS/NEWS) |
| **`molecules/ScoreResult`** | parcial | valor + risco | `Risk`=baixo·moderado·alto (cor do badge) · text `Value`·`Risk Label`·`Points Label` |
| **`molecules/ScoreRangeTable`** | preset de `Table` | linhas faixa→risco | wrapper de colunas fixas de `Table` (não tabela separada — `Table` 1 componente + presets) |
| **`molecules/OptionCard`** | NOVO | título + meta + descrição + slot | `Tone`=default·info·warning·critical·success · bool `Selected`·`Disabled` · text `Title`·`Meta`·`Description` · slot **Media**·**Body**. **Sem bullet** (≠ RadioGroup card) — seleção pela superfície. SCA (PPCI vs Fibrinólise, classe ECG) · PCR (conduta). |
| **`molecules/RangeChip`** | família `Chip` | borda 2px + número mono | `Tone`=default·critical · bool `Selected`·`Disabled` · text `Label`. CAD seletor de K (`.faixa-chips`). |

### 3.4 Operacional PCR + histórico (específicos)

| Componente (código) | Status Figma | Compõe | Component properties recomendadas |
|---|---|---|---|
| **`molecules/ActionTile`** (K4) | NOVO | ícone + label + status | bool `Disabled` · text `Label`·`Value` · instance-swap **Icon**/`iconNode`. PCR `.acoes-row` (Selecionar ritmo / Desfibrilar), em grid. ≠ DisclosureCard (row). Carrega regra clínica → aterrissar em PCR antes. |
| **`molecules/RitmoIcon`** | NOVO | SVG do ritmo | `Ritmo`=fv·tv·assistolia·aesp·na · `Size`. Ícone do ritmo selecionado no PCR. |
| **`molecules/HHTTPills`** | NOVO | pílulas H/T | slot **Items** (`{letter, …}`) · bool/lista `Emphasized` · tone por letra (H vs T). Causas reversíveis (5H/5T) no PCR. |
| **`atoms/FAB`** | pronto | ícone flutuante | `Icon`=plus · ancorado acima do footer (PCR T2 "Adicionar evento"). |
| **`organisms/EventList`** (PCR) | NOVO | EventItem ×N | bool `Default Open` · text `Title`·`Empty Text` · slot **Events**. Log operacional do PCR (adrenalina/ritmo/choques). |
| **`organisms/Timeline`** (K7) | NOVO | EventItem + rail/dot | text `Title`·`Empty Text` · count badge · por-evento `Status`=info·success·warning·critical (→ Tag tone). Histórico de todos os 5. |
| **`organisms/HistoryView`** (HistoryScreen) | parcial | lista de casos + busca + Limpar | bool `Show Search`·`Show Clear` · slot **Cases** · empty-state. `Status` por caso. |
| **`organisms/PatientDetail`** (K8) | NOVO | header + summary + sections | slots **Summary** + **Sections** (linhas label/valor). Decisão: vive em `DetailSheet` OU tela cheia (§8). |
| **`organisms/TETTabela`** (PCR) | preset de `Table` | tabela tamanho TET | wrapper de colunas fixas de `Table` (teoria PCR). |
| **`organisms/PanfletoPlaceholder`** (PCR) | NOVO | placeholder de panfleto | text `Title` · slot. Aba teoria PCR (ACLS\|AHA). |

### 3.5 Overlays / sheets (sobre `BottomSheet` — patterns)

| Pattern | Status Figma | Component properties recomendadas | Centrais que usam |
|---|---|---|---|
| **`InfoSheet`** | ESTENDIDO | bool `Blocking` (só fecha pelo CTA — sem backdrop/ESC/X) · slot Body · CTA | CAD · SCA · Sepse · PCR · AVC |
| **`ConfirmSheet`** | pronto | text `Title`·`Message` · `Confirm Label`·`Cancel Label` · `Tone`=neutro·critico | todos (sair/reset/confirmar) |
| **`FormSheet`** | pronto | slot Fields · footer Salvar | CAD · PCR · AVC |
| **`SavePatientSheet`** | pronto | campos de identificação + Salvar | CAD · SCA · Sepse · AVC |
| **`AnnotationSheet`** (S2) | ESTENDIDO | Textarea + bool `Show Clear` (S2 `onClear`) · Salvar | todos (anotar) |
| **`DetailSheet`** | pronto | slots Summary + Sections (espelha PatientDetail) | todos (caso aberto) |
| **`SelectSheet`** | pronto | lista de opções single-select | CAD (K) · SCA |
| **`ChecklistSheet` · `ActionSheet` · `ToolSheet`** | pronto | conforme pattern | conforme central |

### 3.6 Quem usa o quê (matriz por central)

> Lido dos imports dos `*Flow.jsx`. ✓ = a central compõe esse componente.

| Componente | CAD | SCA | Sepse | PCR | AVC |
|---|:--:|:--:|:--:|:--:|:--:|
| ProtocolShell · ProtocolHeader · StepHeader | ✓ | ✓ | ✓ | ✓ | ✓ |
| ProtocolSteps (stepper) | ✓ | ✓ | ✓ | — (dashboard) | ✓ |
| TabBar · ActionFooter | ✓ | ✓ | ✓ | ✓ | ✓ |
| AlertCard | ✓ | ✓ | ✓ | ✓ | ✓ |
| ClinicalCard | ✓ | ✓ | ✓ | — | ✓ |
| ChecklistBlock | — | ✓ | ✓ | — | ✓ |
| Timeline | ✓ | ✓ | ✓ | ✓ | ✓ |
| TimerCard | ✓ | ✓ | — | ✓ (foco) | — |
| ScoreCriterionGroup · ScoreResult | — | ✓ | ✓ | — | — |
| ScoreRangeTable | — | — | ✓ | — | — |
| OptionCard | — | ✓ | — | ✓ | — |
| Segmented · RadioGroup · InputField | — | ✓ | ✓ | ✓ | ✓ |
| ToggleField · ToggleTab · DetailRow | Sepse: ToggleField/DetailRow · PCR/Sepse: ToggleTab | | ✓ | ✓ | — |
| ActionTile · RitmoIcon · EventList · BannerContextual · PanfletoPlaceholder · TETTabela · FAB | — | — | — | ✓ | — |
| HistoryView · HistoryScreen · TheoryScreen | ✓ | ✓ | ✓ | ✓ (TheoryScreen via ACLS) | ✓ |
| Sheets: Info/Confirm/Annotation/Detail/SavePatient | ✓ | ✓ | ✓ | ✓ (Info/Confirm/Annotation/Detail/Form) | ✓ |

**Regra de ouro:** cada componente é **independente e composável**; a "tela" é um `ProtocolShell`
(Auto Layout) que recebe N instâncias na slot Body. Adicionar uma central = compor os mesmos
componentes, sem tocar nos demais.

---

## 4. Tokens → Figma Variables (com modos) e estrutura das telas

### 4.1 Tokens → variáveis

**Coleções de cor** (já existem): `fundo/`, `texto/`, `borda/`, `interativo/`, `retorno/`, `dominio/`,
`tag-*`. As centrais são **100% token em cor/spacing/radius** (`catalogo` §1 confirma; grep só achou `#`
em comentário). **O que falta tokenizar/portar:**

- **Tipografia ainda literal** em vários componentes da central (StepHeader, OptionCard, StatGrid,
  RangeChip, ActionTile, ClinicalCard plain) — `catalogo` §5 propõe **Opção 3 (escala tipográfica
  completa)**. No Figma → **text styles** (29 já conferidos); aplicar os faltantes e fechar
  `--ds-font-*` drifted. **Decisão pendente §8.**
- **Hex crus residuais (escopo agente DS, registrados no audit §5):** `Button.module.css:51` `#7f1d1d`,
  `IconButton` bloco dark (vários), `Toggle.module.css:44` `#ffffff`, `ChecklistBlock.module.css:28`
  `#F43F5E` (ledger CC5). Tokenizar antes do dark mode no Figma (senão "vaza" no escuro).
- **Acento por doença** (`domain`): hoje `data-domain` é hook **sem cor forçada** (K1) → definir
  mapeamento doença→cor de `dominio/` no Figma (decisão pendente §8).

**Modos da coleção de cor (dark mode):** o código faz dark via `.modo-escuro` remapeando a **base**.
No Figma = **coleção com 2 modos `Light`/`Dark`**; cada variável semântica (`fundo/padrao`,
`texto/padrao`, …) resolve claro/escuro. Componentes bindam na semântica → trocar o modo do frame troca
o tema. **Não** duplicar componentes para dark. **Pediatria** (`.modo-pediatrico`) = eventual 3º modo
ou coleção à parte (§8).

**Espaço / raio:** `espaco/*` (4-base) e `r-*` como variáveis de número (autolayout gaps/padding/corner).

### 4.2 Estrutura do arquivo de TELAS — uma Section por central

**Princípio:** o arquivo de telas **consome** os componentes do DS (instâncias), nunca redesenha.
Cada central = **uma Section**, com título + descrição (gatilhos/estados) e os frames em ordem de
jornada (wizard). Todos os frames em **Auto Layout** (app-shell: header/footer/TabBar fixos, body rola)
e grid de §4.3.

| Section | Telas do wizard (executar) + abas | Estados/telas notáveis |
|---|---|---|
| **1. CAD · cetoacidose** | Stepper 5 (Diagnóstico · Pós-diag · Insulina · Reaval. · Resolução) · 7 telas (Identificar · Manejo inicial · **KCl ramo** · Insulina · Acompanhar h/h · Resolução · **CAD resolvida**) | **gate de K** (RangeChip `<3,5` bloqueia insulina · `Selected`·`Disabled`) · TimerCard reavaliação · log de medidas (DetailRow) · resumo/encerramento (StatGrid) |
| **2. SCA · síndrome coronariana** | Stepper 5 capsule (Triagem · ECG · Estratif. · Conduzir · Reavaliar) · 5 telas | ScoreCriterionGroup (HEART/TIMI) · OptionCard (classe ECG/conduta · `Tone`) · TimerCard Porta-ECG (`Tone`) · locks (AlertCard critical) |
| **3. Sepse** | Stepper 5 (Triagem · 1ª hora · ATB · Vaso · Metas) · 5 telas · **stepper `warning`** (visitado-incompleto) | ScoreCriterionGroup binary+accordion+horizontal (SOFA/qSOFA/SIRS/NEWS) · ChecklistBlock `Highlight Pending` (bundle) · ClinicalCard `Show Info` (drug-cards vaso) · ToggleField/ToggleTab |
| **4. PCR · parada** | **SEM stepper** — dashboard operacional · T1 pré-iniciar · T2 operando · T3 RCE · T4 salvar | TimerCard `State`×`Size=lg` (compressões/adrenalina · idle→running→cycle-end→window) · ActionTile (ritmo/desfibrilar) · RitmoIcon · BannerContextual (pulse) · **FAB** evento · EventList · HHTTPills · header `audio`/`audio-mute` |
| **5. AVC** | Stepper 5 (Triagem · NIHSS · Elegib. · Dose · Monitor) · 6 telas · **sub-stepper NIHSS 15 itens** dentro da T2 | NIHSS (11 domínios/15 itens · sub-stepper interno) · ChecklistBlock contraindicações · AlertCard janela/dose · cálculo dose trombolítico |

**Por Section, ainda:**
- **Aba Histórico** (idêntica visualmente nos 5): `HistoryScreen` = StepHeader + HistoryView +
  (PatientDetail no caso aberto) + nota LGPD + empty-state.
- **Aba Teoria** (`TheoryScreen`): grade de ClinicalCard plain; **PCR = exceção de conteúdo** ("ACLS|AHA"
  com sub-tabs Panfletos/Cargas-Doses/Via Aérea via Segmented + TETTabela + PanfletoPlaceholder).
- **Overlays** por central: instâncias dos sheets (§3.5) como frames anexos (estado aberto).

### 4.3 Superfícies (matriz) — replicar em cada Section

| Superfície | Frame | Grid | Tema |
|---|---|---|---|
| Mobile Light | 390×844 | 1 col, margem 16 | modo `Light` |
| Mobile Dark | 390×844 | idem | modo `Dark` |
| Web Light | 1440 (shell centrado, app 390–480) | shell centrado, canvas 1440 | modo `Light` |
| Web Dark | 1440 | idem | modo `Dark` |

> "Web white e dark" = Web Light + Web Dark. O app é mobile-shell; na web vive centrado num canvas mais
> largo (ver `--media (max-width:750px)` no código). Documentar a moldura web. Recomendação (§8):
> web/mobile = **frames distintos** (não modo de variável); cor continua em modos Light/Dark.

### 4.4 Documentação por frame
Nome `Central / Tela / Estado` · nota de comportamento (gatilho, gate clínico) · tokens/variáveis usados
· links de protótipo. Conectar a jornada com prototype links/flow arrows para o P.O. navegar.

---

## 5. Plano por fases (checklist de execução)

**Fase 0 — pré-flight (antes de tocar no Figma)**
- [ ] Fluxo dos 5 protocolos aprovado com o cliente.
- [ ] Congelar o esqueleto do shell (`shell-estrutura-5-fluxos.md`) e os steps por central.
- [ ] Resolver decisões pendentes (§7).

**Fase 1 — DS: tokens**
- [ ] Tokenizar hex crus residuais (Button `#7f1d1d`, IconButton dark, Toggle `#ffffff`, ChecklistBlock CC5).
- [ ] Decidir tipografia (Opção 3 do `catalogo` §5) e aplicar como text styles nos componentes da central.
- [ ] Confirmar coleção de cor com modos `Light`/`Dark` cobrindo todas as semânticas usadas pelas centrais.
- [ ] Definir mapeamento `domain`→cor (acento por doença).

**Fase 2 — DS: componentes das centrais (§3)**
- [ ] **Chrome:** `ProtocolShell` (molde), `ProtocolHeader` (Timer Variant + Show Steps + Domain),
  `ProtocolSteps`+`StepItem` (K2), `TabBar` (K6), `ActionFooter` (K5+S12).
- [ ] **Cards/timers:** `TimerCard` (Tone×State×Size — K3), `ClinicalCard` (Show Info S4),
  `AlertCard` (5 Level · vertical S1), `ChecklistBlock` (Highlight Pending S15), `BannerContextual`.
- [ ] **Scores/seleção:** `ScoreCriterionGroup` (3 modos S5), `ScoreResult`, `ScoreRangeTable`/`TETTabela`
  (presets de `Table`), `OptionCard`, `RangeChip`.
- [ ] **PCR/histórico:** `ActionTile` (K4), `RitmoIcon`, `HHTTPills`, `EventList`, `Timeline` (K7),
  `HistoryView`/`PatientDetail` (K8), `PanfletoPlaceholder`, `FAB`.
- [ ] **Sheets:** estender `InfoSheet` (Blocking), `AnnotationSheet` (Show Clear · S2); demais já prontos.
- [ ] Validar contra `?qa=urgencia` + `ds/*Sheets.jsx` como referência visual 1:1.
- [ ] Fechar as entradas K1–K8 / S1–S15 no `figma-sync-ledger.md`.

**Fase 3 — Telas (§4)**
- [ ] Montar 5 Sections (CAD/SCA/Sepse/PCR/AVC), só com instâncias do DS, em Auto Layout/grid.
- [ ] Cada Section: telas do wizard (executar) + Histórico + Teoria + overlays, em ordem de jornada.
- [ ] Aplicar as 4 superfícies (mobile/web × light/dark) via modos de variável + frames web distintos.
- [ ] Documentar cada section/frame; ligar o protótipo (navegação) para o P.O.

**Fase 4 — QA de paridade**
- [ ] Conferir cada componente contra o código (espaçamento por `espaco/*`, tipografia por text style).
- [ ] Conferir dark mode (nenhum hex cru "vazando" no escuro).
- [ ] Conferir o gate clínico do CAD e os estados do TimerCard PCR (vida/morte — não simplificar).
- [ ] Atualizar o `figma-sync-ledger.md` (status → sincronizado).

---

## 6. Riscos

- **Drift de token** se algum componente da central for desenhado com valor cru → quebra o dark mode.
  Mitigação: checklist Fase 4 + lint visual contra `?qa=urgencia`.
- **Escopo grande** (kit code-first inteiro ainda fora do Figma) → fatiar por componente, validar incremental.
- **TimerCard com dois eixos** (`Tone` legado + `State` novo) pode confundir no Figma → modelar a matriz
  e planejar aposentar `Tone`→`State` ao padronizar SCA (decisão §7).
- **Conteúdo clínico** (gate de K, NIHSS 15 itens, ciclos PCR vida/morte) → telas exigem paridade
  verificada contra o `*Flow.jsx`; não simplificar estados.
- **Plataforma web** pouco exercitada no código → validar a moldura web antes de produzir 4 superfícies.

---

## 7. Decisões pendentes (resolver antes da Fase 2)

1. **Tipografia 100% token** — adotar Opção 3 (escala tipográfica completa) do `catalogo` §5 antes de
   portar os componentes? (recomendado, senão a tipografia entra literal e inconsistente).
2. **TimerCard `Tone`×`State`** — modelar ambos no Figma agora e aposentar `Tone` no SCA depois, ou já
   nascer só com `State`? (ledger D: coexistir por ora).
3. **Acento por doença (`Domain`)** — definir o mapa doença→cor de `dominio/` (K1: hook sem cor forçada).
4. **PatientDetail (K8)** — vive dentro de `DetailSheet` (sheet) ou tela cheia no Histórico?
5. **AlertCard** — já resolvido (S1: vertical, Figma estava certo) — só confirmar paridade.
6. **`Radio` átomo vs Radio Option** (ds-issue 1) e **Icon `critico`/`rodape`** (ds-issue 5) — corrigir
   átomos antes de portar AlertCard/ScoreCriterionGroup que os consomem.
7. **Plataforma como dimensão** — web/mobile = **frames distintos** (recomendado) ou modo de variável?
8. **Pediatria (`.modo-pediatrico`)** — vira 3º modo da coleção de cor, coleção à parte, ou fica fora do
   escopo do handoff das centrais?

---

## 8. Veredito

As 5 centrais **já estão portadas para React nativo** com atomização correta e token-first
(cor/spacing/radius 100%), espelhando a hierarquia do Figma — o shell é uniforme e o `ProtocolShell`
compõe tudo. O trabalho concentra-se em **portar o kit code-first** (K1–K8 + extensões Sepse S1–S15,
todos `aberto`/`parcial` no ledger) com as properties da §3, **tokenizar a tipografia** (Opção 3) e os
hex residuais, e **montar 5 Sections de tela** (uma por central, com wizard + Histórico + Teoria +
overlays × 4 superfícies). Seguindo as fases, a passagem é incremental, auditável e sem linguagem
visual paralela.
