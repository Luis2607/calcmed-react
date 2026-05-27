# Auditoria de Componentização — Central de Urgência

Data: 2026-05-26 · Tipo: auditoria profunda somente-leitura do protótipo React (`calcmed-react`).
Escopo: `src/features/**` + uso dos componentes em `src/shared/components/**`.
Restrição: auditoria 100% sobre CÓDIGO (Figma MCP não usada). Nenhum componente/tela alterado.

> Complementa `docs/componentizacao-status.md` (vivo) com evidência arquivo-a-arquivo, contagens e um backlog priorizado. Onde há divergência de número, este doc traz a contagem bruta do código.

---

## 1. Sumário executivo

### Realidade do roteamento (App.jsx)
Apenas **CAD** é tela nativa React de ponta a ponta. **SCA, Sepse, PCR e AVC** renderizam via `GoldenProtocolFrame` — um `<iframe>` apontando para o HTML legado (`/golden/src/protocolos/<id>/<id>.html`, ver `src/data/protocols.js`). Confirmado em `App.jsx:71-73` (`activeProtocol && activeProtocol.id !== 'cad' → GoldenProtocolFrame`) e nos `phase` de `protocols.js` (CAD = `inProgress`; sepse/pcr/avc/sca = `queued`).

> Nota: a pasta `golden/` **não existe** localmente (nem em `public/` nem em `dist/`). Os iframes carregam um caminho legado externo. Os 4 protocolos não estão portados — estão "emoldurados".

### % aproximado de componentização por fluxo

| Fluxo | Arquivo(s) | Estado | Componentização (telas) |
|---|---|---|---|
| **CAD** | `features/cad/CADFlow.jsx` (654 ln) | React nativo | **~60%** — usa DS para inputs/botões/alerts/header/stepper/sheets, mas o "chrome" das telas (cards, picker de K, botão "?", linhas de log/resumo, card de timer) é inline reinventado |
| **SCA** | iframe golden + `features/ds/ScaSheets.jsx` (gallery) | iframe legado | **~0%** da tela; bottomsheets reproduzidos só na galeria |
| **Sepse** | iframe golden + `features/ds/SepseSheets.jsx` | iframe legado | **~0%** da tela; sheets só na galeria |
| **PCR** | iframe golden + `features/ds/PcrSheets.jsx` | iframe legado | **~0%** da tela; sheets só na galeria |
| **AVC** | iframe golden + `features/ds/AvcSheets.jsx` | iframe legado | **~0%** da tela; sheets só na galeria |
| **Home** | `features/home/Home.jsx` (239 ln) + `Home.module.css` | React nativo (CSS module) | **~70%** estrutura própria via CSS module; reinventa Segmented/Chip/InfoButton/TabBar/Card que existem no DS |
| **Hub** | `features/hub/HubHome.jsx` (123 ln) + `HubHome.module.css` | React nativo (CSS module) | **~80%** usa SectionLabel + HistoryView; reinventa Toggle (switch cru) e cards de protocolo/ativo |

### Top-5 de maior impacto
1. **Portar SCA/Sepse/PCR/AVC do golden para React** (4 fluxos em iframe) — maior gap absoluto de componentização da Central. Os bottomsheets já estão prontos como insumo (`ds/*Sheets.jsx`). Esforço L cada, multi-sessão, clínico.
2. **Extrair `ClinicalCard` / um wrapper de "card de seção" no CADFlow** — há **≥6 cards montados à mão** com `style={{ backgroundColor:'var(--ds-fundo-cartao)', border, borderRadius:'12px', padding:'16px' }}` repetidos.
3. **Trocar o botão "?" inline do CADFlow por `InfoButton`** (atom já existe) — `CADFlow.jsx:277-292`.
4. **Trocar o picker de Potássio inline (`<button>` que abre SelectSheet) por um trigger DS** (Select/SelectTrigger) — `CADFlow.jsx:295-324`.
5. **Substituir o switch cru do HubHome por `Toggle`** (atom existe) — `HubHome.jsx:81-91`.

### Inventário do DS (lido em `src/shared/components/`)
- **atoms/**: Button, IconButton, Icon, Checkbox, Radio, Toggle, InfoButton, SectionLabel.
- **molecules/**: InputField, Textarea, Select, Segmented, RadioGroup, CheckboxGroup, Tag, Chip, DividerOu, DisclosureCard, ScoreResult, ScoreRangeTable, ResultDisplay, Stepper, ProtocolSteps, ToggleField, ToggleTab, CarouselDots, Toast, sheet/* (14 sub-blocos).
  - ⚠️ Não encontrei `UnitChip` nem `DoseDisplay` como esperado pelo briefing: existe `DoseDisplay/` mas **NÃO** existe pasta `UnitChip/`. ❓ a confirmar se `UnitChip` foi planejado e não criado, ou renomeado em `Chip`.
- **organisms/**: AlertCard, ClinicalCard, ChecklistBlock, ProtocolHeader, HistoryView, ScoreActions.
- **overlays/**: BottomSheet + patterns (ActionSheet, AnnotationSheet, ChecklistSheet, ConfirmSheet, DetailSheet, FormSheet, InfoSheet, SelectSheet, ToolSheet).
- **layout/**: GoldenProtocolFrame.

---

## 2. Tabela por feature/arquivo

Contagens via grep no código (`style={{`, `#hex`, `px`). "Reinventado" = padrão para o qual já existe componente DS.

| Arquivo | Nativo/iframe | `style={{` inline | Hardcodes notáveis | DS que deveria usar | Gap principal |
|---|---|---|---|---|
| `features/cad/CADFlow.jsx` | **React nativo** | **39** | **0 hex** (todo inline usa tokens `--ds-*`/`--retorno-*`); **54 px literais** (`12px`,`16px`,`24px`,`48px`,`999px`,`24px`…) | `ClinicalCard`/wrapper de card, `InfoButton`, `Select`(trigger), `DoseDisplay`/`ResultDisplay` para linhas de log, `Tag`/`Chip` para metadados | Chrome das telas T1–T6 é layout inline reinventado; px cravados em vez de tokens `--esp-N` |
| `features/cad/hooks/useCADState.js` | hook | 0 | — | — | OK (lógica, não UI) |
| `features/home/Home.jsx` | React nativo (CSS module) | 3 (todos `style={{color: …}}`, 1 com hex de dado `cat.color`) | hex em `CATEGORIES[].color` (`#3b82f6`,`#f97316`,`#a855f7`,`#06b6d4`,`#6366f1`) = dados de ícone, não estilo de layout | `Segmented` (segTab Adulto/Pediatra), `Chip` (chips de urgência), `InfoButton` (`styles.infoButton` cru), TabBar (navbar) → ❓ sem componente DS de navbar | Reimplementa segmented/chip/infobutton/tabbar/featcard como CSS module próprio em vez do DS |
| `features/hub/HubHome.jsx` | React nativo (CSS module) | 0 | — | `Toggle` (switch `<input type=checkbox>` cru, `HubHome.jsx:81-91`); cards de protocolo/ativo poderiam virar `ClinicalCard`/lista DS | Switch reinventado; cards de protocolo à mão |
| `shared/components/layout/GoldenProtocolFrame.jsx` | wrapper de iframe | 0 | caminho legado `/golden/...` | — | É o "buraco": 4 protocolos não portados |
| `features/ds/ScaSheets.jsx` (245 ln) | gallery demo | varia | — | já usa DS limpo (BottomSheet patterns + sheet/*) | **Não é tela** — só demo na galeria; insumo para o port de SCA |
| `features/ds/SepseSheets.jsx` (100) | gallery demo | — | — | DS limpo | insumo port Sepse |
| `features/ds/PcrSheets.jsx` (116) | gallery demo | — | — | DS limpo | insumo port PCR |
| `features/ds/AvcSheets.jsx` (86) | gallery demo | — | — | DS limpo | insumo port AVC |
| `features/ds/CadSheets.jsx` (129) | gallery demo | — | — | DS limpo | sheets do CAD que ainda não estão plugados no fluxo vivo |
| `features/ds/*Gallery.jsx` (Buttons 42, Input 13, Clinical 9, Controls 7, Tags 6, Alert 5…) | páginas de QA do DS | altos (esperado em galeria) | ButtonsGallery: 10 hex, 45 px (showcase) | — | São galerias de QA; estilo inline é aceitável/esperado. **Fora do escopo de "tela de produção"** |

### Detalhe das ocorrências inline no CADFlow (evidência)
Reinvenções de UI dentro de `CADFlow.jsx` (todas com tokens, mas sem componente):
- **Card de seção (≥6×)**: `style={{ backgroundColor:'var(--ds-fundo-cartao)', border:'1.5px solid var(--ds-borda-sutil)', borderRadius:'12px', padding:'16px' }}` → linhas ~210, ~264, ~376, ~431, ~518, ~565.
- **Botão "?" cru** (`CADFlow.jsx:277-292`): círculo 24×24, `borderRadius:'999px'`, abre `gateInfoOpen`. Já existe **`InfoButton`**.
- **Picker de Potássio** (`CADFlow.jsx:295-324`): `<button>` full-width que abre `SelectSheet`. Deveria ser um trigger DS (Select/SelectTrigger) ou um `FieldRow`/`DetailRow` padronizado.
- **Card do timer de reavaliação** (`CADFlow.jsx:431-448`): número 48px mono à mão → candidato a `DoseDisplay`/`ResultDisplay` (variante "timer") ou novo `TimerDisplay`.
- **Linhas de log de medidas** (`CADFlow.jsx:452-473`) e **linhas do resumo** (`CADFlow.jsx:565-586`): padrão `label esquerda / valor direita` repetido → candidato a `SheetDetailRow`/novo `DetailRow` de tela.
- **Botão dev "⚡ Pular Tempo"** (`CADFlow.jsx:414-428`): inline com `--ds-retorno-atencao*`. Dev-tool; baixa prioridade (manter ou esconder atrás de flag).

---

## 3. Backlog priorizado de componentização (microtarefas)

Ordenado por impacto/segurança. **Aditivo/cosmético primeiro; port clínico por último** (risco de dose). Esforço S/M/L. ⚠️ = toca código clínico, exige paridade verificada.

| # | Tarefa | Componente DS | Arquivos afetados | Esforço | Risco regressão |
|---|---|---|---|---|---|
| 1 | Trocar botão "?" cru por `InfoButton` no card de K | `InfoButton` (atom existe) | `CADFlow.jsx:277-292` | S | Baixo (cosmético, mesmo handler) |
| 2 | Trocar switch cru do Hub por `Toggle` | `Toggle` (atom existe) | `HubHome.jsx:81-91` (+ remover CSS `.switch*` do `HubHome.module.css`) | S | Baixo |
| 3 | Extrair wrapper "card de seção" (`SectionCard`/`ClinicalCard` variante "plain") e aplicar nos ≥6 cards inline do CAD | `ClinicalCard` (existe) ou nova variante | `CADFlow.jsx` (~210,264,376,431,518,565); criação fica para o agente do DS | M | Médio (layout) — visual idêntico exige diff de tokens |
| 4 | Substituir px literais por tokens `--esp-N` nas margens/paddings inline do CAD | tokens (`--esp-*`) | `CADFlow.jsx` (54 px literais) | M | Baixo (1:1 com escala 4px) |
| 5 | Padronizar picker de Potássio como trigger DS (Select/SelectTrigger) | `Select`/novo `FieldTrigger` | `CADFlow.jsx:264-325` | M | Médio (mantém SelectSheet) |
| 6 | Padronizar linhas de log + resumo como `DetailRow` de tela | `SheetDetailRow` ou novo `DetailRow` | `CADFlow.jsx:452-473`, `565-586` | S/M | Baixo |
| 7 | Home: trocar segmented Adulto/Pediatra por `Segmented` | `Segmented` (molecule existe) | `Home.jsx:100-110`, `Home.module.css` | M | Médio (Home é CSS-module coeso) |
| 8 | Home: trocar chips de urgência por `Chip` e infoButton por `InfoButton` | `Chip`, `InfoButton` | `Home.jsx:120-133, 169-171` | M | Médio |
| 9 | Plugar sheets restantes do CAD (anotação/histórico/infos/reset) no fluxo vivo | patterns já prontos em `ds/CadSheets.jsx` | `CADFlow.jsx` + `CadSheets.jsx` | M | Médio |
| 10 | ⚠️ **Portar AVC** do golden → React (NIHSS, janela, contraindicações, dose trombolítico) | Header/Stepper/AlertCard/sheets de `AvcSheets.jsx` | nova `features/avc/`, `App.jsx`, `protocols.js` | L | **Alto (clínico)** |
| 11 | ⚠️ **Portar Sepse** (bundle, SOFA/qSOFA, vasopressor, timers) | DS + `SepseSheets.jsx` | nova `features/sepse/`, `App.jsx` | L | **Alto** |
| 12 | ⚠️ **Portar SCA** (Sgarbossa, P2Y12, classificação ECG, reperfusão, timers) | DS + `ScaSheets.jsx` | nova `features/sca/`, `App.jsx` | L | **Alto** |
| 13 | ⚠️ **Portar PCR** (ciclos, adrenalina/desfibrilação, timers, RCE) | DS + `PcrSheets.jsx` | nova `features/pcr/`, `App.jsx` | L | **Alto** (override regras gerais — vida/morte) |
| 14 | Limpar CSS morto `.backBar/.backButton/.backTitle` em `GoldenProtocolFrame.module.css` | — | `GoldenProtocolFrame.module.css` | S | Nulo |

> Observação de consistência de chrome: após o port, os 5 protocolos devem compartilhar `ProtocolHeader` + `ProtocolSteps` + footer/CTA padrão. Hoje só o CAD usa esses organismos; os 4 em iframe usam o header/stepper do HTML legado, então **não há consistência verificável entre os 5 protocolos** até o port acontecer.

---

## 4. Componentes DS que ainda FALTAM criar (padrão em 3+ telas sem componente)

> Criação NÃO executada (escopo read-only + outro agente trabalha no DS). Lista para o backlog do DS.

1. **`SectionCard` / `ClinicalCard` variante "plain"** — card neutro (fundo-cartao + borda-sutil + r12 + pad16) repetido ≥6× só no CAD; será usado em todos os ports. Hoje montado inline.
2. **`FieldTrigger` / `SelectTrigger`** — botão full-width "abrir sheet" (label + chevron `›`). Usado no picker de K (CAD) e aparecerá em SCA/Sepse/AVC (seleção via SelectSheet). Hoje inline.
3. **`TimerDisplay`** — bloco de cronômetro/contagem regressiva (número grande mono + legenda). CAD tem 1 (`getTimerString`); SCA/Sepse/PCR têm timers no golden → ≥4 telas. ❓ avaliar se vira variante de `ResultDisplay`/`DoseDisplay`.
4. **`DetailRow` (de tela, não-sheet)** — linha `rótulo / valor`. Log de medidas + resumo no CAD; resumos/encerramento em todos os protocolos. Existe `SheetDetailRow` (escopo sheet) — avaliar promover/generalizar.
5. **Navbar / TabBar** — barra inferior de 5 abas. Existe inline em `Home.jsx` (`styles.tabBar`). ❓ a confirmar se há intenção de componente DS de navegação global.
6. **`FeatureCard` / `CategoryCard`** — cards de listagem da Home (abbr + nome + bookmark/status). Hoje função local em `Home.jsx`. Candidato a molecule se reusado fora da Home.
7. ❓ **`UnitChip`** — citado no briefing mas pasta inexistente em `molecules/`. Confirmar status.

---

## 5. Riscos — o que NÃO mexer sem cuidado

- **Fluxos clínicos (CAD nativo + os 4 golden)**: qualquer port/refactor de SCA/Sepse/PCR/AVC e do CAD envolve dose, gates de segurança (ex.: gate de Potássio bloqueando insulina, `CADFlow.jsx:327-348`) e timers. Exige **paridade verificada tela-a-tela contra o golden** antes de substituir o iframe. Não rushar.
- **Componentes compartilhados em `src/shared/components/**`**: outro agente está escrevendo aí. Mudar atom/molecule propaga para todas as galerias e para o CAD. Tarefas 1–9 deste backlog **consomem** o DS; a criação dos componentes da seção 4 é do agente do DS.
- **Hex hardcoded em DS compartilhado (não editar aqui — só registrar)**: encontrados valores crus que podem quebrar dark mode / tokenização:
  - `atoms/Button/Button.module.css:51` → `#7f1d1d`.
  - `atoms/Button/IconButton.module.css:120-157` → bloco dark mode inteiro com hex crus (`#0096B7`,`#223249`,`#2A3F5F`,`#EF4444`,`#00B4D8`,`#64748B`…).
  - `atoms/Toggle/Toggle.module.css:44` → `#ffffff`.
  - `organisms/ChecklistBlock/ChecklistBlock.module.css:28` → `#F43F5E` (contador, já anotado no ledger CC5).
  - Vários comentários `/* Figma … #XXXXXX */` que são documentação, não estilo (Segmented/Select/Textarea/ToggleTab) — OK.
  Esses são do escopo do agente do DS; listados como achado, **não** como tarefa minha.
- **`GoldenProtocolFrame` + `data/protocols.js`**: trocar o iframe pelo React muda roteamento em `App.jsx`. Mexer com cuidado para não quebrar o fallback do golden enquanto o port não está validado.
- **Galerias `features/ds/*Gallery.jsx`**: estilo inline alto é esperado (QA/showcase). **Não tratar como dívida de tela de produção.**

---

## 6. Notas de verificação
- `App.jsx`, `protocols.js`, `GoldenProtocolFrame.jsx`, `CADFlow.jsx`, `Home.jsx`, `HubHome.jsx`, `ScaSheets.jsx` lidos integralmente (ou trecho representativo).
- Contagens `style={{`/hex/px obtidas por grep no código em 2026-05-26.
- `golden/` ausente localmente: iframes apontam para caminho legado externo (`/golden/...`). ❓ confirmar onde o HTML validado é servido em produção.
- `UnitChip` ausente no DS apesar de citado no briefing — ❓ a confirmar.
