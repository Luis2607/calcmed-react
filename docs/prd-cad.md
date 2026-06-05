# PRD — Central de Urgência CAD (Cetoacidose Diabética) · CalcMed

> **Status:** implementado e em produção · **Autor:** time de produto/design · **Data:** 2026-06-05
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Fonte de verdade:** código atual — `src/features/cad/` (`CADFlow.jsx`, `cadData.js`, `cadModais.jsx`, `hooks/useCADState.js`, `CADFlow.module.css`)
> **Fontes clínicas:** SBD 2025, UpToDate, ISPAD (pediátrico)

---

## 1. Sumário executivo

A **central de urgência CAD** é um protocolo guiado de beira-leito para condução da **cetoacidose
diabética** no plantão. Não é uma calculadora isolada: é um **wizard clínico de 5 telas** que conduz o
médico do diagnóstico à alta, com **gates de segurança** (potássio bloqueia insulina), **cálculos
automáticos** (ânion gap, sódio corrigido, dose de insulina), **timers de processo** (aguardo de KCl,
bloqueio pediátrico, reavaliação horária) e **modos adulto × pediátrico** inferidos pela idade.

O diferencial é a **segurança clínica embutida no fluxo**: a insulina não pode ser iniciada com K < 3,5;
em pediatria a insulina só libera 1h após os fluidos; a reavaliação roda em loop horário e gera condutas
por velocidade de queda do HGT; e a resolução só fecha com os três critérios juntos (glicemia, equilíbrio
ácido-base, ânion gap). Tudo persiste localmente (localStorage) e pode ser arquivado no histórico.

Neste documento: visão, escopo, requisitos, arquitetura funcional, e o **mapa completo de fluxo, estados,
cálculos, timers, modais e edge cases** do protocolo CAD tal como implementado.

---

## 2. Problema & oportunidade

**Problema.** A CAD é uma emergência endocrinológica com condução demorada (4 a 12 horas), multietapas e
cheia de armadilhas: iniciar insulina com potássio baixo (hipocalemia/arritmia fatal), corrigir glicemia
rápido demais em criança (edema cerebral — principal causa de morte na CAD pediátrica), errar o cristaloide
pelo sódio não corrigido, ou perder o ritmo das reavaliações horárias. As referências (SBD, UpToDate, ISPAD)
são corretas mas estão em PDF/protocolo — lentas de consultar à beira-leito.

**Oportunidade.** O CalcMed transforma o protocolo num **fluxo executável** que segura o médico nos pontos
críticos: bloqueia a insulina quando o K está baixo, cronometra os processos (KCl 2h, fluidos pediátricos
1h, reavaliação 1h), calcula automaticamente as fórmulas, e ajusta a conduta pela resposta do paciente —
com a mesma linguagem visual e o mesmo rigor clínico do resto do app.

---

## 3. Visão do produto

> "Conduza a CAD do diagnóstico à alta sem perder um passo crítico: o protocolo segura o que não pode
> falhar (potássio antes da insulina, ritmo das reavaliações, critérios de resolução) e calcula o resto."

Princípios:
- **Segurança antes de velocidade.** Gates clínicos (K < 3,5) bloqueiam o avanço; o app impede o erro, não
  só avisa.
- **Guiado, não enciclopédico.** Cada tela tem um objetivo único e um próximo passo claro.
- **Calcula o que é calculável.** Ânion gap, sódio corrigido, dose de insulina e metas pediátricas saem do
  input bruto, sem o médico fazer conta de cabeça.
- **Adapta ao paciente.** Modo adulto × pediátrico × pediátrico crítico (< 5a) muda doses, timers e alertas.
- **Mesma língua do DS.** Zero linguagem visual paralela; tokens e componentes existentes.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Plantonista (PS/emergência)** | Recebe a CAD na porta, paciente instável, precisa iniciar reposição/insulina já | Sequência correta e segura em minutos, sem decorar doses |
| **Intensivista (UTI)** | Conduz as 4–12h de reavaliação horária e ajuste fino da insulina | Ritmo das reavaliações + ajuste por velocidade de queda + critérios de resolução |
| **Pediatra / emergencista pediátrico** | Criança com CAD, alto risco de edema cerebral | Doses por kg, bloqueio de insulina pós-fluidos, vigilância de edema cerebral |
| **Residente** | Plantão supervisionado, dúvida pontual + aprendizado | Fluxo guiado + camada de teoria ("por quê") sem sair do protocolo |

**Contexto físico:** mobile, uma mão, beira-leito, pressa. Implicações: alvos de toque generosos, leitura
escaneável, timers visíveis, persistência (o médico sai e volta ao protocolo sem perder estado).

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| Evitar erro de potássio | % de casos em que insulina foi iniciada com K ≥ 3,5 | 100% (gate impede o contrário) |
| Manter o ritmo de reavaliação | nº médio de reavaliações lançadas por caso | crescente / ≥ 4 em casos resolvidos |
| Condução completa | % de casos que chegam à resolução (3 critérios) | crescente |
| Segurança pediátrica | % de casos pediátricos que respeitam o bloqueio de 1h pós-fluidos | 100% (botão desabilitado) |
| Continuidade | % de protocolos retomados após sair (persistência) | — |
| Aprendizado | nº de aberturas dos modais de teoria por sessão | crescente |

> Telemetria ainda **não instrumentada** no código atual. Ver §15.

---

## 6. Escopo

### 6.1 P0 — implementado (este documento)
- **Wizard de 5 telas** (Diagnóstico → Exames/gate K → Insulina → Controle → Alta) + **subtela 2k** (aguardo KCl).
- **Modo automático por idade:** adulto (≥ 18a), pediátrico (5–17a), pediátrico crítico (< 5a).
- **Diagnóstico por 2 de 3 critérios** (glicemia ≥ 200, acidose, cetose) com validação de plausibilidade.
- **Cálculos automáticos:** reposição inicial por HGT, sódio corrigido (fator 1,6 / 2,4), gate de potássio
  (4 faixas, padrão ADA/SBD), dose de insulina 0,1 UI/kg/h, ânion gap, metas pediátricas de glicemia.
- **Timers:** aguardo de KCl (2h), bloqueio pediátrico pós-fluidos (1h), reavaliação horária (loop).
- **Reavaliação horária** com recomendação de conduta por velocidade de queda do HGT e suspensão automática
  de insulina (hipoglicemia, K < 3,5).
- **Critérios de resolução** auto-avaliados das medidas + override manual (glicemia < 200, HCO₃ ≥ 18 ou
  pH ≥ 7,30, AG < 12).
- **Vigilância de edema cerebral** (pediátrico) com gatilho de tratamento ISPAD.
- **Cronômetro mestre**, **eventos/timeline**, **anotação**, **histórico de casos** e **teoria** (11 modais).
- **Persistência localStorage** por campo (`cad_*`), retomada do protocolo de onde parou.
- **Dark mode** e **tokens DS** (zero hardcode) — conforme `CLAUDE.md`.

### 6.2 Fora de escopo (agora)
- Cálculo automático de **volume de fluidos por kg/hora em pediatria** (texto orientativo, não calculadora).
- Cálculo de **osmolaridade efetiva** (consta na teoria como fórmula, não como input ativo).
- **Bicarbonato** como passo prescritivo (consta na teoria; não é tela do fluxo).
- Integração com prontuário (EHR); multiusuário/login; sincronização entre aparelhos.
- Cálculo de **peso ideal/ajustado** como tela própria — o protocolo usa **peso real informado** (ver §9 RNF-08
  e Decisão D-09).

---

## 7. Arquitetura funcional

**Camadas (porte 1:1 do golden `calcmed/src/protocolos/cad/`):**

```
cadData.js          → lógica clínica PURA (cálculos, faixas, constantes, formatadores). Sem estado/UI.
hooks/useCADState.js→ estado do protocolo (usePersistedState `cad_*`) + ações + derivados clínicos.
cadModais.jsx       → conteúdo dos 11 modais info/teoria (blocos → SheetText/SheetList).
CADFlow.jsx         → composição da UI: 5 telas + subtela, footers, modais interativos, histórico, teoria.
CADFlow.module.css  → spacing/log/critério/toast (só o que nenhum componente do DS cobre).
```

**Princípio de separação:** `cadData.js` é determinístico e testável (porte do golden, "paridade clínica
obrigatória — nunca aproximar"). `useCADState` orquestra estado e persistência. `CADFlow` só compõe
componentes do DS (`ProtocolShell`, `StepHeader`, `ClinicalCard`, `AlertCard`, `TimerCard`, `InputField`,
`RadioGroup`, `ResultDisplay`, `Timeline`, e overlays `InfoSheet`/`ConfirmSheet`/`FormSheet`/etc.).

**Shell:** a tela vive dentro do `ProtocolShell` (`domain="cad"`), com header (voltar, título "Modo CAD",
cronômetro, ação "Anotar"), chips de paciente, stepper de 5 passos, abas (Executar / Histórico / Teoria) e
footer de ação por tela.

---

## 8. Requisitos funcionais (RF)

### 8.1 Sessão, navegação & shell
- **RF-01** O protocolo abre na **aba Executar**, tela **1 (Diagnóstico)**. O estado persiste por campo
  (`cad_*`) e é **retomado de onde parou** ao reabrir.
- **RF-02** O **cronômetro mestre** começa a contar quando o caso inicia (ao informar a idade ou confirmar
  diagnóstico — `iniciadoEm`) e aparece no header como "Aberto há M:SS / Hh MM".
- **RF-03** O **stepper** mostra os 5 passos com estados: `active` (tela atual), `completed` (visitado e
  completo), `warning` (visitado e incompleto), `pending` (não visitado). Tocar num passo **anterior** ao
  atual navega para ele; passos à frente não são clicáveis.
- **RF-04** O header exibe **chips de paciente** quando há idade + modo: rótulo do modo (crítico se < 5a),
  idade (`Na`), e peso (`Nkg`) — o peso só aparece em adulto a partir da tela 3, e sempre em pediátrico.
- **RF-05** Sair do protocolo: se há caso em andamento (`iniciadoEm`, idade ou peso), abre confirmação
  "Sair do protocolo?" que **mantém o protocolo aberto** (retoma pelo hub); senão volta direto.
- **RF-06** Ação **"Anotar"** no header abre um campo de anotação livre (cross-protocolo), com salvar/limpar
  e timestamp de edição. O ícone fica ativo quando há anotação.

### 8.2 T1 · Diagnóstico
- **RF-07** Inputs de **idade** (anos) e **peso** (kg). Informar idade infere o **modo** e marca o início do
  caso. Idade válida: `0 < idade ≤ 120`. Peso válido: `0 < peso ≤ 300`.
- **RF-08** Input de **glicemia capilar (HGT)** com validação de plausibilidade (10–2000 mg/dL). Valor fora
  da faixa mostra estado de erro ("Valor implausível. Confira a leitura.") e **bloqueia o avanço**. Valor
  > 200 mg/dL mostra estado de sucesso.
- **RF-09** Dois checkboxes de critério: **Acidose confirmada** (pH < 7,30 ou HCO₃ < 18 mEq/L) e **Cetose
  confirmada** (BOHB ≥ 3 mmol/L ou cetonúria 2+). Glicemia ≥ 200 é o terceiro critério (automático pelo input).
- **RF-10** O diagnóstico **fecha com 2 de 3 critérios** (e idade + peso válidos + glicemia plausível). Ao
  fechar, exibe card de resultado com a contagem (`N/3`) e a **reposição inicial** sugerida.
- **RF-11** Alertas de modo: **pediátrico crítico (< 5a)** → "Emergência pediátrica · alto risco de edema
  cerebral, Glasgow horário"; **pediátrico (5–17a)** → "Protocolo pediátrico · doses por kg, insulina 1h após
  fluidos".
- **RF-12** Botão primário **"Confirmar diagnóstico (N/3)"** — habilita só com diagnóstico fechado. Em
  pediátrico, confirmar **marca o início dos fluidos** (dispara o bloqueio de 1h). Registra evento na timeline.

### 8.3 T2 · Exames e gate do potássio
- **RF-13** Exibe a **reposição inicial** (ramo por HGT). Input de **sódio (Na)** com cálculo automático do
  **sódio corrigido** e conduta de cristaloide no helper.
- **RF-14** **RadioGroup de potássio** com 4 faixas (< 3,5 / 3,5–5 / 5–5,5 / > 5,5). A faixa escolhida
  **libera ou bloqueia** a insulina (gate de segurança).
- **RF-15** Se **K < 3,5** (faixa "baixo"): card crítico "NÃO INICIE INSULINA"; o botão primário vira
  "Iniciar reposição de KCl" (danger). Se K ≥ 3,5: card de resultado "Potássio Seguro"; botão "Iniciar
  insulina" (habilita só com faixa escolhida).
- **RF-16** Prescrever KCl abre confirmação ("NaCl 0,9% 1000 mL + KCl 10% 20 mL (40 mEq), correr em 2h"). Ao
  confirmar, marca o K como em correção, **inicia o cronômetro de 2h** e leva à subtela **2k**.

### 8.4 Subtela 2k · Aguardo de KCl
- **RF-17** Mostra um **TimerCard de 2h** ("Reavaliar potássio em" — HH:MM:SS) com progresso, mais a
  prescrição de KCl. Botão primário **"Lançar novo K"** abre um FormSheet com as 4 faixas.
- **RF-18** Ao lançar o novo K: grava a faixa, **zera o cronômetro de aguardo** e volta à tela 2. Se a nova
  faixa for ≥ 3,5, a insulina fica liberada.

### 8.5 T3 · Insulinoterapia IV
- **RF-19** Exibe a **vazão da bomba** (`ResultDisplay`, U/h) = dose calculada (0,1 UI/kg/h). Card de preparo
  da bomba (diluição 100 UI / 100 mL → 1 UI/mL → vazão mL/h = dose U/h) e, em pediátrico, a **meta de glicemia**.
- **RF-20** Checkbox opcional **"Aplicar bolus 0,1 U/kg"** (dose de ataque). Padrão CalcMed: sem bolus.
- **RF-21** Em **pediátrico**, enquanto o bloqueio de 1h pós-fluidos está ativo: exibe TimerCard "Liberação
  da insulina em" (MM:SS) e **desabilita** "Iniciar infusão". Liberado o tempo, o botão habilita.
- **RF-22** Iniciar infusão: marca `insulinaIniciada`, **arma o cronômetro de reavaliação (+1h)**, registra
  a dose (e bolus, se marcado) na timeline e avança para a tela 4.

### 8.6 T4 · Reavaliação horária
- **RF-23** **TimerCard "Próxima reavaliação"** (MM:SS, loop de 1h). Fica crítico (tom vermelho) nos últimos
  5 min. Ao zerar, dispara toast "Hora da reavaliação…" e **rearma para +1h** automaticamente.
- **RF-24** Botão **"Lançar reavaliação"** abre FormSheet com: HGT anterior (puxado do último registro),
  **HGT atual (obrigatório, 20–2000)**, insulina rodando agora (puxada da prescrição), e opcionalmente
  gasometria/eletrólitos (pH, HCO₃, Na, Cl, K, BOHB).
- **RF-25** Ao digitar o HGT, exibe **recomendação de conduta em tempo real** (`AlertCard`) calculada por
  valor e velocidade de queda (ver §11.4). Se K < 3,5 lançado, mostra alerta crítico de suspensão.
- **RF-26** Salvar a reavaliação: grava a medida (com ânion gap se Na/Cl/HCO₃ presentes), rearma o
  cronômetro, registra evento, e dispara toast com o nível da recomendação. Efeitos colaterais:
  - HGT < 200 → marca o critério de resolução `hgt`.
  - HGT < 100 → **suspende a insulina**.
  - K < 3,5 → suspende a insulina, marca K como "baixo", inicia aguardo de KCl e **navega para a subtela 2k**.
- **RF-27** **Log de reavaliações** (hora · HGT · insulina U/h) listado na tela. Card crítico "Infusão
  suspensa" quando aplicável.
- **RF-28** Em **pediátrico**, card de **vigilância de edema cerebral** com botão "Avaliar sinais de alarme"
  (abre o checklist ISPAD). O card é crítico em < 5a.
- **RF-29** Botão primário "Avançar para alta" leva à tela 5.

### 8.7 T5 · Critérios de resolução / Alta
- **RF-30** Ao entrar na tela 5, **auto-preenche** os 3 critérios a partir das últimas medidas (`seedResolucao`).
  Cada critério tem checkbox (override manual) + subtexto com a última leitura.
- **RF-31** Os 3 critérios: **Glicemia < 200**, **HCO₃ ≥ 18 ou pH ≥ 7,30**, **Ânion gap < 12**. Botão
  "Calcular ânion gap" abre um FormSheet (Na, Cl, HCO₃) que persiste o resultado e marca/desmarca o critério.
- **RF-32** Em pediátrico, nota ISPAD: "BOHB ≤ 1 mmol/L, AG 12 ± 2 mEq/L".
- **RF-33** Com os **3 critérios marcados**, card de resultado "CAD resolvida!" + orientação de transição
  para insulina SC (1ª dose 1h antes de parar a infusão IV).
- **RF-34** Botão primário **"Finalizar"** abre o `SavePatientSheet` (salvar paciente / arquivar caso).

### 8.8 Encerramento, histórico & teoria
- **RF-35** **Salvar caso:** exige iniciais. Grava um caso no histórico (iniciais, modo, idade, peso, sexo,
  observações, desfecho="Alta", data, duração, nº de reavaliações, eventos, anotação) e **reseta o protocolo**.
- **RF-36** **Finalizar sem salvar:** reseta o protocolo ao estado padrão (toast "Protocolo reiniciado").
- **RF-37** **Histórico:** lista os casos arquivados (neste aparelho). Tocar abre o detalhe (caso + timeline
  + anotação), com **Compartilhar** (Web Share / clipboard) e **Excluir** (confirmação irreversível).
- **RF-38** **Teoria:** 11 entradas que abrem modais de conteúdo clínico (critérios, doses, fórmulas,
  resolução, edema, HGT, pH, BOHB, potássio, reavaliação, ajuste de insulina).
- **RF-39** Modais de info por tela (`onInfo` nos cards): critérios, por que sódio, por que K, o que é dose,
  o que é bolus, reavaliação, resolução.

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Design System:** 100% sobre tokens e componentes existentes (`CLAUDE.md` §2-3). **Zero hardcode**
  de cor/fonte/espaçamento; o CSS local só cobre o que nenhum componente do DS provê (spacing das telas, log,
  itens de critério, toast).
- **RNF-02 · Proximidade (Gestalt):** escala expressa agrupamento — seções 24 / dentro 16 / grupos 12–8
  (igual AVC/Sepse). Título↔conteúdo, label↔campo, par lógico junto.
- **RNF-03 · App-shell:** header, stepper e footer fixos (`ProtocolShell`); só a área de conteúdo rola.
- **RNF-04 · Persistência:** estado por campo em localStorage (`usePersistedState`, chaves `cad_*`), evitando
  o blob único do golden (sem colisão com o iframe golden no QA). Histórico em `cad_historico_casos`.
- **RNF-05 · Paridade clínica:** `cadData.js` é porte 1:1 do golden (SBD/UpToDate/ISPAD). **Nunca aproximar**
  fórmulas, faixas ou condutas.
- **RNF-06 · Tom de voz:** clínico, direto, humano; sem soar como IA genérica (`CLAUDE.md` §5).
- **RNF-07 · Dark mode** e **acessibilidade:** suportados via tokens/componentes do DS; inputs com `inputMode`
  decimal e `mono` para valores.
- **RNF-08 · Peso real:** o protocolo usa o **peso informado** (real) para todas as doses por kg (insulina,
  bolus). Não há cálculo de peso ideal/ajustado no fluxo (ver D-09).
- **RNF-09 · Modo DEV:** sob `import.meta.env.DEV`, cada TimerCard expõe um botão "Pular 5 min (dev)" para QA
  dos timers (não aparece em produção).

---

## 10. Mapa de fluxo (grafo de telas e transições)

```
                 ┌─────────────────────────────────────────────────────────┐
                 │  Cronômetro mestre arma ao informar idade / confirmar    │
                 └─────────────────────────────────────────────────────────┘

 T1 Diagnóstico ──confirmarDiagnostico (2/3 ok)──▶ T2 Exames + gate K
   • idade→modo                                      │
   • peso                                            ├─ K ≥ 3,5 ──irParaTela(3)──▶ T3 Insulina
   • glicemia (sanity)                               │
   • acidose / cetose                                └─ K < 3,5 ──confirmarReposicaoK──▶ 2k Aguardo KCl (timer 2h)
   • (pediátrico: arma bloqueio 1h)                                        │
                                                        relancarK(faixa) ──┘ (volta T2; libera se ≥3,5)

 T3 Insulina ──iniciarBomba──▶ T4 Reavaliação (arma reaval +1h)
   • dose 0,1 UI/kg/h                 │
   • bolus opcional                   ├─ lancarMedida (loop horário)
   • (pediátrico: bloqueio 1h         │     • HGT<200 → marca critério hgt
     desabilita iniciar)              │     • HGT<100 → suspende insulina
                                       │     • K<3,5  → suspende + irParaTela('2k')
                                       │
                                       └──irParaTela(5)──▶ T5 Resolução (seedResolucao)
                                                            • 3 critérios (auto + manual)
                                                            • calcular ânion gap
                                                            • todos ok → "CAD resolvida"
                                                            • Finalizar → SavePatientSheet
                                                                 ├─ Salvar → arquiva + resetProtocol
                                                                 └─ Descartar → resetProtocol
```

**Navegação livre para trás:** o stepper e os botões "Voltar" permitem voltar a qualquer tela já visitada
(`irParaTela(n)`); o `telaMaxVisitada` preserva os estados `completed/warning/pending` do stepper.

### 10.1 Estados de conclusão do stepper (`stepCompleto`)
| Passo | Completo quando |
|---|---|
| 1 Diagnóstico | `isDiagnosisConfirmed` (2/3 + idade/peso/glicemia válidos) |
| 2 Exames | potássio escolhido **e** insulina não bloqueada (`potassio !== '' && !isInsulinBlocked`) |
| 3 Insulina | `insulinaIniciada != null` |
| 4 Controle | ≥ 1 medida com HGT lançada |
| 5 Alta | `resolucaoTodos` (3 critérios marcados) |

---

## 11. Cálculos clínicos (fórmula · unidades · limites)

> Todos em `cadData.js`. Parsing aceita vírgula decimal (`parseNum`).

### 11.0 Sanity ranges (rejeição de implausível)
| Campo | Min | Max | Efeito |
|---|---|---|---|
| glicemia | 10 | 2000 mg/dL | fora → erro no input, bloqueia diagnóstico |
| ph | 6,8 | 7,8 | usado em validações de entrada |
| bohb | 0 | 15 mmol/L | — |
| sodio | 100 | 180 mEq/L | — |
| idade | (0, 120] anos | — | fora → diagnóstico não fecha |
| peso | (0, 300] kg | — | fora → diagnóstico não fecha |
| HGT reaval | 20 | 2000 mg/dL | fora → não salva reavaliação |

### 11.1 Modo por idade (`inferirModo`)
- idade < 5 → **`pediatrico-extra`** ("Pediátrico < 5a", crítico)
- 5 ≤ idade < 18 → **`pediatrico`** ("Pediátrico")
- idade ≥ 18 → **`adulto`** ("Adulto")

### 11.2 Critérios diagnósticos (`contarCriterios` / `diagnosticoConfirmado`)
- **Glicemia:** conta 1 se `glicemia ≥ 200` **e** dentro do sanity (10–2000).
- **Acidose:** conta 1 se checkbox marcado (pH < 7,30 ou HCO₃ < 18).
- **Cetose:** conta 1 se checkbox marcado (BOHB ≥ 3 ou cetonúria 2+).
- **Fecha** com `count ≥ 2` **e** idade ∈ (0,120] **e** peso ∈ (0,300] **e** glicemia plausível (ou vazia).

### 11.3 Reposição inicial por HGT (`soroInicial`)
- **HGT < 250 mg/dL** → "SG 5% 1 L + NaCl 20% 40 mL EV" (evita hipoglicemia durante a insulina).
- **HGT ≥ 250 (ou vazio)** → "SF 0,9% · 15 a 20 mL/kg EV" (1 a 1,5 L na 1ª hora).

### 11.4 Sódio corrigido (`sodioCorrigido`)
```
fator = (glicemia ≥ 400) ? 2,4 : 1,6
Na_corrigido = Na + fator × [(glicemia − 100) / 100]
```
- Unidades: mEq/L. Conduta derivada:
  - Na_corr < 135 → "Mantenha NaCl 0,9%."
  - 135 ≤ Na_corr < 150 → "Troque para NaCl 0,45%."
  - Na_corr ≥ 150 → "Use NaCl 0,45% e monitore."
- Se glicemia ausente, usa apenas Na (sem correção).

### 11.5 Gate de potássio (`POTASSIO_OPCOES` + `gateK`) — padrão ADA/SBD
| Faixa (`value`) | Rótulo | Conduta | Insulina |
|---|---|---|---|
| `baixo` | < 3,5 mEq/L | NÃO INICIE INSULINA · repor KCl 10–20 mEq/h | **bloqueada** |
| `normal` | 3,5 a 5 mEq/L | faixa segura · 20–40 mEq KCl por litro de soro | liberada |
| `alto` | 5 a 5,5 mEq/L | liberada · reponha com cautela · K seriado | liberada |
| `muito-alto` | > 5,5 mEq/L | **não reponha K** · monitore · trate hipercalemia se ECG alterado | liberada |
- Só **`baixo`** bloqueia (`gate.bloqueado = true`). As bandas 3,5–5 / 5–5,5 / > 5,5 liberam; > 5,5 não repõe.

### 11.6 Dose de insulina (`doseInsulina`)
```
dose (UI/h) = peso_real × 0,1   → exibido com 1 casa decimal
```
- Diluição: 100 UI em 100 mL NaCl 0,9% (1 UI/mL) → **vazão mL/h = dose UI/h**.
- Bolus opcional: 0,1 U/kg antes da infusão.

### 11.7 Metas pediátricas de glicemia (`metaGlicemiaPediatrica`)
- `pediatrico-extra` (< 5a) → **150 a 180 mg/dL**
- `pediatrico` (5–17a) → **100 a 150 mg/dL**
- adulto → sem meta específica na T3.

### 11.8 Ânion gap (`anionGap` / `avaliarAG`)
```
AG = Na − (Cl + HCO₃)     → mEq/L, exibido sem casas decimais
```
- Normal 8–12. **Resolução: AG < 12.** Retorna `null` se faltar qualquer um dos três.

### 11.9 Recomendação na reavaliação (`recomendacaoReaval`)
Entrada: `{ hgt, hgtAnterior, velAtual }`. Válido só com HGT ∈ [20, 2000]. Retorna `{ nivel, titulo, corpo,
suspendeInsulina, abreResolucao }`. Ordem de avaliação:

| Condição (HGT atual) | Nível | Conduta-chave | Suspende? |
|---|---|---|---|
| < 70 | crítico | Suspender insulina + bolus glicose 50% 30–50 mL IV, reavaliar 15 min | **sim** |
| < 100 | crítico | Suspender insulina, soro glicosado 10%, reavaliar 30 min | **sim** |
| < 200 | normal | Critério de resolução atingido; confirmar HCO₃/AG; reduzir p/ 0,02–0,05 U/kg/h + SG | não (abre resolução) |
| < 250 | atenção | Adicionar SG e reduzir insulina p/ `max(vel×0,5; 1)` U/h (ou 0,05 U/kg/h) | não |

Para **HGT ≥ 250**, usa o delta (`HGT_anterior − HGT_atual`):
| Delta | Nível | Conduta-chave |
|---|---|---|
| < 0 (subiu) | crítico | Revisar diluição/acesso; combinar com enfermagem; considerar aumentar dose |
| < 50 (queda lenta) | atenção | Aumentar insulina p/ `vel×1,3` U/h; revisar acesso/diluição |
| > 100 (queda rápida) | atenção | Reduzir insulina p/ `vel×0,7` U/h (risco de queda rápida) |
| 50–100 (alvo) | normal | Manter conduta (resposta no alvo) |
| sem HGT anterior | normal | "HGT N mg/dL · manter conduta, reavaliar em 1h" |

### 11.10 Recomendação de K na reavaliação (`recomendacaoKReaval`)
- K < 3,5 → crítico: "interromper insulina" (ao salvar, suspende a infusão e leva à reposição de KCl).
- K ≥ 3,5 (ou ausente) → sem alerta.

### 11.11 Critérios de resolução auto-avaliados (`avaliarResolucao`)
Das **últimas medidas** que têm cada campo:
- `hgt` atende se última HGT < 200.
- `hco3` atende se última HCO₃ ≥ 18 **ou** último pH ≥ 7,30.
- `ag` atende se último AG < 12.
- `todos` = os três juntos. O seed da T5 usa esses valores; o usuário pode sobrescrever manualmente.

### 11.12 Edema cerebral pediátrico (`avaliarEdema`, ISPAD)
Listas: 3 diagnósticos, 3 maiores, 4 menores (ver §13.5). **Gatilha tratamento** se:
```
diagnósticos ≥ 1   OU   maiores ≥ 2   OU   (maiores ≥ 1 e menores ≥ 2)
OU   (modo < 5a  E  maiores ≥ 1  E  menores ≥ 1)
```
Conduta disparada: manitol 20% 0,5–1 g/kg IV em 15 min (repetir em 30 min) **ou** salina 3% 2,5–5 mL/kg em
10–15 min; cabeceira 30°, fluidos a 2/3 da manutenção, intubar se Glasgow < 8. "Não aguardar TC."

---

## 12. Timers de processo

| Timer | Constante | Duração | Formato | Onde | Comportamento |
|---|---|---|---|---|---|
| **Cronômetro mestre** | — | conta desde `iniciadoEm` | M:SS / Hh MM | header | Tick 1s; "Aberto há …" |
| **Aguardo KCl** | `AGUARDO_K_SEGUNDOS` | **2h** | HH:MM:SS | subtela 2k | conta a partir de `aguardoKIniciadoEm`; ao zerar → `cycle-end`; "Lançar novo K" |
| **Bloqueio pediátrico** | `BLOQUEIO_PEDIATRICO_SEGUNDOS` | **1h** | MM:SS | T3 | só em pediátrico; arma ao confirmar diagnóstico (`pediatricoFluidosEm`); desabilita "Iniciar infusão" |
| **Reavaliação horária** | `REAVAL_SEGUNDOS` | **1h (loop)** | MM:SS | T4 | arma ao iniciar bomba; ao zerar → toast + rearma +1h; tom crítico < 5 min |

Todos os timers persistem o **timestamp de início** (não o contador), então o tempo decorrido é recalculado
a cada tick mesmo após sair e voltar ao app. Em DEV, botão "Pular 5 min" subtrai 5 min do timestamp.

---

## 13. Modais (info & teoria) e overlays interativos

### 13.1 Modais de conteúdo (`CAD_MODAIS` · `InfoSheet`)
Blocos tipados (`p` / `list` / `section` / `helper`) renderizados por `CadModalBody`.

| ID | Título | Acessível por |
|---|---|---|
| `o-que-e-reavaliacao` | Como funciona a reavaliação | TimerCard T4, Teoria |
| `como-ajustar-insulina` | Como o ajuste é calculado | Teoria |
| `o-que-e-hgt` | Glicemia capilar · HGT / Dextro | Teoria |
| `o-que-e-ph` | pH venoso | Teoria |
| `o-que-e-bohb` | Cetonemia (BOHB) | Teoria |
| `por-que-k` | Por que conferir o potássio antes | card K (T2), Teoria |
| `por-que-sodio` | Por que o sódio entra aqui | card Na (T2) |
| `o-que-e-dose` | Como a dose é calculada | card preparo (T3) |
| `o-que-e-vazao` | O que é a vazão | (definido; conteúdo de apoio) |
| `o-que-e-bolus` | Dose de ataque (bolus) | card bolus (T3) |
| `teoria-criterios` | Critérios diagnósticos | card critérios (T1), Teoria |
| `teoria-doses` | Doses padrão | Teoria |
| `teoria-edema` | Edema cerebral pediátrico | Teoria |
| `teoria-formulas` | Fórmulas úteis (AG, Na corrigido, osmolaridade) | Teoria |
| `teoria-resolucao` | Resolução e transição | card resolução (T5), Teoria |

### 13.2 Repor KCl (`ConfirmSheet`)
Confirma a prescrição de KCl. Ao confirmar → `confirmarReposicaoK` (inicia timer 2h, vai à 2k).

### 13.3 Lançar novo K (`FormSheet`, subtela 2k)
RadioGroup das 4 faixas; salvar só com faixa escolhida → `relancarK` (zera aguardo, volta à T2).

### 13.4 Lançar reavaliação (`FormSheet`, T4)
Campos: HGT anterior (puxado), **HGT atual (obrigatório, 20–2000)**, insulina rodando (puxada), e bloco
opcional de gasometria/eletrólitos (pH, HCO₃, Na, Cl, K, BOHB). Mostra recomendação ao vivo. Salvar →
`salvarMedida` (ver RF-26).

### 13.5 Edema cerebral (`FormSheet`, pediátrico)
Checklists ISPAD:
- **Diagnósticos:** resposta motora/verbal anormal · postura de decorticação/descerebração · pupilas anormais.
- **Maiores:** alteração da consciência (Glasgow caindo) · bradicardia > 20 bpm sem causa · incontinência
  inapropriada para a idade.
- **Menores:** cefaleia que piora/persiste · vômitos persistentes · letargia/irritabilidade · PA diastólica
  > 90 mmHg.
- Descrição do gatilho muda em < 5a ("1 maior + 1 menor já gatilha"). Card crítico de conduta quando atinge
  o limiar (`avaliarEdema`).

### 13.6 Calcular ânion gap (`FormSheet`, T5)
Inputs Na/Cl/HCO₃ → preview `ResultDisplay` (success se < 12). Aplicar → `registrarAG` + marca o critério.

### 13.7 Outros overlays
- **Anotação** (`AnnotationSheet`): texto livre, salvar/limpar, timestamp.
- **Sair** (`ConfirmSheet`): mantém o protocolo aberto.
- **Salvar paciente** (`SavePatientSheet`): iniciais, idade, peso, sexo, observações, desfecho="Alta";
  salvar ou descartar.
- **Detalhe do caso** (`DetailSheet`): caso + timeline + anotação; compartilhar / excluir.
- **Excluir caso** (`ConfirmSheet`, destrutivo, irreversível).

---

## 14. Mapa de estados & efeitos

### 14.1 Estado persistido (`cad_*` · `useCADState`)
| Grupo | Chaves |
|---|---|
| Sessão/nav | `cad_iniciado_em`, `cad_tela_atual` (1..5 \| '2k'), `cad_tela_max`, `cad_aba_atual` |
| T1 | `cad_idade`, `cad_peso`, `cad_glicemia`, `cad_acidose`, `cad_cetose` |
| T2 | `cad_sodio`, `cad_potassio`, `cad_k_corrigido`, `cad_aguardo_k_em`, `cad_ped_fluidos_em` |
| T3 | `cad_bolus`, `cad_insulina_em`, `cad_insulina_suspensa`, `cad_dose_uh` |
| T4 | `cad_medidas` (array), `cad_reaval_proximo_em` |
| T5 | `cad_resolucao` `{hgt, hco3, ag}` |
| Encerramento | `cad_iniciais` |
| Transversal | `cad_eventos` (timeline), `cad_anotacao`, `cad_anotacao_em` |
| Histórico | `cad_historico_casos` (lista de casos arquivados) |

### 14.2 Efeitos automáticos (gatilho → efeito)
| Gatilho | Efeito |
|---|---|
| Informar idade | infere modo + arma cronômetro mestre |
| Confirmar diagnóstico (pediátrico) | arma bloqueio de fluidos 1h |
| Confirmar reposição K | marca K em correção + arma aguardo 2h + vai à 2k |
| Iniciar bomba | grava insulina + arma reaval +1h + evento |
| Reaval zera (T4) | toast + rearma +1h |
| Entrar na T5 | seed dos 3 critérios das últimas medidas |
| Lançar medida HGT < 200 | marca critério `hgt` |
| Lançar medida HGT < 100 | suspende insulina |
| Lançar medida K < 3,5 | suspende insulina + K "baixo" + aguardo 2h + vai à 2k |
| Calcular AG | grava medida (fonte modal) + marca/desmarca critério `ag` |

### 14.3 Toasts
"Hora da reavaliação…" (zera reaval) · recomendação ao salvar reavaliação (nível crítico/atenção/sucesso) ·
"Ânion gap N mEq/L" · "Caso arquivado" · "Protocolo reiniciado" · "Caso removido do histórico" · "Texto do
caso copiado".

---

## 15. Telemetria a instrumentar

Sugeridos: `cad_open`, `cad_diagnostico_confirmado{modo}`, `cad_k_gate{faixa, bloqueado}`,
`cad_kcl_iniciado`, `cad_k_relancado{faixa}`, `cad_insulina_iniciada{bolus}`, `cad_reaval_lancada{nivel}`,
`cad_insulina_suspensa{motivo}`, `cad_edema_avaliado{tratar}`, `cad_ag_calculado`, `cad_resolucao_fechada`,
`cad_caso_salvo{modo, duracao, reavaliacoes}`, `cad_caso_excluido`, `cad_teoria_open{id}`.

> **Não instrumentado** no código atual.

---

## 16. Edge cases & tratamento

- **Glicemia implausível** (fora de 10–2000) → estado de erro no input e **bloqueia** o diagnóstico, mesmo
  com 2 critérios marcados.
- **CAD euglicêmica** (SGLT2/gestação) → glicemia pode estar normal; acidose + cetose (2 critérios) fecham
  o diagnóstico mesmo com glicemia < 200 (a teoria orienta usar pH/BOHB).
- **K cai durante o tratamento** (reavaliação com K < 3,5) → suspende a insulina e **realimenta o loop do
  KCl** (volta à 2k), mesmo já estando na T4.
- **Hipoglicemia na reavaliação** (HGT < 100) → suspende a infusão; card "Infusão suspensa" na T4.
- **Sair durante o protocolo** → confirmação que **não descarta**; estado persiste e retoma.
- **Pediátrico tenta iniciar insulina antes de 1h** → botão "Iniciar infusão" desabilitado até o timer zerar.
- **Finalizar sem os 3 critérios** → permitido ("Marque os 3 — ou finalize mesmo assim"); o caso é arquivado
  com desfecho "Alta".
- **Salvar sem iniciais** → não grava (iniciais obrigatórias).
- **Timer recalculado após reabrir** → como persiste o timestamp de início, o tempo decorrido é recomputado
  (não "congela" no fechamento do app).
- **Navegação para trás** → permitida só para telas já visitadas; o stepper marca incompletas como `warning`.
- **Clipboard/Web Share indisponível** no compartilhar → degrada para cópia de texto (toast).

---

## 17. Segurança clínica

- **Gate de potássio** é o mecanismo central: K < 3,5 **bloqueia** o início da insulina (card crítico + botão
  vira "Iniciar reposição de KCl"), pois insulina com K baixo causa hipocalemia grave/arritmia. Aplicado
  também na reavaliação (suspensão automática + retorno ao KCl).
- **Bloqueio pediátrico de 1h pós-fluidos** evita hiponatremia/edema cerebral por insulina precoce em criança.
- **Vigilância de edema cerebral** (pediátrico): checklist ISPAD com gatilho de tratamento e conduta imediata
  "não aguardar TC" — principal causa de morte na CAD pediátrica.
- **Plausibilidade** (sanity ranges) impede avançar com leituras absurdas (ex.: glicemia digitada errada).
- **Ajuste por velocidade de queda** evita correção rápida demais (risco de edema) e lenta demais.
- **Resolução só com os 3 critérios** evita alta precoce com acidose residual.
- **Bicarbonato** não é passo do fluxo (a teoria desencoraja uso de rotina; risco de edema em pediatria).
- **Disclaimer:** histórico salvo só no aparelho, "não substitui prontuário oficial".

---

## 18. UX writing & tom de voz

- **Tom:** clínico, direto, humano. Títulos de tela curtos ("Diagnóstico", "Exames e gate do potássio",
  "Insulinoterapia IV", "Reavaliação horária", "Critérios de resolução").
- **Hints de footer** orientam o próximo passo sem jargão ("Preencha idade, peso e 2 dos 3 critérios",
  "Potássio < 3,5: reponha KCl antes de liberar a insulina", "Lance ao menos uma reavaliação antes de fechar").
- **Alertas** nomeiam o risco e a ação ("NÃO INICIE INSULINA", "Tratar agora · NÃO aguardar TC", "Infusão
  suspensa").
- **Recomendações de reavaliação** trazem número + conduta ("Queda de 80 mg/dL em 1h · manter conduta").
- **Sem quebrar a 4ª parede**; sem prometer o que não cumpre.

---

## 19. Decisões de produto registradas

- **D-01** Gate de K com **4 faixas** e só `< 3,5` bloqueando (padrão ADA/SBD) — as bandas altas liberam a
  insulina; > 5,5 não repõe potássio.
- **D-02** **Modo inferido pela idade** (não escolhido manualmente): < 5a crítico, 5–17 pediátrico, ≥ 18 adulto.
- **D-03** **Subtela 2k** dedicada ao aguardo de KCl (não um modal), com timer de 2h visível — o aguardo é
  parte do fluxo, não um pop-up.
- **D-04** **Bolus opcional e off por padrão** (UpToDate não recomenda; SBD permite com evidência fraca).
- **D-05** Reposição inicial **ramifica por HGT < 250** (SG vs SF) para evitar hipoglicemia.
- **D-06** **Sódio corrigido** com fator dinâmico (2,4 se glicemia ≥ 400; senão 1,6).
- **D-07** Resolução **auto-semeada** das últimas medidas, com **override manual** (o médico tem a palavra final).
- **D-08** **Persistência por campo** (`cad_*`), não blob único — evita colisão com o golden no QA e permite
  retomada granular.
- **D-09** O protocolo usa **peso real informado** para doses por kg; não há tela de peso ideal/ajustado.
- **D-10** Bicarbonato e osmolaridade ficam na **teoria**, não no fluxo prescritivo.
- **D-11** Em pediátrico, **insulina só após 1h de fluidos** (timer desabilita o botão).
- **D-12** Composição 100% sobre o DS (overlays `*Sheet`, `TimerCard`, `ClinicalCard`…); CSS local mínimo.

---

## 20. Glossário

- **CAD:** cetoacidose diabética — emergência metabólica (hiperglicemia + acidose + cetose).
- **HGT / Dextro:** glicemia capilar (sangue do dedo), mg/dL.
- **BOHB:** beta-hidroxibutirato — principal corpo cetônico, mmol/L (critério de cetose ≥ 3).
- **Ânion gap (AG):** Na − (Cl + HCO₃), mEq/L; resolução < 12.
- **Sódio corrigido:** Na ajustado pela hiperglicemia, define o cristaloide.
- **Gate de K:** trava de segurança que bloqueia a insulina com K < 3,5.
- **Reposição inicial / cristaloide:** SF 0,9% ou SG 5% conforme HGT/sódio.
- **Bolus de ataque:** dose única 0,1 U/kg de insulina antes da infusão (opcional).
- **Reavaliação horária:** loop de medição (HGT ± gasometria) a cada 1h até resolver.
- **Resolução:** glicemia < 200 **+** (HCO₃ ≥ 18 ou pH ≥ 7,30) **+** AG < 12.
- **Transição SC:** 1ª dose de insulina subcutânea 1h antes de parar a infusão IV.
- **Modo pediátrico crítico:** < 5a — maior risco de edema cerebral.
- **ISPAD:** sociedade internacional de diabetes pediátrico (fonte do protocolo pediátrico/edema).
- **SBD:** Sociedade Brasileira de Diabetes (fonte clínica principal).
