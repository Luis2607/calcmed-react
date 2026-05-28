# Catálogo + Auditoria — componentes da padronização (ETAPA 1)

> Revisão pedida pelo Luis (2026-05-27) ANTES dos templates. Cobre: (1) token-compliance,
> (2) component properties, (3) consolidação à la Rafael (o que pode ser o mesmo componente).
> Fonte: leitura direta dos `.module.css`/`.jsx` + golden. Honesto sobre o que NÃO está 100%.

---

## 1. AUDITORIA DE TOKENS (o que pediu: tipografia/spacing/round/cores)

| Componente | Cores | Spacing | Radius | Tipografia |
|---|---|---|---|---|
| StepHeader | ✅ `--ds-*` | ✅ `--esp-*` | — | ⚠️ **literal** (24/700/32/-0.02em · 14/400/20/0.14) |
| OptionCard | ✅ | ✅ | ✅ `--ds-r-md` | ⚠️ **literal** (16/600/24 · 11/600/0.22 · 13/500/18) |
| StatGrid | ✅ | ✅ | ✅ `--ds-r-md` | ⚠️ **literal** (11/600/0.22 · 16/600/24) |
| RangeChip | ✅ | ✅ | ✅ `--radius-input` | ⚠️ **literal** (mono 12/500/18) |
| ActionTile | ✅ | ✅ | ✅ `--ds-r-md`/`--ds-r-sm` | ⚠️ **literal** (14/600/20 · 12/16) |
| ClinicalCard plain | ✅ | ✅ | ✅ | ⚠️ **literal** (16/600) |
| TimerCard 5 estados | ✅ (+ color-mix do token) | ✅ | ✅ | ✅ (herda; sem texto novo) |
| DetailRow | ✅ | ✅ | — | ✅/⚠️ **size via token** (`--fonte-tamanho-corpo`) + weight literal |

**Veredito honesto:**
- **Cores = 100% token** (`--ds-*`/base). Zero hex (grep confirmou; único `#` é comentário). ✅
- **Spacing = 100% token** (`--esp-N`). ✅
- **Radius = 100% token** (`--ds-r-md` 12 / `--ds-r-sm` 8 / `--radius-input`). ✅
- **Tipografia = NÃO é 100% token.** É **literal** na maioria (font-size/weight/line-height/letter-spacing),
  seguindo a convenção dos componentes-irmãos **já existentes** (SectionLabel, ResultDisplay, AlertCard,
  Tag, Input… todos usam literal). **DetailRow** é o único que usa `--fonte-tamanho-*`. ⇒ **inconsistente no DS inteiro**, não só nos novos.

### Por que a tipografia ficou literal — e a decisão pendente
O DS **tem** tokens de tipografia, mas **ninguém usa**:
- Escalares: `--fonte-tamanho-{micro:10, rotulo:11, auxiliar:12, corpo:14, corpo-forte:14, input:16, titulo-sheet:18, numero:28}` — **falta 24 e 13**.
- Composite: `--ds-font-{tit-pag:700 24/32, tit-secao:700 20/28, subtitulo:600 18/24, corpo:400 16/24, corpo-2:400 14/22, badge:600 11/14, rot-campo:500 14/20…}` — **bundla weight+size+line mas NÃO letter-spacing**, e **não cobre** os valores do golden (16/600/24, 13/500/18, 14/400/20, 11/600/0.22…).

⇒ "100% token tipografia" exige **decisão de arquitetura** (3 opções em §5). Não dá pra simplesmente trocar — os tokens atuais não batem com o golden.

---

## 2. COMPONENT PROPERTIES (estão configurados?)

Sim — todos têm props (= component properties; o equivalente React das properties do Figma).
**Nenhum está no Figma ainda** (kit é code-first; sincronizar quando portar). Tabela:

| Componente | Properties (prop:tipo) | Variants | States |
|---|---|---|---|
| StepHeader | title:str* · subtitle:str · onInfo:fn · action:node · as:'h1'\|'h2' | — | título-só / +subtítulo / +info / +ação |
| OptionCard | title* · meta · description · tone:5 · selected:bool · disabled · onClick | tone(default/info/warning/critical/success) | default/hover/selected/disabled |
| StatGrid | items:[{label,value}]* · columns:1-4 | columns | (estático) |
| RangeChip | label · selected · tone:'default'\|'critical' · disabled · onClick | tone | default/hover/selected/sel-critical/disabled |
| ActionTile | icon · label* · value · disabled · onClick | — | default/hover/disabled |
| ClinicalCard | state:3 · **variant:'default'\|'plain'** · tags · title · subtitle · children | state(default/ativo/inativo) × variant(default/plain) | (container) |
| TimerCard | label · value · description · tone:3 · **state:5** · meta · children | tone(primary/critical/warning) + **state(idle/running/cycle-end/window-ok/window-overdue)** | 5 estados |
| DetailRow | label* · value | — | (com/sem divisor) |

⚠️ **Observação Rafael:** TimerCard tem DOIS eixos sobrepostos (`tone` legado + `state` novo) que podem conflitar. Ver §3.

---

## 3. CONSOLIDAÇÃO (Rafael) — "alguns não poderiam ser o mesmo componente?"

A pergunta-chave do Luis: *"se o objetivo é selecionar 1 coisa única, o radio já serve; variante do radio sem radio?"*. Mapeei a **família de seleção** inteira (existentes + novos) por **intenção de uso DE FATO**:

### Mapa da família de SELEÇÃO (a régua anti-redundância)
| Intenção (o que o médico faz) | Componente | Bullet/controle? | Conteúdo |
|---|---|---|---|
| Liga/desliga 1 booleano | **Toggle** | switch | — |
| Sim/Não em lista | **Checkbox** | caixa | label |
| **1 de N, rótulo simples** | **RadioGroup** (card/plain) | **bolinha radio** | label curto |
| N de N, rótulo simples | **CheckboxGroup** | caixa | label curto |
| 1 de 2-3 modos (toggle compacto) | **Segmented** | segmento branco | label curto |
| 1 de N **faixas numéricas** (com perigo) | **RangeChip** 🆕 | borda 2px | número mono + tone critical |
| **1/N cenários/condutas RICOS** (título+meta+descrição+tom) | **OptionCard** 🆕 | borda 2px (sem bullet) | rico |
| Disparar ação (não fica selecionado) | **ActionTile** 🆕 / Button | — | ícone+label+status |

### Vereditos por par sobreposto

**A) OptionCard ↔ RadioGroup (o que o Luis levantou) — MANTER SEPARADO, com fronteira clara.**
- RadioGroup(card) = card + **bolinha radio** + **label simples**. OptionCard = **sem bolinha**, **rico** (título+meta+descrição+tom), seleção pela superfície.
- O **golden separa** os dois: escolha simples (sexo, sim/não) usa radio/`.campo`; escolha de **cenário/conduta** (PPCI vs Fibrinólise, classe de ECG) usa **card rico de superfície** (o `SelectCard` do golden, que OptionCard porta). ⇒ NÃO é redundância: são intenções diferentes.
- **Fronteira (regra):** rótulo simples → **RadioGroup**; cartão com descrição+tom → **OptionCard**. Não usar OptionCard pra label simples (aí o radio serve, como o Luis disse).
- **Opção de unificação (se você quiser ir além):** transformar em UMA família `Selecionavel` com `controle:'radio'|'checkbox'|'nenhum'` + slots ricos. Custo: refatorar RadioGroup/CheckboxGroup (entrincheirados nas calculadoras) → **médio/alto**. **Recomendo NÃO agora** (fronteira por riqueza resolve; unificar depois se aparecer dor real).

**B) StatGrid ↔ DetailRow — MANTER SEPARADO (mesma data, layout/contexto distintos).**
- Mesma forma `{label,value}`, mas StatGrid = **tiles bordeados em grade** (dashboard escaneável, golden `.valor-card`); DetailRow = **linhas planas com divisor** (log/resumo, golden `.detailRow`).
- **Opção:** unir num `KeyValue` com `layout:'grid'|'rows'`. Baixo custo, mas o golden os trata distintos e os contextos são distintos. **Recomendo manter** (clareza > economia de 1 componente); reavaliar se virar dor.

**C) RangeChip ↔ Segmented — MANTER SEPARADO.**
- Ambos "1 de N", mas Segmented = 2-3 modos (pill); RangeChip = N faixas clínicas com **tone critical** (perigo). Golden os separa (`.segmented-control` vs `.faixa-chips`). RangeChip carrega semântica clínica que Segmented não tem. **Recomendo manter.**

**D) TimerCard `tone` × `state` — LIMPAR (dívida real).**
- Hoje TimerCard tem `tone`(primary/critical/warning) **legado (SCA)** + `state`(5, novo PCR). São dois eixos que fazem quase a mesma coisa (cor). **Recomendo:** quando padronizar o SCA (por último), migrar o uso de `tone`→`state` e **aposentar `tone`**, deixando só `state`. Por ora coexistem (aditivo, sem quebrar SCA).

**E) StepHeader / ActionTile / ClinicalCard plain — SEM sobreposição.** Papéis únicos. Manter.

---

## 4. CATÁLOGO — uso real (golden) de cada um

| Componente | Onde é usado DE FATO (golden) |
|---|---|
| StepHeader | `.tela-cabecalho` — topo de **toda tela** de **todo** protocolo (5/5) |
| OptionCard | SCA estratificação/conduta (cenários ricos); ramos de decisão |
| StatGrid | resumos escaneáveis (encerramento/histórico) — golden `.valor-card` em grade |
| RangeChip | CAD seletor de K (`.faixa-chips`); faixas numéricas clínicas |
| ActionTile | PCR `.acoes-row` (Selecionar ritmo / Desfibrilar) |
| ClinicalCard plain | cards de seção neutros (setup/med/conteúdo) em todos os fluxos |
| TimerCard | PCR `.pcr-card` (compressões/adrenalina, 5 estados); SCA porta-ECG |
| DetailRow | log/resumo em tela; detalhe de caso (espelha DetailSheet) |

---

## 5. DECISÃO DE TIPOGRAFIA (precisa do teu aval)

Pra tipografia ser "100% token" (teu pedido), 3 caminhos:

- **Opção 1 — Manter literal (status quo).** Consistente com TODO o DS atual. "100% token" só em cor/spacing/radius. Tipografia documentada como literal-derivado-do-golden. Custo: 0. Contra: tipografia não tokenizada.
- **Opção 2 — Tokenizar SÓ tamanho** (`--fonte-tamanho-*`), como o DetailRow. Precisa **criar `--fonte-tamanho-{13,24}`** (faltam). Weight/line-height/letter-spacing seguem literais. Custo: baixo. Meio-termo.
- **Opção 3 — Escala tipográfica completa (recomendado p/ "100%").** Definir os **type styles do golden como tokens** (`--ds-tipo-titulo-pagina`, `--ds-tipo-card-nome`, `--ds-tipo-card-sub`, `--ds-tipo-tela-sub`, `--ds-tipo-badge`…) bundlando size+weight+line+**letter-spacing**, e aplicar em TODOS os componentes (novos + existentes). Custo: médio (1 task dedicada, shared → blast nas galerias). É o único que entrega tipografia 100% token e **consistente** no DS inteiro.

> Recomendo **Opção 3** como uma microtarefa própria (F0.4 · Escala tipográfica), ANTES dos templates — assim os templates já nascem 100% token. Mas é a tua chamada.

---

## 6. VEREDITO — o que fazer com cada coisa

| Componente | Veredito |
|---|---|
| StepHeader | ✅ manter · tokenizar tipo (Opção 3) |
| OptionCard | ✅ manter (fronteira: rico ≠ RadioGroup simples) · tokenizar tipo |
| StatGrid | ✅ manter (≠ DetailRow por layout/contexto) · tokenizar tipo |
| RangeChip | ✅ manter na família Chip · tokenizar tipo |
| ActionTile | ✅ manter · tokenizar tipo |
| ClinicalCard plain | ✅ manter (variante aditiva) · tokenizar tipo |
| TimerCard | ✅ manter · **aposentar `tone`→`state`** ao padronizar SCA |
| DetailRow | ✅ manter · já usa size token (modelo p/ Opção 3) |

**Nenhum componente é redundante** pela régua de uso real. As 2 dívidas a resolver: **tipografia (Opção 3)** e **TimerCard tone→state** (no SCA, por último).

---

## Próximos passos sugeridos (ordem)
1. **Decidir tipografia** (§5) → se Opção 3, fazer **F0.4 Escala tipográfica** (shared, validar galerias).
2. Confirmar os vereditos de consolidação (§3).
3. Só então **ETAPA 3 — templates** (ProtocolShell/HistoryScreen/TheoryScreen), já 100% token.
