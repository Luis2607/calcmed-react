# PRD — Central Sepse / Choque Séptico (CalcMed)

> **Status:** implementado e em produção · **Autor:** time de produto/design · **Data:** 2026-06-05
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Base clínica:** Surviving Sepsis Campaign (SSC 2026) · critério **Sepsis-3** (SOFA ≥ 2)
> **Fonte de verdade deste doc:** código atual em `src/features/sepse/` (`SepseFlow.jsx`, `sepseData.js`,
> `sepseModais.jsx`, `hooks/useSepseState.js`, `SepseFlow.module.css`). Porte 1:1 do golden `calcmed/src/protocolos/sepse/sepse.js`.

---

## 1. Sumário executivo

A **Central Sepse / Choque Séptico** é um protocolo guiado (wizard) para uso **no plantão**, à beira-leito,
que conduz o médico do **reconhecimento** da sepse ao **encerramento do caso** em 5 telas sequenciais.
Não é uma calculadora isolada nem um checklist estático: é um fluxo clínico que combina **escores de
triagem** (SIRS, NEWS/NEWS2, MEWS, SOFA), **veredito clínico** do médico, **bundle da 1ª hora**,
**antibioticoterapia empírica** (foco + risco MRSA/MDR), **cálculo de vasopressores** (preparo de ampolas
e vazão em mL/h por peso) e **metas de ressuscitação** — tudo com cronômetro do caso, timeline de eventos,
histórico local e teoria de consulta rápida.

O princípio operacional é o do CalcMed inteiro: **acionável, não enciclopédico**. Cada tela entrega a
conduta com a linguagem visual do Design System (átomos → moléculas → organismos → overlays), nunca texto
corrido. A regra clínica central é repetida explicitamente na UI: **sepse é diagnóstico clínico — nenhum
escore isolado decide**.

Neste documento: visão, escopo, requisitos, **arquitetura funcional**, e o **mapa completo de telas,
estados, escores e cálculos** da central conforme o código atual.

---

## 2. Problema & oportunidade

**Problema.** A sepse é tempo-dependente: cada hora de atraso no antibiótico aumenta a mortalidade em
~7% no choque séptico (SSC 2026). No plantão, o médico precisa, em sequência e sob pressão: reconhecer a
disfunção orgânica (escore certo, interpretado certo), classificar a probabilidade de sepse, disparar o
bundle da 1ª hora **sem esquecer item**, escolher o antibiótico empírico **certo para o foco e o perfil de
resistência**, preparar e titular vasopressores **com a aritmética de ampola/vazão correta**, e perseguir
metas de ressuscitação. Hoje isso se espalha por PDFs de protocolo, bulas, calculadoras avulsas e memória —
lento, fragmentado e sujeito a erro de cálculo (preparo de BIC) e a item esquecido.

**Oportunidade.** O CalcMed já tem o repertório clínico (escores, esquemas ATB, fórmulas de droga
vasoativa) e um Design System maduro. Reunir isso num **wizard único, cronometrado e à prova de item
esquecido** entrega velocidade + consistência + segurança de cálculo — com a aritmética de preparo de
ampola (que o médico não deveria refazer de cabeça à beira-leito) feita pelo app e exibida pronta para
prescrição.

---

## 3. Visão do produto

> "Reconheça, classifique e trate a sepse na ordem certa, no tempo certo — com o preparo da droga e o
> próximo passo já calculados, e nada esquecido."

Princípios:
- **Acionável, não enciclopédico.** Cada tela leva à conduta (marcar bundle, prescrever ATB, ajustar BIC).
- **Tempo-dependente, com cronômetro.** O caso abre no 1º toque e o relógio corre no header.
- **À prova de item esquecido.** Stepper com estado `warning` (laranja) e highlight vermelho de pendência
  quando o médico avança sem completar um step.
- **Apoio, não substituição.** Quem decide é o médico; o app organiza o raciocínio. "Sepse é diagnóstico
  clínico" é dito na UI.
- **Cálculo seguro.** Preparo de ampola + vazão em mL/h calculados pelo app; doses fora de faixa são
  *clampadas* a ranges clínicos; divisão por zero (sem peso) tratada com fallback explícito.
- **Mesma língua do DS.** Zero linguagem visual paralela; tudo em tokens/componentes existentes.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Plantonista (emergência/UTI)** | Beira-leito, paciente instável, tempo curto, uma mão no celular | Disparar o bundle 1h na ordem certa e prescrever vasopressor com preparo pronto |
| **Residente** | Plantão supervisionado, dúvida pontual + vontade de entender | Escore certo + "por quê" (modais teoria) + próximo passo do escalonamento |
| **Médico de PS/enfermaria** | Ritmo alto, muitos pacientes, recursos limitados | Screening rápido (SIRS/NEWS/MEWS), classificação e esquema ATB por foco |

**Contexto físico:** mobile, uma mão, ambiente com pressa e ruído. Implicações de design: alvos de toque
generosos, leitura escaneável, footers fixos com botão `lg`, hints clínicos no rodapé, persistência local
para retomar o caso se o app fechar.

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| ATB no tempo | Tempo do reconhecimento ao registro de ATB | ≤ 1 h no choque (registro de hora no app) |
| Bundle completo | % de casos com bundle 1ª hora 4/4 | ≥ 90% |
| Cálculo sem erro | nº de prescrições de vaso com preparo/vazão exibidos | 100% (app calcula) |
| Reconhecimento correto | % de casos com escore preenchido + veredito antes do bundle | 100% (gate T1) |
| Continuidade | % de casos retomados após fechar o app | persistência cobre |
| Encerramento documentado | % de casos arquivados no histórico com timeline | crescente |

> Telemetria ainda **não instrumentada** (sem analytics no fluxo). Persistência é local (localStorage).

---

## 6. Escopo

### 6.1 Entregue (este documento)
- **Wizard de 5 telas** sequenciais com stepper navegável: Triagem → 1ª hora → ATB → Vaso → Metas.
- **4 escores de triagem** comutáveis por sub-tabs: **SIRS, NEWS/NEWS2, MEWS, SOFA**, cada um com
  interpretação por faixa e modal descritor.
- **Veredito clínico** em 4 níveis (definida/provável/possível/improvável) com ramo de conduta.
- **Bundle da 1ª hora (4/4)** + **acompanhamento (5)** com contadores, registro automático de hora do ATB,
  e **cálculo de volume de cristaloide** (30 mL/kg, peso ajustado se obeso).
- **Antibioticoterapia empírica** por foco (6 focos) + **risco MRSA (n/5)** e **MDR (n/5)** com adição
  automática de Vancomicina/Pip-tazo quando ≥ 2 fatores.
- **Vasopressores**: Noradrenalina, Vasopressina, Adrenalina, Dobutamina, Hidrocortisona — cada um com
  **preparo de ampola, vazão em mL/h por peso, clamp de faixa e próximo passo de escalonamento**.
- **Metas de ressuscitação (5)** + **checklist UTI (6)**.
- **Cronômetro do caso**, **timeline de eventos**, **anotação livre**, **histórico local** (detalhe,
  filtro por veredito, excluir, compartilhar), **teoria** (5 itens de consulta rápida).
- **Persistência** local por campo (`sepse_*` no localStorage). **Dark mode** e **tokens DS** herdados do app-shell.

### 6.2 Fora de escopo (agora)
- Integração com prontuário eletrônico (EHR) / prescrição eletrônica real.
- Inputs de marcadores clínicos vivos (PAM/lactato têm estado mas **sem campo de input** no fluxo — só
  derivados/header; reservados para evolução).
- Telemetria/analytics.
- Cálculo de dose pediátrica de vasopressor (faixas e preparos são de adulto).

---

## 7. Arquitetura funcional

**Pipeline de uma sessão:** `abertura no hub → wizard de 5 telas (estado persistido por campo) → encerramento
(arquivar no histórico ou reiniciar)`.

### 7.1 Camadas de código

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| **Dados + cálculos puros** | `sepseData.js` | Tabelas de escores, esquemas ATB, focos, fatores de risco, bundle, metas; funções puras de pontuação, status, peso ajustado, volume, prescrição de vasopressor, próximo passo. **Sem React.** |
| **Estado clínico** | `hooks/useSepseState.js` | `usePersistedState` por campo (`sepse_*`); derivados (totais, contadores, gates); ações (toggles, veredito, hora ATB, ativar droga, navegação, reset). |
| **Conteúdo de modais** | `sepseModais.jsx` | Dicionário `SEPSE_MODAIS` (info + teoria) em blocos (`p`/`list`/`helper`) + render genérico `SepseModalBody`. |
| **Orquestração de UI** | `SepseFlow.jsx` | Monta as 5 telas, footers, stepper, overlays (sheets), histórico, teoria, toasts. Liga estado ↔ componentes DS. |
| **Estilos** | `SepseFlow.module.css` | Layout das telas, grupos (proximidade Gestalt), barra de progresso do bundle, cards de droga. |

### 7.2 Componentes DS usados (composição, não reinvenção)
`ProtocolShell` (app-shell: header + stepper + tabs executar/histórico/teoria + footer), `StepHeader`,
`ClinicalCard`, `ChecklistBlock`, `AlertCard`, `Timeline`, `ScoreCriterionGroup`, `ScoreResult`,
`ScoreRangeTable`, `RadioGroup`, `Segmented`, `ToggleTab`, `ToggleField`, `InputField`, `DetailRow`,
`SectionLabel`, `InfoButton`, `Button`, `Toast`; overlays `InfoSheet`, `ConfirmSheet`, `AnnotationSheet`,
`DetailSheet`, `SavePatientSheet`; templates `HistoryScreen`, `TheoryScreen`; sheet-pieces
`SheetSection`/`SheetDetailRow`/`SheetText`/`SheetList`.

---

## 8. Requisitos funcionais (RF)

### 8.1 Navegação & sessão
- **RF-01** A central abre em **app-shell** (`ProtocolShell`, `domain="sepse"`, título "Modo Sepse") com 3
  abas: **executar** (o wizard), **histórico**, **teoria**.
- **RF-02** O wizard tem **5 steps** rotulados `['Triagem', '1ª hora', 'ATB', 'Vaso', 'Metas']`, navegáveis
  pelo stepper (`onStepClick → irParaTela(n)`) e pelos botões do footer.
- **RF-03** O **cronômetro do caso** inicia no 1º toque clínico (`marcarInicio` → `iniciadoEm = Date.now()`),
  corre de 1 em 1 s e aparece no subtítulo do header como "Aberto há mm:ss" (ou "hHmm" após 1 h).
- **RF-04** O header exibe **chips dinâmicos**: idade (`{idade}a`), peso (`{peso}kg`), **"Sepse"** (tone
  crítico) quando `SOFA ≥ 2`, e **"Bundle {pct}%"** a partir da T2.
- **RF-05** O stepper marca cada step como `active` / `completed` / `warning` / `pending` (ver §10.3). Step
  visitado mas incompleto vira **`warning`** (laranja "!").
- **RF-06** **Sair**: se há dados (cronômetro/idade/peso/SOFA>0), abre `ConfirmSheet` "Sair do protocolo?"
  (o caso continua aberto neste aparelho); senão volta direto ao hub.

### 8.2 T1 · Triagem & classificação
- **RF-07** Quatro escores comutáveis por **ToggleTab**: SIRS, NEWS, MEWS, SOFA (estado `scoreAtivo`,
  default `sofa`). Cada troca exibe um **descritor** (`AlertCard` info) e a tabela de interpretação por faixa.
- **RF-08** O **InfoButton** do card de escores abre o **modal descritor** do escore ativo
  (`descritor-sirs/news/mews/sofa`).
- **RF-09** **SIRS** = 4 critérios binários (`ScoreCriterionGroup binary`, badge "+1"). **NEWS** = seletor de
  versão (NEWS2/NEWS) + O₂ suplementar binário + acordeão dos demais critérios. **MEWS** e **SOFA** =
  acordeão de critérios (`ScoreCriterionGroup` com níveis).
- **RF-10** **ScoreResult** mostra o total do escore ativo, o rótulo de risco e o texto de status (ver §11).
- **RF-11** **Veredito clínico** (`RadioGroup` 1-col + descrição) em 4 opções; selecionar registra evento na
  timeline (`definirVeredito`) e grava `vereditoEm`.
- **RF-12** **Gate de avanço (`tela1Liberada`)**: o botão "Iniciar Bundle 1ª hora" só habilita com
  **escore preenchido (total > 0) E veredito dado**.
- **RF-13** A UI exibe o alerta crítico fixo **"Sepse é diagnóstico clínico"** ("nenhum escore isolado decide").

### 8.3 T2 · Bundle da 1ª hora
- **RF-14** Card **"Paciente"**: idade + peso (inputs); ao preencher idade ≥ 65 exibe alerta de **PAM alvo
  60–65 mmHg**; toggle **"Obeso · IMC ≥ 30"** revela sexo + altura e calcula **peso ajustado**.
- **RF-15** **Bundle 1ª linha (4 itens, contador n/4)**: hemocultura ×2, lactato, **antibiótico IV**
  (com registro de hora), cristaloide 30 mL/kg. Marcar item-chave registra evento na timeline.
- **RF-16** **ATB com hora**: 1º clique no item ATB marca **e registra a hora** (`toggleAtbWithTime`);
  re-clique em ATB já marcado abre `ConfirmSheet` "ATB já registrado · atualizar hora?". O label do item
  passa a mostrar "Antibiótico IV · registrado às HH:MM".
- **RF-17** **Cristaloide**: quando há peso, exibe `AlertCard result` com o **volume calculado** (30 mL/kg,
  peso usado = ajustado se obeso); sem peso, exibe placeholder "Volume aguardando peso". Alerta de
  individualização (cardiopata/DRC/cirrótico; Ringer/PlasmaLyte preferidos sobre SF 0,9% exceto TCE).
- **RF-18** **Bundle acompanhamento (5 itens, contador n/5)**: vasopressor para PAM (label varia com idade
  ≥ 65), reavaliar lactato 2–4h, procalcitonina (opcional), identificar foco, hidrocortisona com gate inline.
- **RF-19** **Barra de progresso do bundle** (0–100%, 9 itens) que vira "Bundle completo" em 100%.
- **RF-20** **Skip inteligente de T3**: se ATB já registrado em T2, o botão primário pula direto para
  **Vasopressores (T4)**; senão vai para **Antibioticoterapia (T3)**.

### 8.4 T3 · Antibioticoterapia empírica
- **RF-21** **Foco infeccioso** (`RadioGroup` 1-col + descrição) em 6 opções; enquanto não há foco, exibe
  placeholder didático. Gate: botão "Vasopressores" só habilita com foco selecionado.
- **RF-22** **Risco MRSA (n/5)** e **Risco MDR (n/5)** em `ChecklistBlock`. **≥ 2 fatores** ativam a cobertura:
  **Vancomicina** (MRSA) e/ou **Piperacilina-tazobactam** (MDR), exibidas em cards adicionais.
- **RF-23** **Esquema empírico** do foco (`ClinicalCard` com `DetailRow` por droga/dose) + alerta
  "Consulte a SCIH/CCIH · reavalie em 48–72h e de-escalone".
- **RF-24** O **hint do footer** lista as adições ativas (ex.: "Esquema + Vancomicina + Pip-tazo · prescrever ATB IV").

### 8.5 T4 · Vasopressores
- **RF-25** Cinco cards de droga com estado **ativo/inativo** (`renderDrugCard`); cada card tem tag de papel
  clínico (1ª/2ª/3ª linha, disfunção cardíaca, refratário) e subtítulo com indicação e faixa de dose. Card
  inativo mostra botão **"+ Iniciar"** (`ativarDroga`).
- **RF-26** **Noradrenalina**: input de dose (mcg/kg/min) → `AlertCard result` com **preparo de ampola +
  vazão em mL/h** + alerta **"Próximo passo"** que muda conforme a dose.
- **RF-27** **Vasopressina**: dose fixa **0,03 U/min IV** (não titular), sem input.
- **RF-28** **Adrenalina** e **Dobutamina**: input de dose → preparo + vazão.
- **RF-29** **Hidrocortisona**: prescrição fixa **50 mg IV 6/6h (200 mg/dia)** ou 8 mg/h em infusão.
- **RF-30** **Clamp de dose**: doses digitadas fora de faixa clínica são limitadas (Nora 0,01–5; Adre
  0,01–1; Dobuta 1–30 mcg/kg/min). Sem peso, a vazão não é renderizada (exibe "informe o peso (T2)").
- **RF-31** O **hint do footer** é factual sobre a Nora atual (titular / Nora alta · Vasopressina /
  refratário · Adre + Hidrocortisona).

### 8.6 T5 · Metas de ressuscitação
- **RF-32** **Metas (5, contador n/5)**: PAM ≥ 65, lactato em queda, débito urinário ≥ 0,5 mL/kg/h (com valor
  calculado em mL/h se há peso), enchimento capilar < 3 s, SpO₂ 92–96%.
- **RF-33** **Checklist UTI (6, contador n/6)**: profilaxia TVP, profilaxia gástrica IBP, cabeceira 30°,
  sedação leve RASS −1 a 0, mobilização precoce, glicemia < 180.
- **RF-34** **Finalizar**: abre `SavePatientSheet` (iniciais + dados) → **arquivar** (salva caso no histórico
  com timeline) ou **finalizar sem salvar** (reset).

### 8.7 Anotação, histórico, teoria
- **RF-35** **Anotação** livre via `AnnotationSheet` (salvar grava `anotacaoEditadaEm`; limpar zera).
- **RF-36** **Histórico** (`HistoryScreen`): lista casos concluídos (iniciais + data), **filtro por veredito**
  (todas/definida/provável/possível/improvável) quando há casos; clicar abre `DetailSheet` com timeline.
- **RF-37** Detalhe do caso: seções Caso / Desfecho clínico / Bundle + **Timeline** (offsets T+min/h) +
  anotação + helper LGPD. Footer: **Excluir** (ConfirmSheet destrutivo) e **Compartilhar** (share/clipboard).
- **RF-38** **Teoria** (`TheoryScreen`): 5 itens de consulta rápida que abrem modais (SOFA/Sepsis-3, bundle
  1h, ATB empírica, escalonamento de vaso, metas).

### 8.8 Persistência
- **RF-39** Todo o estado do protocolo persiste por campo no localStorage (`sepse_*`). Encerrar/finalizar
  chama `resetProtocol` que restaura todos os defaults. O histórico persiste em `sepse_historico`.

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Design System:** 100% sobre tokens e componentes existentes. **Zero hardcode** de
  cor/fonte/espaçamento (CLAUDE.md §2). Composição sobre reinvenção (CLAUDE.md §3).
- **RNF-02 · Proximidade (Gestalt):** espaçamento expressa agrupamento (par label↔campo;
  pergunta↔resposta; grupos distintos respiram mais). `.group` agrupa itens do mesmo bloco.
- **RNF-03 · App-shell:** header, stepper e footer fixos; só a área de conteúdo rola (CLAUDE.md §4).
- **RNF-04 · Paridade clínica:** os dados e cálculos são **porte 1:1 do golden** `sepse.js` (SSC 2026).
  Nunca aproximar — paridade obrigatória.
- **RNF-05 · Segurança de cálculo:** clamp de doses a ranges clínicos; divisão por zero (sem peso) tratada;
  parse tolerante a vírgula decimal (`parseNum`).
- **RNF-06 · Copy clínica:** tom clínico, direto, humano; não soar como IA genérica (CLAUDE.md §5).
- **RNF-07 · Privacidade:** histórico salvo só no aparelho; helper LGPD "não substitui prontuário oficial".

---

## 10. Mapa de fluxo, telas & estados

### 10.1 Wizard — 5 telas

| # | Step | Título | Conteúdo | Gate de avanço |
|---|---|---|---|---|
| 1 | Triagem | Triagem e classificação | Escores (SIRS/NEWS/MEWS/SOFA) + ScoreResult + interpretação + alerta "diagnóstico clínico" + veredito | `tela1Liberada` = total > 0 **e** veredito |
| 2 | 1ª hora | Bundle da 1ª hora | Card Paciente (idade/peso/obeso) + bundle 1ª linha (4) + volume cristaloide + bundle acompanhamento (5) + barra de progresso | nenhum (skip T3 se ATB já registrado) |
| 3 | ATB | Antibioticoterapia empírica | Foco (6) + risco MRSA/MDR + esquema + coberturas + alerta SCIH | botão exige `foco` selecionado |
| 4 | Vaso | Vasopressores | 5 cards de droga (Nora/Vaso/Adre/Dobuta/Hidro) com preparo + vazão + próximo passo | nenhum (vasopressores opcionais por clínica) |
| 5 | Metas | Metas de ressuscitação | Metas (5) + checklist UTI (6) + alerta remoção de fluido | finalizar → SavePatientSheet |

### 10.2 Transições principais

```
Hub ──▶ T1 (Triagem)
T1 ──[Iniciar Bundle 1ª hora, gate tela1Liberada]──▶ T2
T2 ──[Antibioticoterapia, se ATB NÃO registrado]──▶ T3
T2 ──[Vasopressores, se ATB JÁ registrado (skip T3)]──▶ T4
T3 ──[Vasopressores, gate foco]──▶ T4
T4 ──[Metas de ressuscitação]──▶ T5
T5 ──[Finalizar]──▶ SavePatientSheet ──▶ {Arquivar | Finalizar sem salvar} ──▶ reset
Qualquer Tn ──[Voltar (secondary)]──▶ Tn-1
Stepper ──[clique em qualquer step]──▶ Tn (livre)
Sair (header) ──▶ ConfirmSheet "Sair do protocolo?" ──▶ Hub (caso mantido)
```

### 10.3 Estado do stepper (`stepStates`)

Para cada step `num` (1..5):
- `num === telaAtual` → **`active`**.
- visitado (`num < telaAtual` **ou** `num <= telaMaxVisitada`) → `completed` se `stepCompleto[num]`, senão **`warning`**.
- caso contrário → **`pending`**.

`stepCompleto`:
| Step | Condição de "completo" |
|---|---|
| 1 | `tela1Liberada` (escore + veredito) |
| 2 | `bundlePH >= 4` (4 ações da 1ª hora) |
| 3 | `!!foco` (foco selecionado) |
| 4 | `true` (sem gate forte) |
| 5 | `metasN >= 5 && icuN >= 6` |

**Highlight de pendência** (vermelho nos itens não marcados): `pendenciaT2` quando `telaMaxVisitada > 2` e T2
incompleto; `pendenciaT5` quando `telaMaxVisitada >= 5` e T5 incompleto. Persiste enquanto o médico já passou
pelo step, mesmo de volta nele, até completar.

### 10.4 Footers por tela (hint clínico + botões)

| Tela | Secondary | Hint (clínico, factual) | Primary |
|---|---|---|---|
| 1 | — | preenchido: ramo do veredito · vazio: "Preencher um escore" / "Dar veredito clínico abaixo" | "Iniciar Bundle 1ª hora" (disabled se `!tela1Liberada`) |
| 2 | Voltar→1 | `< 4`: "Marcar N ação(ões) da 1ª hora" · completo: null | "Antibioticoterapia" **ou** "Vasopressores" (skip) |
| 3 | Voltar→2 | foco + adições MRSA/MDR ("Esquema + … · prescrever ATB IV") | "Vasopressores" (disabled se `!foco`) |
| 4 | Voltar→3 | Nora <0,25: "Titular Nora até PAM ≥ 65" · <0,5: "Nora alta · considere Vasopressina" · ≥0,5: "Refratário · Adre + Hidrocortisona indicadas" | "Metas de ressuscitação" |
| 5 | Voltar→4 | metas <5: "Atingir N metas" · UTI <6: "Completar checklist UTI" · completo: null | "Finalizar" → SavePatientSheet |

> Regra de copy: o hint nunca duplica o texto do botão — só carrega informação clínica nova.

---

## 11. Escores — itens, pontuação e interpretação

> Convenção: nos escores em acordeão, `pts === idx` apenas no SOFA (níveis 0..4); em NEWS/MEWS a pontuação
> **não** é igual ao índice (saltos). SIRS é binário (1 pt por critério).

### 11.1 SIRS — 4 critérios booleanos (1 pt cada)

| Critério | Pontuação |
|---|---|
| Temperatura > 38 °C ou < 36 °C | +1 |
| FC > 90 bpm | +1 |
| FR > 20 irpm (ou PaCO₂ < 32) | +1 |
| Leucócitos > 12.000, < 4.000 ou bastões > 10% | +1 |

**Interpretação (status):** 0 = aguardando · 0–1 = SIRS improvável (sucesso) · 2 = SIRS presente (atenção) ·
3 = resposta inflamatória importante (atenção) · 4 = resposta inflamatória intensa (crítico).
**Descritor:** "Sensibilidade superior a qSOFA. 2 critérios = positivo."

### 11.2 NEWS / NEWS2 — 7 critérios (idx → pts, pts ≠ idx)

| Sistema | Níveis (desc → pts) |
|---|---|
| **FR (irpm)** | 12–20 → 0 · 9–11 ou 21–24 → 1 · ≤8 ou ≥25 → 3 |
| **SpO₂ (%)** | ≥96 → 0 · 94–95 → 1 · 92–93 → 2 · ≤91 → 3 |
| **O₂ suplementar** | Ar ambiente → 0 · Em O₂ → 2 (critério binário na UI) |
| **Temperatura (°C)** | 36,1–38,0 → 0 · 35,1–36,0 ou 38,1–39,0 → 1 · >39,0 → 2 · ≤35,0 → 3 |
| **PAS (mmHg)** | 111–219 → 0 · 101–110 → 1 · 91–100 → 2 · ≤90 ou ≥220 → 3 |
| **FC (bpm)** | 51–90 → 0 · 41–50 ou 91–110 → 1 · 111–130 → 2 · ≤40 ou ≥131 → 3 |
| **Consciência (AVPU/Glasgow)** | Alerta → 0 · Alterado → 3 |

**Versão:** NEWS2 (recomendado SSC 2026, escala 2 SpO₂) ou NEWS (original 2012). Default `news2`.
**Interpretação (status):** 0 sem preenchimento = aguardando · ≤4 = baixo risco (sucesso) · 5–6 = risco
moderado · avaliar SOFA (atenção) · ≥7 = risco alto · avaliar sepse (crítico).

### 11.3 MEWS — 5 critérios (idx → pts)

| Sistema | Níveis (desc → pts) |
|---|---|
| **PAS (mmHg)** | 101–199 → 0 · 81–100 → 1 · 71–80 ou ≥200 → 2 · ≤70 → 3 |
| **FC (bpm)** | 51–100 → 0 · 41–50 ou 101–110 → 1 · <40 ou 111–129 → 2 · ≥130 → 3 |
| **FR (irpm)** | 9–14 → 0 · 15–20 → 1 · <9 ou 21–29 → 2 · ≥30 → 3 |
| **Temperatura (°C)** | 35,0–38,4 → 0 · <35,0 ou ≥38,5 → 2 |
| **Consciência (AVPU/Glasgow)** | Alerta · Glasgow 15 → 0 · Glasgow 13–14 → 1 · Glasgow 9–12 → 2 · Glasgow <9 → 3 |

**Interpretação (status):** 0 sem preenchimento = aguardando · ≤4 = baixo risco (sucesso) · ≥5 = risco alto ·
avaliar SOFA (crítico).

### 11.4 SOFA — 6 sistemas (níveis 0..4, pts = idx)

| Sistema | Parâmetro | 0 / 1 / 2 / 3 / 4 |
|---|---|---|
| **Respiração** | PaO₂/FiO₂ | ≥400 / 300–399 / 200–299 / 100–199+VM / <100+VM |
| **Coagulação** | Plaquetas ×10³ | ≥150 / 100–149 / 50–99 / 20–49 / <20 |
| **Fígado** | Bilirrubina mg/dL | <1,2 / 1,2–1,9 / 2,0–5,9 / 6,0–11,9 / ≥12 |
| **Cardiovascular** | PAM / drogas | PAM≥70 / PAM<70 / Dopa≤5 / Dopa>5 ou Nora/Adre≤0,1 / Dopa>15 ou Nora/Adre>0,1 |
| **Neurológico** | Glasgow | 15 / 13–14 / 10–12 / 6–9 / <6 |
| **Renal** | Creatinina/DU | <1,2 / 1,2–1,9 / 2,0–3,4 / 3,5–4,9 ou DU<500 mL/dia / ≥5 ou DU<200 mL/dia |

**Interpretação (status):** 0 = aguardando · <2 = ausência de disfunção · manter vigilância (sucesso) ·
2–5 = disfunção · iniciar Bundle 1h (atenção) · ≥6 = disfunção grave · Bundle + avaliar choque (crítico).
**Critério Sepsis-3:** infecção suspeita/confirmada + aumento agudo de SOFA ≥ 2.

> **Chip "Sepse"** no header dispara quando `somaSofa(sofa) >= 2` — independentemente do escore ativo na vista.

### 11.5 Mapeamento severidade → risco (`sevToRisk`)
`crítico → alto` · `atenção → moderado` · demais (sucesso/neutro) → `baixo`. Alimenta o `ScoreResult`.

---

## 12. Veredito clínico (classificação)

`RadioGroup` 1-col, 4 opções (estado `classificacao`). Selecionar registra evento na timeline e grava
`vereditoEm`.

| Veredito | Descrição (UI) | Ramo de conduta (hint footer T1) |
|---|---|---|
| **Sepse definida** | ATB em até 1 h · diagnóstico alternativo muito improvável | "ATB em até 1 hora" |
| **Sepse provável** | ATB em até 1 h · diagnóstico alternativo menos provável | "ATB em até 1 hora" |
| **Sepse possível** | ATB ≤ 1 h se choque; até 3 h se suspeita persistir | "ATB ≤ 1 h se choque · até 3 h se persistir" |
| **Sepse improvável** | Manter investigação · diagnóstico alternativo mais provável | "Manter investigação · vigilância clínica" |

---

## 13. Bundle, focos & antibioticoterapia

### 13.1 Bundle 1ª linha (4, contador n/4)
hemocultura ×2 (aeróbio + anaeróbio) · lactato sérico · **antibiótico IV** (registra hora) · cristaloide 30 mL/kg.

### 13.2 Bundle acompanhamento (5, contador n/5)
vasopressor para PAM (label varia idade ≥ 65) · reavaliar lactato 2–4h · procalcitonina (opcional) ·
identificar foco infeccioso · hidrocortisona 200 mg/dia se Nora ≥ 0,25 mcg/kg/min > 4 h refratária.

> Bundle total = 9 itens (4 + 5). `bundleFeitos / bundleTotal` alimenta a barra de progresso e o chip.

### 13.3 Focos infecciosos & esquemas empíricos (`ESQUEMAS`)

| Foco | Esquema |
|---|---|
| **Pulmonar (PAC)** | Ceftriaxona 1–2 g IV q24h (infusão prolongada 3–4 h) + Azitromicina 500 mg IV/VO q24h |
| **Urinário** | Ceftriaxona 2 g IV q24h |
| **Abdominal** | Piperacilina-tazobactam 4,5 g IV q6h + Metronidazol 500 mg IV q8h (se cobertura extra) |
| **SNC / Meningite** | Ceftriaxona 2 g IV q12h + Vancomicina 15–20 mg/kg IV q8–12h + Ampicilina 2 g IV q4h (se Listeria) |
| **Pele e partes moles** | Cefazolina 2 g IV q8h |
| **Foco desconhecido** | Piperacilina-tazobactam 4,5 g IV q6h + Vancomicina 15–20 mg/kg IV q8–12h |

### 13.4 Risco MRSA (5 fatores; ≥ 2 → adiciona Vancomicina 15–20 mg/kg IV q8–12h)
Internação recente (<90 dias) · ATB IV recente (<90 dias) · Hemodiálise · Colonização prévia conhecida ·
Dispositivo intravascular.

### 13.5 Risco MDR (5 fatores; ≥ 2 → adiciona Piperacilina-tazobactam 4,5 g IV q6h)
ATB amplo recente (<90 dias) · Internação prolongada (≥5 dias) · Imunossupressão · Cultura prévia por MDR ·
Infecção prévia por MDR.

> **Distinção semântica:** os checkboxes são **fatores de risco do paciente**; o modal `o-que-e-mdr` explica
> **os germes** (ESBL, KPC/CRE, VRE, Pseudomonas MDR). Não confundir.

---

## 14. Cálculos clínicos (fórmulas, unidades, limites)

Todas as funções são puras (`sepseData.js`). `parseNum` normaliza vírgula → ponto e trata vazio → `NaN`.

### 14.1 Peso ajustado para obeso (IMC ≥ 30) — `calcularPesoAjustado`
Requer `imcObeso && peso && altura && sexo`; senão retorna `null`.
```
base       = sexo === 'masc' ? 50 : 45,5
pesoIdeal  = base + 0,906 × (altura_cm − 152,4)
ajustado   = pesoIdeal + 0,4 × (peso − pesoIdeal)
resultado  = max(0, round(ajustado))        // kg
```
Quando obeso mas falta sexo/altura, a UI exibe alerta "Informe sexo e altura para usar peso ajustado".

### 14.2 Volume de cristaloide (30 mL/kg) — `calcularVolume`
```
pesoUsado = pesoAjustado ?? peso          // ajustado tem prioridade
se !pesoUsado → null                       // sem peso, sem cálculo (placeholder na UI)
volumeMl  = round(pesoUsado × 30)          // mL, Ringer Lactato em 1–3 h
```

### 14.3 Vasopressores — preparo de ampola + vazão (mL/h)

Convenção comum: dose em **mcg/kg/min**, peso em **kg**, vazão em **mL/h**. Sem peso (`!peso`), `vazao = null`
e a UI mostra "informe o peso (T2) para a vazão" (divisão por zero evitada).

| Droga | Preparo (concentração) | Fórmula da vazão (mL/h) | Default | Clamp de dose |
|---|---|---|---|---|
| **Noradrenalina** | 4 amp (4 mg/4 mL) + 234 mL SG 5% = 16 mg/250 mL = **64 mcg/mL** | `dose × peso × 60 / 64` | 0,10 | 0,01–5 |
| **Adrenalina** | 12 amp (1 mg/mL) + 188 mL SG 5% = 12 mg/200 mL = **60 mcg/mL** | `dose × peso` | 0,05 | 0,01–1 |
| **Dobutamina** | 4 amp (250 mg/20 mL) + 170 mL SG 5% = 1000 mg/250 mL = **4000 mcg/mL** | `dose × peso × 0,015` | 5 | 1–30 |
| **Vasopressina** | dose fixa | — (não titular) | 0,03 U/min IV | — |
| **Hidrocortisona** | dose fixa | — | 50 mg IV 6/6h (200 mg/dia) ou 8 mg/h infusão | — |

> A vazão é formatada com 1 casa (`toFixed(1)`) e vírgula decimal; a dose Nora/Adre com 2 casas, Dobuta com 1.
> **Clamp**: no `SepseFlow`, `clamp(v, min, max)` é aplicado antes de calcular — dose digitada fora da faixa é
> limitada ao extremo (evita prescrição absurda). Input vazio/NaN cai no default da droga.

### 14.4 Próximo passo da Noradrenalina — `proximoPassoNE(dose)`
```
dose < 0,25  → "Escalonar Nora até 0,25 mcg/kg/min antes de associar Vasopressina."
dose < 0,50  → "Nora ≥ 0,25 · associe Vasopressina (0,03 U/min IV, dose fixa)."
dose ≥ 0,50  → "Dose alta · associe Adrenalina e inicie Hidrocortisona 200 mg/dia IV."
```

### 14.5 Débito urinário alvo (T5, derivado)
Se há peso: label da meta vira "Débito urinário ≥ 0,5 mL/kg/h (`round(peso × 0,5)` mL/h)".

---

## 15. Estado, derivados & ações (`useSepseState`)

### 15.1 Campos persistidos (chaves `sepse_*`)
sessão: `iniciado_em`, `tela_atual` (1), `tela_max` (1), `aba_atual` ('executar') · paciente: `idade`,
`peso`, `altura`, `sexo` (null), `imc_obeso` (false) · marcadores: `pam`, `lactato` (null, sem input) ·
escores: `score_ativo` ('sofa'), `sofa` {}, `sirs` {}, `news` {versao:'news2'}, `mews` {}, `classificacao`
(null), `veredito_em`, `eventos` [] · bundle: `bundle` {}, `hora_atb` (null) · ATB: `foco` (null),
`risco_mrsa` {}, `risco_mdr` {} · vaso: `ne_dose` ('0,10'), `ne_ativa`, `vaso_ativa`, `epi_dose` ('0,05'),
`epi_ativa`, `dob_dose` ('5'), `dob_ativa`, `hidro_ativa` · metas: `metas` {}, `icu` {} · anotação:
`anotacao` (''), `anotacao_editada_em`. Histórico: `sepse_historico` [] (no flow).

### 15.2 Derivados
`numIdade`, `numPeso`, `numAltura` (parse); `total` e `status` do escore ativo; `tela1Liberada` (total>0 &&
classificacao); `pesoAjustado`, `volume`; `bundlePH` (n/4), `bundleAC` (n/5), `bundleFeitos`/`bundleTotal`
(/9); `mrsaN`/`mdrN` e `mrsaAtivo`/`mdrAtivo` (≥2); `metasN` (/5), `icuN` (/6).

### 15.3 Ações principais
`marcarInicio` (1º toque → cronômetro), `registrarEvento`, `definirVeredito` (timeline), setters de escore
(marcam início; re-selecionar o mesmo nível desmarca → null), `toggleBundle` (registra evento dos itens-chave),
`registrarHoraAtb` / `toggleAtbWithTime`, `ativarDroga`, `irParaTela` (atualiza `telaMaxVisitada`),
`resetProtocol` (restaura todos os defaults).

### 15.4 Timeline de eventos
`eventos` acumula `{ hora, acao, tag }` para: **veredito** (mudança), **bundle** (itens-chave: hemocultura,
lactato, ATB IV, cristaloide), e a **hora do ATB** é adicionada no detalhe do caso. No detalhe, offsets são
exibidos como `T+min` / `T+hHmm` relativos a `iniciadoEm`; `tag → status` (veredito/atb → success, bundle → info).

---

## 16. Modais (info + teoria)

Conteúdo em `SEPSE_MODAIS` (blocos `p`/`list`/`helper`), aberto em `InfoSheet` (BottomSheet do DS).

**Info (acionados por InfoButton/onInfo):** `o-que-e-sepse`, `descritor-sirs`, `descritor-news`,
`descritor-mews`, `descritor-sofa`, `o-que-e-classificacao`, `o-que-e-sofa`, `o-que-e-bundle`,
`o-que-e-primeira-hora`, `o-que-e-acompanhamento`, `o-que-e-atb`, `o-que-e-foco`, `o-que-e-mrsa`,
`o-que-e-mdr`, `o-que-e-ne`, `o-que-e-hidrocortisona`, `o-que-e-metas`, `o-que-e-checklist-icu`.
**Disponíveis no dicionário mas não ligados a botão no fluxo atual:** `o-que-e-pam`, `o-que-e-lactato`,
`o-que-e-avaliacao-clinica`, `o-que-e-pam-alvo`.
**Teoria (aba teoria):** `teoria-sofa`, `teoria-bundle`, `teoria-atb`, `teoria-vaso`, `teoria-metas`.

Mensagens clínicas-chave nos helpers: "cada hora de atraso no ATB aumenta mortalidade ~7%"; "bundle completo
em 6 h reduz mortalidade hospitalar em 25%"; clareamento de lactato ≥ 10% em 2 h indica resposta.

---

## 17. Edge cases & tratamento

- **Avançar sem completar um step** → step vira `warning` (laranja) e itens pendentes ganham highlight
  vermelho (`pendenciaT2`/`pendenciaT5`); persiste até completar.
- **Botão de avanço bloqueado** → T1 sem escore/veredito e T3 sem foco mantêm o primary `disabled`.
- **ATB re-registrado** → re-clique em ATB já marcado abre ConfirmSheet (atualizar hora ou manter).
- **Skip de T3** → se ATB já registrado em T2, o fluxo pula direto para Vaso (T4).
- **Sem peso na T4** → vazão não é calculada; prescrição mostra "informe o peso (T2)".
- **Dose de vaso fora de faixa** → clampada ao range clínico; input vazio/NaN cai no default.
- **Obeso sem sexo/altura** → alerta orienta preencher antes de usar peso ajustado no volume.
- **Sair com caso aberto** → ConfirmSheet; o caso permanece persistido (retomável pelo hub).
- **Finalizar sem salvar** → reset total sem gravar no histórico.
- **Excluir caso do histórico** → ConfirmSheet destrutivo (irreversível) + toast.
- **Compartilhar sem Web Share API** → cai para clipboard + toast "Resumo copiado".
- **Re-selecionar o mesmo nível de escore** → desmarca (volta a null), permitindo corrigir.

---

## 18. UX writing & tom de voz

- **Tom:** clínico, direto, humano. Frases curtas, imperativo de conduta ("Titular Nora até PAM ≥ 65 mmHg").
- **Regra do hint:** o rodapé nunca repete o texto do botão — só informação clínica nova (próximo passo,
  pendência concreta). Quando não há info nova, hint = null.
- **Alerta fundacional repetido na UI:** "Sepse é diagnóstico clínico · nenhum escore isolado decide."
- **Ressalvas clínicas explícitas:** "Consulte a SCIH/CCIH" (perfil de resistência local); "Individualize"
  (sobrecarga volêmica em cardiopata/DRC/cirrótico); hidrocortisona "só no choque refratário".
- **Privacidade:** "Histórico salvo apenas neste aparelho. Não substitui prontuário oficial."
- **Proibições:** soar como IA genérica; prometer o que não cumpre; emoji em chrome (ícones do `Icon` atom).

---

## 19. Segurança clínica

- **Sepse é diagnóstico clínico:** a UI obriga **escore + veredito** antes de avançar (gate T1) e repete o
  alerta de que nenhum escore decide sozinho.
- **Tempo-dependência:** registro automático de hora do ATB; hints de "ATB ≤ 1 h" por veredito; teoria com a
  mortalidade por hora de atraso.
- **Cálculo de droga:** preparo de ampola e vazão calculados pelo app (reduz erro de BIC à beira-leito);
  clamp de doses fora de faixa; vazão omitida sem peso (não inventa número).
- **Peso ajustado em obeso** para volume (evita sobre-ressuscitação por peso real).
- **Cobertura ampla por risco** (MRSA/MDR ≥ 2 fatores) com ressalva de validação na SCIH/CCIH e
  de-escalonamento em 48–72h.
- **Alvo de PAM permissivo em idoso** (≥ 65 anos → 60–65 mmHg) sinalizado por alerta.
- **Apoio, não substituição:** todas as condutas são sugestões; o médico decide e valida no protocolo local.

---

## 20. Decisões de produto registradas

- **Título fixo "Escores"** no card de triagem (o nome do escore ativo já aparece nas ToggleTabs; o
  InfoButton ao lado é dinâmico, abre o descritor do escore selecionado).
- **Veredito / Foco / Versão NEWS** usam `RadioGroup` 1-col **com descrição** (extensão do DS) — affordance de
  radio + ramo clínico inline; 1-col evita quebra de copy clínica.
- **Voltar = botão secondary** ao lado do primary no footer (não link textual) a partir de T2.
- **Skip de T3** quando o ATB já foi registrado em T2 (evita passo redundante).
- **Prescrição de vaso em `AlertCard result`** (não em card próprio) — decisão de exibição; funções de render
  (não componentes inline) para não perder foco do input.
- **Hidrocortisona com gate clínico inline** no item do bundle (texto da condição junto do item).
- **Risco MDR = fatores do paciente** nos checkboxes; **germes** ficam no modal (distinção semântica).
- **Detalhe do caso** montado só com sheet-pieces (SheetSection/Row/Text) + Timeline — não reusa PatientDetail
  dentro do sheet (evita header duplicado).
- **Filtro do histórico por veredito** (todas/definida/provável/possível/improvável).
- **"Limpar Tudo" removido da listagem** do histórico — exclusão é caso a caso pelo detalhe.

---

## 21. Glossário

- **Sepsis-3 / SOFA:** definição de sepse por disfunção orgânica (aumento agudo de SOFA ≥ 2 + infecção).
- **Bundle 1ª hora:** conjunto de ações tempo-dependentes (hemocultura, lactato, ATB, cristaloide).
- **Veredito clínico:** classificação do médico (definida/provável/possível/improvável) que direciona a conduta.
- **SIRS / NEWS / NEWS2 / MEWS:** escores de screening/deterioração comutáveis na triagem.
- **MRSA / MDR:** perfis de resistência que adicionam Vancomicina / Pip-tazo à cobertura empírica.
- **Peso ajustado:** peso de cálculo em obeso (IMC ≥ 30) para volume de cristaloide.
- **Preparo / vazão:** diluição da ampola (mcg/mL) e velocidade da BIC (mL/h) calculadas por dose × peso.
- **stepCompleto / warning:** estados do stepper que marcam pendência quando se avança sem completar.
- **golden:** implementação de referência (`calcmed/src/protocolos/sepse/sepse.js`) portada 1:1.
```
