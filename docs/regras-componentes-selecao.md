# Regras de uso dos componentes do DS — seleção, agrupamento, entrada e saída

> **Status:** PROPOSTA v2 · pendente aprovação Luis. Quando aprovado, vira o gate de toda decisão
> de UI nos ports (Sepse → AVC → PCR) e na padronização de CAD/SCA/Home/Hub. Antes de codar
> cada feature, cito aqui a regra que estou aplicando.
>
> **Conselho consultado:** Lia (UX writer) · Rafael (DS) · Gabriela (UI) · Bruno (PO/KPI) ·
> **Jakob Nielsen** (10 heurísticas — aplicadas explicitamente em cada decisão).

## Princípio mestre — "1 componente, 1 intent"

> Nielsen #4 (Consistency & Standards): mesmo intent → mesmo componente, sempre. Dois componentes
> diferentes resolvendo o mesmo problema = ruído cognitivo para o médico em estresse.

Cada componente do DS tem **um intent único**. Se você está em dúvida entre dois → ou um dos
dois está sobrando, ou seu caso de uso pertence a um terceiro intent não coberto. Não inventar
variante sem aprovação.

---

## Catálogo · seleção EXCLUSIVA (single-select)

| Componente | Intent ÚNICO | Quando usar | Heurística Jakob |
|---|---|---|---|
| **Toggle** (atom) | Estado binário on/off **com default** (modo persistente) | Pediatria, Dark mode, "IMC ≥ 30 mostra peso ajustado". | #5 prevenção (default seguro) |
| **Segmented** (2 segs) | Alternativa binária **simétrica** (igualmente válidas, sem default lógico) | Sexo (Masc/Fem). Nunca >3 segs. | #4 consistency (padrão pill) |
| **ToggleTab** | Sub-tabs **dentro de uma tela** (comuta o CONTEÚDO ABAIXO) | Score sub-tabs SIRS/NEWS/MEWS/SOFA. PCR aba interna se houver. 2–5 tabs horizontais. | #1 visibility of status (qual escore tô usando, sempre visível) |
| **RadioGroup card** (columns 1 ou 2) | Seleção de **VALOR simples** (só label, sem descrição clínica importante). 2–4 opções. | Hoje vazio na Sepse após esta proposta. Casos: "tipo de via" se vier sem descrição. | #4 padrão de form |
| **OptionCard** (1 ou 2 col) | Seleção de **CENÁRIO/CONDUTA** (com descrição auxiliar). 2–6 opções. | Veredito (4 cenários clínicos), Foco infeccioso (6 focos com descrição). | #2 match real world · #6 recognition not recall |
| **RangeChip** (família Chip) | Faixas numéricas **mutuamente exclusivas com criticidade** (uma faixa é a perigosa) | Potássio CAD (<3,5 / 3,5–5,5 / >5,5). | #5 prevenção (faixa crítica destaca) |
| **Select** + SelectSheet | Dropdown **discreto** quando NÃO há espaço pra cards e a escolha é secundária | NEWS versão (NEWS2/NEWS legacy). Settings em geral. | #8 minimalist |
| **TabBar** (organism do shell) | **3 tabs FIXAS** do shell, bottom navigation | Executar/Histórico/Teoria. **NUNCA usar dentro de tela.** | #4 consistency (padrão mobile) |

### Árvore de decisão · seleção exclusiva

```
Quantas opções?
├─ 2 opções binárias com default → Toggle
├─ 2 opções simétricas sem default → Segmented (2 segs)
├─ 2-5 opções que comutam VIEW abaixo → ToggleTab
├─ Faixas numéricas com 1 perigosa → RangeChip
├─ Escolha discreta sem espaço de tela → Select + SelectSheet
├─ Opções com DESCRIÇÃO clínica importante (≤6) → OptionCard
└─ Opções só com label simples (≤4) → RadioGroup card
```

---

## Catálogo · seleção MÚLTIPLA

| Componente | Intent ÚNICO | Quando usar |
|---|---|---|
| **Checkbox** (atom) | Item isolado (uso dentro de outro componente). | Não usar solto em tela. |
| **CheckboxGroup card** | Lista plana de fatores (sem ceremônia, sem contador, sem header forte). | Risco MRSA · 5 fatores. Risco MDR · 5 fatores. |
| **ChecklistBlock** | Lista de "completar" com **header tag + contador + opcional info**. Ceremônia clínica. | Bundle 1ª linha (4/4), Acompanhamento (5/5), Metas (5/5), ICU (6/6). |
| **ScoreCriterion** type=checkbox | Critério de **score** com pontos visíveis ("+N pts" por linha). Vive no score subsystem. | SIRS 4 critérios (+1 cada). NEWS O₂ suplementar (+2). |

### Árvore de decisão · multi-select

```
É parte de um SCORE com pontos? → ScoreCriterion type=checkbox
É um BUNDLE/CHECKLIST com tag e contador? → ChecklistBlock
É uma LISTA PLANA de fatores? → CheckboxGroup card
```

---

## Catálogo · ENTRADA de dados

| Componente | Intent ÚNICO |
|---|---|
| **InputField** | Texto/numérico livre. Default. |
| **Stepper** | Inteiros pequenos discretos (cargas PCR, contadores). |
| **Textarea** | Texto longo inline. |
| **SheetTextarea** | Textarea dentro de sheet (AnnotationSheet). |
| **ToggleField** | Linha "label + Toggle" alinhada (golden `.toggle-row`). |

---

## Catálogo · SAÍDA / resultado

| Componente | Intent ÚNICO |
|---|---|
| **ResultDisplay** | Resultado de calculadora com level (success/warning/critical). |
| **DoseDisplay** | Dose inline grande (mono teal 32) + unidade + via. **Sem card.** |
| **ScoreResult** | Resultado de score com risk band (baixo/moderado/alto). |
| **ScoreRangeTable** | Tabela de **interpretação por faixa** abaixo do ScoreResult. |
| **AlertCard** | Alerta/aviso (info/critical/warning/result/footnote). Pode embutir `showValue`. |
| **StatGrid** | Resumo escaneável (2–4 tiles label/value compactos). |
| **DetailRow** | Linha rótulo/valor. Standalone ou em grupo. |
| **TimerCard** | Cronômetro grande (PCR). |
| **Timeline** | Linha do tempo de eventos. |

### Diferenças críticas

- **DoseDisplay** ≠ **AlertCard level=result** ≠ **ResultDisplay**:
  - DoseDisplay = dose INLINE (sem card), foco no NÚMERO mono teal grande. Prescrição.
  - AlertCard result = aviso de RESULTADO confirmado (com ícone check). Pode ter showValue.
  - ResultDisplay = saída de CALCULADORA com level semântico (success → resultado calculado).

---

## Catálogo · CONTAINER

| Componente | Intent ÚNICO |
|---|---|
| **ClinicalCard** (default, state=ativo/inativo) | Drug-card, painel ativável. |
| **ClinicalCard** variant=plain | Container neutro de seção/sub-bloco (golden `.exame-card`). |
| **ChecklistBlock** | JÁ é um card. Não envelopar. |
| **AlertCard** | JÁ é um card. Não envelopar. |
| **DisclosureCard** | Linha clicável (não envelopar). |
| **Timeline** | JÁ é um card. |
| **PatientDetail** | JÁ é um card de detalhe. |

### Regra de agrupamento (envelopar em ClinicalCard plain)

> Nielsen #4 (consistency) + #8 (minimalist): só envelopa quando há COESÃO clínica.

**Envelopa quando:** múltiplas partes formam UMA peça clínica coesa (header + N inputs/critérios
+ um output em sequência lógica). Ex.:
- Subsistema de escore (sub-tabs + descritor + critérios + ScoreResult + interpretação).
- Card de droga vasopressor (header + input dose + prescrição + próximo passo).
- Bloco IMC obeso (toggle + sexo + altura + peso ajustado).

**NÃO envelopa:**
- Item solto (InputField sozinho, AlertCard sozinho).
- Componente que já é card (ChecklistBlock, AlertCard, DisclosureCard, Timeline, PatientDetail).

### Espaçamento (governance bíblia)

- Entre **seções** (envelopes ou blocos top-level): `--esp-6` (24px).
- Dentro de **uma seção**: `--esp-4` (16px).
- Dentro de **um agrupamento**: `--esp-3` (12px) ou `--esp-2` (8px) — escolha conforme densidade.

---

## Catálogo · AÇÕES

| Componente | Intent ÚNICO |
|---|---|
| **Button** | CTA padrão (primary/secondary/danger/fantasma). |
| **IconButton** | Botão só com ícone (header actions, X close). |
| **InfoButton** | "?" — abre teoria/info. Recorrente em títulos e linhas. |
| **ActionTile** | Tile rico em grade (PCR — ritmo, desfibrilar). |
| **ActionFooter** | Footer sticky com primary CTA + hint. |
| **ScoreActions** | Linha de ações sob ScoreResult (Copiar/Compartilhar). |

---

## Catálogo · SHEET (overlays/patterns)

| Componente | Intent ÚNICO |
|---|---|
| **InfoSheet** | Teoria/explicação/microcopy (footer "Entendi"). |
| **SelectSheet** | Lista de opções single-select. |
| **ConfirmSheet** | Confirmar (com perigo opcional). |
| **FormSheet** | Input rápido (1–2 campos). |
| **AnnotationSheet** | Textarea de anotação (Salvar + Limpar opcional). |
| **ActionSheet** | Lista de ações (excluir, compartilhar). |
| **DetailSheet** | Detalhe rico (caso, paciente). |
| **ChecklistSheet** | Lista de checklist em sheet. |

---

## Aplicação na SEPSE · auditoria item a item (cita a regra)

### T1 · Triagem

| # | Bloco | Componente | Regra |
|---|---|---|---|
| 1.1 | Wrapper visual do subsistema escore | **ClinicalCard variant=plain** | Agrupamento (header + N + output = coeso) |
| 1.2 | Sub-tabs SIRS/NEWS/MEWS/SOFA | **ToggleTab × 4 horizontais** ⚠️ MUDANÇA vs hoje | Intent "comuta VIEW" → ToggleTab, não RadioGroup card. Heurística #1 (visibility) + #4 (consistency com sub-tab universal) |
| 1.3 | Descritor do escore + InfoButton | AlertCard info + InfoButton | Saída de aviso + recurso de info recorrente |
| 1.4 | NEWS versão NEWS2/NEWS | **Select + SelectSheet** | Escolha discreta secundária, sem espaço pra cards. Heurística #8 |
| 1.5 | NEWS · O₂ suplementar (binário +2) | **ScoreCriterion type=checkbox**, INLINE no GRUPO NEWS (junto com critérios, antes dos accordions) ⚠️ MUDANÇA: hoje está "solto" entre Select e accordion | Intent "critério score com pontos" → ScoreCriterion. Agrupamento: pertence ao grupo NEWS, não fica órfão. Heurística #4 |
| 1.6 | NEWS/MEWS/SOFA multi-nível | **ScoreCriterionGroup** (accordion) | Intent "critério com múltiplos níveis" |
| 1.7 | SIRS · 4 critérios | **ScoreCriterion type=checkbox × 4** | Idem 1.5 |
| 1.8 | ScoreResult | **ScoreResult** | Intent "resultado de score" |
| 1.9 | Interpretação por faixa | **ScoreRangeTable** | Intent "tabela de interpretação" |
| 1.10 | Alerta "Sepse é diagnóstico clínico" | **AlertCard level=critical** | Saída de alerta crítico |
| 1.11 | Veredito (4 opções com ramo clínico diferente) | **OptionCard 1 col com descrição** ⚠️ MUDANÇA vs hoje (RadioGroup 2-col) | Intent "cenário/conduta com descrição clínica importante" → OptionCard. Heurística #2 (match) + #6 (recognition). Resolve "texto quebra em 2 linhas" no 2-col |
| 1.12 | InfoButton no título da tela | **InfoButton** via `StepHeader.onInfo` | Recurso recorrente |

### T2 · Bundle 1ª hora

| # | Bloco | Componente | Regra |
|---|---|---|---|
| 2.1 | Idade + Peso | InputField mono × 2 | Entrada numérica livre |
| 2.2 | IMC ≥ 30 | **ToggleField** ⚠️ vs Toggle solto hoje | Intent "linha label+toggle inline" |
| 2.3 | Sexo (Masc/Fem) | Segmented 2 segs | Alternativa simétrica binária |
| 2.4 | Altura | InputField mono | Entrada numérica |
| 2.5 | Peso ajustado | DetailRow | Saída rótulo/valor |
| 2.6 | ATB realizado | **Integrado no item ATB do ChecklistBlock** ⚠️ vs Button separado hoje | Bom senso golden 1:1. ChecklistBlock item clicado = marca + registra hora |
| 2.7 | Bundle 1ª linha (4 items) | ChecklistBlock tag=crítico count=n/4 | Intent "checklist com tag+counter" |
| 2.8 | Volume cristaloide | AlertCard level=result showValue | Saída de aviso com valor |
| 2.9 | Bundle Acompanhamento (5 items) | ChecklistBlock tag=novo count=n/5 | Idem 2.7 |
| 2.10 | Progress bar 0/9 | **Inline tokenizado** (não criar componente sem 2º consumidor) | Decisão prévia Luis |
| 2.11 | Nota PAM ≥65 | AlertCard info | Saída de aviso info |
| 2.12 | InfoButton título | InfoButton via StepHeader.onInfo | Recurso recorrente |

### T3 · ATB

| # | Bloco | Componente | Regra |
|---|---|---|---|
| 3.1 | Foco infeccioso (6 cards com descrição) | **OptionCard 2-col com descrição** | Intent "cenário/conduta com descrição" — 6 focos com texto explicativo |
| 3.2 | Risco MRSA (5 fatores) | **CheckboxGroup card** + contador | Intent "lista plana de fatores" (sem ceremônia de bundle) |
| 3.3 | Risco MDR (5 fatores) | CheckboxGroup card + contador | Idem 3.2 |
| 3.4 | Esquema empírico | ClinicalCard plain + DetailRow × drogas | Agrupamento "esquema = título + drogas" |
| 3.5 | +Vanco / +Pip-tazo condicionais | ClinicalCard plain + tags | Idem 3.4 (cards condicionais) |
| 3.6 | Alert CCIH | AlertCard warning | Saída de aviso |
| 3.7 | InfoButton título | InfoButton via StepHeader.onInfo | |

### T4 · Vasopressores

| # | Bloco | Componente | Regra |
|---|---|---|---|
| 4.1 | Drug card (5 drogas) | ClinicalCard state=ativo/inativo | Intent "container ativável" |
| 4.2 | "+ Iniciar" | Button variant=secondary | CTA padrão |
| 4.3 | Input dose | InputField mono unit=mcg/kg/min | Entrada numérica |
| 4.4 | Prescrição (vazão grande) | **DoseDisplay** value=vazão unit=mL/h via=preparo ⚠️ vs AlertCard texto hoje | Intent "dose inline grande" — peso visual no número |
| 4.5 | Próximo passo NE | AlertCard info | Aviso |
| 4.6 | Vasopressina/Hidrocortisona fixas | DoseDisplay | Idem 4.4 |
| 4.7 | InfoButtons | InfoButton | Recurso recorrente |

### T5 · Metas

| # | Bloco | Componente | Regra |
|---|---|---|---|
| 5.1 | Metas (5) | ChecklistBlock tag=novo count=n/5 | Intent "checklist" |
| 5.2 | ICU (6) | ChecklistBlock tag=novo count=n/6 | Idem |
| 5.3 | Nota "Remoção ativa" | AlertCard info | Aviso |
| 5.4 | InfoButton | via ChecklistBlock.onInfo | |

### Histórico

| # | Bloco | Componente | Regra |
|---|---|---|---|
| H.1 | Lista de casos | HistoryView com `onCaseClick` | Intent "lista clivável" (DS.2 aprovado) |
| H.2 | Detalhe ao clicar | **PatientDetail + Timeline + StatGrid + DetailRow** dentro de **DetailSheet** | Intent "detalhe rico em sheet" |
| H.3 | Excluir caso | Button danger + **ConfirmSheet** (perigo) + Toast "Removido" | Intent "ação destrutiva confirmada" |
| H.4 | Compartilhar caso | Button + Toast "Copiado" | Intent "feedback efêmero" |
| H.5 | Encerrar (iniciais) | FormSheet + InputField | Intent "input rápido em sheet" |
| H.6 | Toast "Caso arquivado" | Toast | Feedback efêmero |

### Header / Anotação / Modais

| # | Bloco | Componente | Regra |
|---|---|---|---|
| M.1 | Header | ProtocolHeader subtitle "Aberto há HH:MM" | OK |
| M.2 | Chips | idade/peso/Sepse/Bundle% | OK |
| M.3 | Anotar (com active badge) | actions[].active=!!anotacao.trim() | OK |
| M.4 | Anotar sheet | **AnnotationSheet** com `onClear` (DS.1) | OK |
| M.5 | Sair confirmar | ConfirmSheet | OK |
| M.6 | Modais info/teoria | InfoSheet + SepseModalBody | OK |

---

## Decisões críticas que esta proposta TROCA na T1 já portada

| Item | Hoje (commit b744e45) | Proposta v2 | Por quê |
|---|---|---|---|
| Sub-tabs SIRS/NEWS/MEWS/SOFA | RadioGroup card columns=2 | **ToggleTab × 4 horizontais** | Tabs comutam VIEW, não selecionam VALOR. Heurística #4 (padrão sub-tab universal). RadioGroup vira do veredito (1.11) — sem repetição na tela |
| O₂ suplementar | ScoreCriterion CHECKBOX fora de grupo, entre Select e accordions | ScoreCriterion checkbox **DENTRO da lista de critérios NEWS**, antes dos accordions | Resolve "parece solto". Pertence ao grupo NEWS conceitualmente |
| Veredito | RadioGroup card columns=2 | **OptionCard 1 col com descrição do ramo clínico** | Texto quebra em 2-col. 4 opções com conduta diferente cada → mostrar a conduta (recognition, não recall) |

---

## Lacunas que esta versão fecha (vs proposta v1)

- L1 Segmented vs RadioGroup 2-col: explicito. Segmented = 2 segs simétricos. RadioGroup card = label simples.
- L2 InputField vs Stepper: explicito.
- L3 ScoreCriterion: só dentro do score subsystem.
- L4 OptionCard vs RadioGroup vs DisclosureCard: explicito (intent diferente em cada).
- L5 ChecklistBlock vs CheckboxGroup vs ScoreCriterion: explicito (3 intents distintos).
- L6 ActionTile vs OptionCard: explicito (ação rica não-persistente vs seleção).
- L7 Toggle vs ToggleField vs Switch-em-card: explicito.
- L8 Picker: Select+SelectSheet padrão.

## O que NÃO está coberto e precisa novo dilema

- Picker de **data/hora** (não temos casos no Sepse, mas surge no AVC/PCR — janela do AVC).
- Charts/gráficos (não usamos hoje).
- Drag/drop, swipe gestures, etc.

Quando aparecer, paramos e decidimos.

---

## Próximos passos (após aprovação)

1. Aplicar as 3 trocas na T1 já portada (sub-tabs → ToggleTab; veredito → OptionCard com descrição; o2supl → mover pra dentro do grupo).
2. Aplicar T2 (ATB no item bundle; ToggleField pro IMC; InfoButton título).
3. Aplicar T3 (InfoButton título; resto já tá certo).
4. Aplicar T4 (prescrições → DoseDisplay).
5. Histórico (PatientDetail + Timeline + Excluir/Compartilhar + Toast).
6. Build verde + screenshots + sign-off Luis ANTES de trocar iframe.
