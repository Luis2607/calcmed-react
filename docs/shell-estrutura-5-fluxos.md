# F0.3 · Captura de estrutura — 5 fluxos golden (shell)

> Lido direto do golden (`_prototipo/calcmed/src/protocolos/<id>/<id>.html`, validado com Gustavo).
> Objetivo: **destravar os templates L2** (`ProtocolShell` / `HistoryScreen` / `TheoryScreen`)
> garantindo que nasçam cobrindo os **5** fluxos — não só CAD/SCA. Captura LEVE (estrutura/esqueleto),
> não conteúdo clínico (esse vem na captura 1:1 de cada port, F2).
>
> Data: 2026-05-27 · read-only · nenhum código de tela tocado.

## ACHADO PRINCIPAL — o shell é UNIFORME nos 5

Todos os 5 protocolos têm **a mesma casca**:

```
.viewport
 ├─ <header> ProtocolHeader      (título + ações: anotar/sair; + stepper nos lineares)
 ├─ <main class="aba-conteudo aba-executar">   (N telas-passo)
 ├─ <main class="aba-conteudo aba-historico hidden">
 ├─ <main class="aba-conteudo aba-teoria hidden">
 └─ <nav class="tabs">           (3 tabs fixas: Executar · Histórico · Teoria)
```

- **3 abas SEMPRE** (`aba-executar` / `aba-historico` / `aba-teoria`) — confirmado nos 5 (`*.js trocarAba`).
- **PCR NÃO é exceção de shell.** Usa `aba-teoria` como os outros; o que muda é o CONTEÚDO
  da teoria (sub-tabs Panfletos / Cargas-Doses / Via Aérea) e o título exibido ("ACLS | AHA").
  ⇒ o plano antigo ("3ª aba = ACLS|AHA p/ PCR") estava **errado no nível de shell**: a aba é a mesma.
- **Tab bar** (`<nav class="tabs">`): 3 `<button class="tab" data-tab="...">` com `tab-icon` + `tab-label`
  ("Executar" / "Histórico" / "Teoria"). → **`TabBar`** do DS (já existe, K6).

## Cada `.tela` (passo) tem o mesmo esqueleto

```
section.tela[.ativa]#tela-N
 ├─ .tela-cabecalho        → StepHeader (título + subtítulo + info/ação)   [F0.1a ✅]
 ├─ .secao-label-row …     → SectionLabel (+ aside)                         [existe]
 ├─ (conteúdo: campos / cards / alerts / scores / checks / seleções)
 └─ .botoes-rodape | .tela-acao → ActionFooter (Sair + ação primária)      [K5 ✅]
```

## Por fluxo

### CAD · cetoacidose
- **Stepper (5):** Diagnóstico · Pós-diag · Insulina · Reaval. · Resolução
- **Telas (7 → 5 passos):** `tela-1` Identificar paciente · `tela-2` Manejo inicial ·
  `tela-2k` KCl em infusão **(ramo)** · `tela-3` Programar insulina · `tela-4` Acompanhar h/h ·
  `tela-5` Critérios de resolução · `tela-6` CAD resolvida **(encerramento)**
- **Clínico-chave:** gate de **K** via `.faixa-chips` (< 3,5 bloqueia insulina) → **RangeChip** [F0.1d ✅]
- **3ª aba:** "Consulta rápida" (cards `teoria-card`)

### SCA · síndrome coronariana
- **Stepper (5):** Triagem · ECG · Estratif. · Conduzir · Reavaliar
- **Telas (5):** Identificar paciente · ECG em ≤10 min · Estratificar risco (HEART/TIMI) ·
  Conduzir · Reavaliar e desfecho
- **Clínico-chave:** escores (HEART/TIMI/troponina) + locks (SAA→AAS, PDE5→nitrato, AVC→prasugrel)
- **3ª aba:** consulta (título a confirmar no port) · seleções hoje = `SelectCard` local → **OptionCard** [F0.1b ✅]
- ⚠️ **fluxo MENOS consistente — padronizar por ÚLTIMO** (decisão Luis 2026-05-27)

### Sepse
- **Stepper (5):** Triagem · 1ª hora · ATB · Vaso · Metas
- **Telas (5):** Triagem · Bundle 1 Hora · Antibioticoterapia · Vasopressores · Metas de Ressuscitação
- **Clínico-chave:** SOFA/qSOFA (cards colapsáveis `<details>`), bundle, vasopressor, timers
- **3ª aba:** "Consulta rápida"

### AVC
- **Stepper (5):** Triagem · NIHSS · Elegib. · Dose · Monitor
- **Telas (6):** Triagem · NIHSS **(sub-stepper próprio: "Passo 1 de 15")** · Elegibilidade ·
  Terapia de Reperfusão · Monitoramento · Trombectomia mecânica
- **Clínico-chave:** NIHSS 15 itens (sub-stepper), janela terapêutica, contraind., dose trombolítico
- **3ª aba:** "Teoria"

### PCR · parada cardiorrespiratória
- **SEM stepper linear** — é **dashboard operacional** (override do shell na aba executar):
  - `tela-1` pré-iniciar: `pcr-card` Compressões + Adrenalina (estado idle)  → **TimerCard** [F0.1g ✅]
  - `tela-2` operando: `pcr-card`s (running/cycle-end/window) + **`.acoes-row`** (Selecionar ritmo /
    Desfibrilar) → **ActionTile** [F0.1e ✅] + **`.fab-evento`** (FAB Adicionar evento)
  - `tela-3` RCE confirmado · `tela-4` Salvar paciente
- **3ª aba:** "ACLS | AHA" (sub-tabs: Panfletos · Cargas-Doses · Via Aérea)
- ⚠️ **vida/morte; cronômetros auto-iniciam (exceto este, todos os outros = manual start)**

## Histórico — IDÊNTICO nos 5 (visual), conteúdo por fluxo

```
.tela-cabecalho "Histórico"  → StepHeader (as="h2")
 + lista de casos             → HistoryView (organism, existe) / PatientDetail ao abrir [K8 ✅]
 + nota LGPD ("não substitui prontuário")
 + empty state ("Sem casos arquivados" + botão Iniciar)
```
→ **template `HistoryScreen`** = StepHeader + HistoryView + (PatientDetail no caso aberto) + nota LGPD + empty.

## Teoria — visual padrão, conteúdo por fluxo (PCR = exceção de conteúdo)

```
.tela-cabecalho (título varia: "Consulta rápida" | "Teoria" | "ACLS | AHA")
 + grade de cards de consulta  → ClinicalCard plain [F0.1f ✅] / teoria-card
```
→ **template `TheoryScreen`** = StepHeader(title prop) + grade de cards (data-driven).
  **PCR:** mesmo template + sub-tabs internas (Segmented) → conteúdo próprio.

## Implicações p/ os templates L2 (próxima etapa, pós-aprovação)

| Template | Composição | Cobre os 5? |
|---|---|---|
| **ProtocolShell** | ProtocolHeader(+stepper opcional) → painel da aba ativa → ActionFooter (na executar) → TabBar (3 fixas) | ✅ stepper é **opcional** (PCR sem; CAD/SCA/Sepse/AVC com 5) |
| **HistoryScreen** | StepHeader + HistoryView + PatientDetail + nota LGPD + empty | ✅ idêntico |
| **TheoryScreen** | StepHeader(title) + grade ClinicalCard plain; PCR += sub-tabs (Segmented) | ✅ título e conteúdo por prop |

**Diferenças que o shell precisa absorver (não congelar cedo):**
1. **stepper opcional** (PCR não tem) — prop `steps?`.
2. **executar pode ser dashboard** (PCR) e não sequência de telas-passo — o ProtocolShell renderiza o
   conteúdo da aba executar como `children` (cada flow decide telas-passo OU dashboard).
3. **3ª aba: título + conteúdo por prop** (TheoryScreen recebe `title` e `children`/sub-tabs).
4. **FAB** (PCR) — slot opcional na executar.
5. AVC tem **sub-stepper** interno (NIHSS 15) — fica DENTRO da tela 2 (não é o stepper do shell).

> Conclusão: o shell canônico cobre os 5 com **stepper opcional** + **executar como slot**.
> Nenhum bloqueio p/ desenhar `ProtocolShell` — mas isso é **ETAPA 3**, só após aprovação do Luis.
