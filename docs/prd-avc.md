# PRD — Central AVC do CalcMed (Acidente Vascular Cerebral)

> **Status:** implementado e em produção · **Autor:** time de produto/design · **Data:** 2026-06-05
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Fonte de verdade:** código atual — `src/features/avc/AVCFlow.jsx`, `avcData.js`, `avcModais.jsx`, `hooks/useAVCState.js`, `AVCFlow.module.css`
> **Diretriz clínica de referência:** AHA/ASA Stroke Guideline 2026 (+ estudos WAKE-UP, DAWN, DEFUSE-3, SELECT2, ANGEL-ASPECT, ELAN 2023, INTERACT-3, PATCH).

---

## 1. Sumário executivo

A **Central AVC** é um protocolo guiado de beira-leito para o **Código AVC** (AVC isquêmico agudo). Conduz
o médico do reconhecimento à decisão de reperfusão num **wizard de 5 passos** (Triagem → NIHSS →
Elegibilidade → Dose → Monitoramento), com um **desvio** para Trombectomia mecânica quando a trombólise
está contraindicada.

O coração da central é a **janela terapêutica viva**: o tempo decorrido desde o último momento em que o
paciente foi visto normal é **recomputado a cada segundo** contra o relógio atual — não é um snapshot
congelado. Numa central tempo-dependente, a janela tem de subir sozinha conforme o plantão corre, mudando
faixa (padrão < 4,5h → estendida → só trombectomia → fora de janela) sem o médico precisar reabrir nada.

Sobre a janela, a central calcula: o **escore NIHSS** (15 itens), os **gates de elegibilidade**
(contraindicações + PA pré-trombólise 185/110), a **dose do trombolítico** por peso (TNK ou Alteplase, com
teto), as **metas de PA** dinâmicas no monitoramento, e os **critérios de trombectomia** (vaso / ASPECTS /
mRS / NIHSS). Tudo persiste localmente e arquiva o caso no histórico ao final.

Este documento descreve visão, escopo, requisitos, **arquitetura funcional**, e o **mapa completo de
estados, transições e cálculos** da central como está no código.

---

## 2. Problema & oportunidade

**Problema.** O AVC isquêmico é a urgência onde **tempo é cérebro**: a elegibilidade à trombólise some em
minutos e cada decisão (janela, NIHSS, contraindicações, PA, dose, vaso) tem corte numérico próprio. No
plantão, o médico precisa orquestrar essas regras sob pressão, frequentemente de cabeça ou folheando
protocolo em PDF — risco de errar o corte de janela, a dose por peso ou um gate de PA.

**Oportunidade.** O CalcMed já tem o conteúdo (escalas, gates, janelas, posologia) e um Design System
maduro. Transformar o protocolo num **wizard que calcula sozinho** — com a janela viva no topo e cada
gate barrando o avanço quando inseguro — entrega velocidade + rastreabilidade + segurança que o protocolo
estático não dá.

---

## 3. Visão do produto

> "Abriu o Código AVC; siga os passos e tenha, a cada segundo, a janela, o escore, a elegibilidade e a
> dose certa — com o relógio correndo a seu favor, não contra a sua memória."

Princípios:
- **Tempo-dependente de verdade.** A janela é viva (tick de 1s); a faixa muda sozinha.
- **Gates que barram, não que avisam.** PA acima de 185/110, peso fora de faixa, deglutição não testada e
  janela estendida não confirmada **bloqueiam** o avanço — não são só texto.
- **Cálculo determinístico.** Toda regra clínica é função pura em `avcData.js` (porte 1:1 do golden),
  testável e auditável; a UI só consome derivados.
- **Apoio, não substituição.** Quem decide é o médico; a central organiza o raciocínio e registra a linha
  do tempo.
- **Mesma língua do DS.** Zero linguagem visual paralela; tokens e componentes existentes; ícones do `Icon`.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Plantonista do PS / emergência** | Porta de entrada, paciente com déficit agudo, relógio correndo | Confirmar janela, abrir Código AVC, calcular dose certa em minutos |
| **Neurologista / referência de AVC** | Avaliação à beira-leito, decisão de reperfusão | NIHSS estruturado, gates de contraindicação, decisão trombólise × trombectomia |
| **Intensivista / enfermaria** | Pós-trombólise, primeiras 24h | Meta de PA dinâmica, glicemia, deglutição, linha do tempo |

**Contexto físico:** mobile, uma mão, ambiente com pressa. Implicações: passos curtos, valores grandes e
escaneáveis, cronômetro do caso no header, persistência local (retomar de onde parou).

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| Reconhecimento rápido | Tempo da abertura ao "Código AVC acionado" | < 1 min |
| Janela correta | % de casos com janela registrada antes da dose | 100% |
| Dose segura | % de doses dentro do teto (TNK 25 / Alteplase 90) | 100% (trava de peso) |
| Gate de PA respeitado | % de trombólises com PA ≤ 185/110 registrada | 100% (bloqueio de avanço) |
| Completude do caso | % de casos finalizados com deglutição testada | 100% (gate de finalização) |
| Rastreabilidade | % de casos arquivados com linha do tempo | crescente |

> Telemetria **não instrumentada** no código atual. Ver §15.

---

## 6. Escopo

### 6.1 Implementado (código atual)
- **Wizard de 5 passos** (Triagem · NIHSS · Elegibilidade · Dose · Monitoramento) com navegação por
  stepper e footers contextuais.
- **Janela terapêutica viva** recomputada do horário de início vs. agora (tick de 1s), com 4 faixas.
- **Triagem:** sintoma presenciado vs. wake-up/encontrado, horário (HH:MM), Escala de Cincinnati (3 sinais),
  abertura automática do Código AVC no 1º sinal alterado.
- **NIHSS** completa: 11 domínios / 15 itens, soma, faixa de gravidade, barra de progresso, voltar com confirmação.
- **Elegibilidade:** 3 grupos de contraindicações (absolutas / patologia / relativas), gate de PA 185/110,
  veredito (inelegível / pendente DOAC / elegível).
- **Dose** por peso para TNK e Alteplase, com teto e split de bolus/infusão; estimativa por biotipo;
  trava de peso fisiológico (10–250 kg).
- **Bypass "Pular pra dose"** com 4 gates de segurança obrigatórios.
- **Confirmação de janela estendida** (mismatch) quando janela > 4,5h.
- **Monitoramento:** meta de PA dinâmica, registro de aferições, glicemia, teste de deglutição, linha do tempo.
- **Desvio Trombectomia** (T6) quando trombólise contraindicada: vaso, ASPECTS, mRS, NIHSS → recomendação.
- **Histórico** local com filtro por categoria de reperfusão e detalhe do caso (linha do tempo com offsets T+).
- **Teoria** (8 modais) e **modais info** contextuais por card.
- **Anotação** livre, **salvar paciente** (iniciais/idade/peso/sexo/obs), persistência local de tudo.

### 6.2 Estado parcial / conhecido
- **Branch AVC hemorrágico:** o estado `hemorragico` e a ação `ativarHemorragico()` existem no hook e são
  **consumidos** (chip "Hemorrágico", meta de PA agressiva 130–140, `limitePA`, filtro do histórico, modal
  de teoria), mas **não há gatilho de UI** que chame `ativarHemorragico()`. Hoje o branch só é alcançável
  por dado legado/persistido; o fluxo executável trata todo caso como isquêmico. Ver §13 e §14.
- **ABCD² / ELAN:** existem apenas como **teoria** (modais), sem fluxo de cálculo executável.

### 6.3 Fora de escopo (agora)
- Integração com prontuário (EHR) ou PACS/neuroimagem.
- Telemetria/analytics.
- Conta/login, multiusuário.

---

## 7. Arquitetura funcional

**Pipeline:** `estado clínico (useAVCState) → funções puras (avcData.js) → derivados → telas/footers/modais`.

- **`hooks/useAVCState.js`** — todo o estado do protocolo, persistido por campo em `localStorage` (chaves
  `avc_*`) via `usePersistedState`. Expõe ações (toggles, navegação, registro de eventos) e **derivados**
  (NIHSS total/gravidade, elegibilidade, dose, meta de PA). Nunca contém regra clínica crua: delega às
  funções puras.
- **`avcData.js`** — **fonte de verdade clínica**: constantes (Cincinnati, NIHSS, contraindicações, gates,
  pesos, trombolíticos) + funções puras (`janelaMinDe`, `janelaInfo`, `nihssTotal`, `nihssGravidade`,
  `avaliarElegibilidade`, `paAcima`, `calcularDose`, `metaPA`, `limitePA`, `avaliarGlicemia`,
  `avaliarTrombectomia`). Porte 1:1 do golden `avc.js` — **paridade clínica obrigatória**.
- **`AVCFlow.jsx`** — orquestra as 5 telas + T6, footers por tela, chips do header, stepper, overlays
  (info, confirmação, formulário de bypass, salvar paciente, detalhe do caso), histórico e teoria.
  A **janela viva** é um `useMemo` que depende de `now` (tick de 1s) → recomputa `janelaMin` a cada segundo.
- **`avcModais.jsx`** — dicionário `AVC_MODAIS` (info + teoria), corpo genérico `AvcModalBody` (blocos
  `p`/`list`/`section`/`helper`). Modais de NIHSS gerados dinamicamente por domínio.
- **`AVCFlow.module.css`** — só o que o DS não cobre (spacing das telas, wizard NIHSS, toggle Cincinnati,
  split de dose, histórico de PA, toast). Token-only, zero hardcode.

**Casca:** `ProtocolShell` (header com voltar/cronômetro/chips/ação Anotar, stepper, abas
Executar/Histórico/Teoria, footer). Overlays seguem os padrões do DS (`InfoSheet`, `ConfirmSheet`,
`FormSheet`, `AnnotationSheet`, `DetailSheet`, `SavePatientSheet`).

---

## 8. Requisitos funcionais (RF)

### 8.1 Sessão, navegação & header
- **RF-01** A central abre em **app-shell** com 3 abas: **Executar** (wizard), **Histórico**, **Teoria**.
- **RF-02** O header exibe título "Modo AVC", subtítulo dinâmico ("Aberto há mm:ss" quando há caso, senão
  "Protocolo de AVC"), ação **Anotar** (ativa quando há anotação) e o botão voltar.
- **RF-03** O **cronômetro do caso** conta desde `iniciadoEm` (formato `mm:ss`, vira `h+mm` após 1h),
  atualizado a cada 1s.
- **RF-04 · Chips do header** (derivados em tempo real):
  - "Hemorrágico" (tom crítico) se `hemorragico`, senão "Isquêmico" se o caso iniciou.
  - "NIHSS {total}" se total > 0.
  - "Janela {h}h{mm}" se há janela calculada.
- **RF-05 · Stepper** de 5 passos com estados: `active` (atual), `completed`/`warning` (visitado, conforme
  completude), `pending` (não visitado). O usuário pode tocar um passo para navegar (`irParaTela`).
  `telaMaxVisitada` registra o passo mais avançado já alcançado.
- **RF-06 · Sair:** se há dados (caso iniciado, sintoma respondido ou Cincinnati respondido), abre
  `ConfirmSheet` "Sair do protocolo?" (o caso continua salvo); senão volta direto.

### 8.2 Janela terapêutica viva
- **RF-07** A janela é recomputada a **cada segundo** a partir do horário de início vs. agora — não é
  snapshot. (Correção registrada como C1: numa central tempo-dependente a janela tem de subir sozinha.)
- **RF-08 · Parsing de horário** (`parseHHMM`): aceita "HH:MM" ou "HHMM"; auto-formata para "HH:MM" ao
  digitar; valida h ≤ 23 e m ≤ 59. Referência = hoje.
- **RF-09 · Correção de fuso/meia-noite** (`janelaMinDe`): se o horário informado é futuro em relação a
  agora:
  - **≤ 5 min de futuro** → tratado como erro de digitação → janela = 0 (agora).
  - **futuro grande** → interpretado como horário de **ontem** que cruzou a meia-noite → subtrai 24h.
- **RF-10 · Faixas da janela** (`janelaInfo`, em minutos):
  - `< 270` (< 4,5h) → **janela padrão** · trombólise IV direta após TC normal.
  - `270–539` (4,5–9h) → **janela estendida** · perfusão TC/RM com mismatch.
  - `540–1439` (9–24h) → **só trombectomia (avaliar)**.
  - `≥ 1440` (> 24h) → **fora de janela aguda**.
- **RF-11** O texto da janela ("Janela: {h}h {mm}min · {faixa}") aparece sob o campo de horário; `fora`
  (> 1440 min) troca o alerta de Triagem para "Fora de janela aguda".

### 8.3 T1 · Triagem (Cincinnati + last known well)
- **RF-12 · Início dos sintomas:** rádio "Sim, sintoma presenciado" vs. "Não · acordou assim (wake-up) ou
  foi encontrado". Ao escolher, revela o campo de horário com rótulo adaptativo ("Horário do início" vs.
  "Última vez visto normal (usaremos como início)").
- **RF-13** Quando "não" (wake-up), oferece botão para o modal **Wake-up · RM DWI-FLAIR** (janela até 9h do
  ponto médio do sono com mismatch DWI-FLAIR).
- **RF-14 · Escala de Cincinnati:** 3 sinais (Paralisia facial · Queda do braço · Alteração da fala),
  cada um com toggle Normal/Alterado e helper de como avaliar.
- **RF-15 · Abertura automática:** ao marcar o **1º sinal alterado**, se o caso ainda não iniciou, marca
  `iniciadoEm` e registra o evento "Protocolo AVC aberto · Cincinnati positivo" (tag `abertura`).
- **RF-16 · Alerta Código AVC:** com ≥ 1 sinal alterado e dentro de janela (`!fora`), exibe AlertCard
  crítico "Código AVC · Acione agora" (TC sem contraste imediata, labs em paralelo, acionar neurologia).
- **RF-17 · Avanço:** footer primário "Aplicar NIHSS" habilita só com os **3 sinais respondidos**
  (`cincinnatiRespondidos ≥ 3`); registra "Triagem confirmada" e vai para T2.
- **RF-18 · Bypass "Pular pra dose":** footer secundário abre `FormSheet` com 4 gates obrigatórios
  (todos marcados para liberar). Ver §8.9.

### 8.4 T2 · NIHSS
- **RF-19 · Wizard item-a-item:** 15 itens em ordem oficial (`NIHSS_DOMINIOS`), um por tela, com helper,
  barra de progresso (`nihssDominio / 15`), passo "Passo N de 15" e parcial corrente ("{total} pts parciais").
- **RF-20 · Pontuação por índice:** cada item usa `RadioGroup`; a seleção grava o **índice** da opção (não o
  valor) — necessário porque itens com "UN · não testável" têm valor 0 mas índice distinto. O total
  (`nihssTotal`) soma `opcoes[idx].v` de cada item.
- **RF-21 · Avançar/Concluir:** primário desabilitado até o item atual ser pontuado. No 15º item o rótulo
  vira "Concluir NIHSS", registra "NIHSS: {total} pontos" e vai para T3.
- **RF-22 · Voltar:** secundário desabilitado no 1º item; nos demais abre `ConfirmSheet` "Voltar ao passo
  anterior?" (a NIHSS oficial registra a primeira impressão; reavaliação real deve ir nas observações).
- **RF-23 · Gravidade** (`nihssGravidade`): 0 = sem déficit · 1–4 = AVC leve (Minor) · 5–15 = moderado ·
  16–20 = moderadamente grave · 21–42 = grave.

### 8.5 T3 · Elegibilidade
- **RF-24 · Três checklists de contraindicação** (toggle por grupo, contador X/N):
  - **Absolutas** ("Histórico recente e DOAC", tom crítico): DOAC < 48h; DOAC desconhecido; sangramento
    ativo; HSA; neurocirurgia/TCE grave < 3 meses; glicemia < 50 não corrigida.
  - **Patologia cerebral prévia** (tom crítico): neoplasia intracraniana; aneurisma; MAV; HIC prévia (relativa); ARIA-E/H.
  - **Cirurgia, IAM e gestação** (tom "novo"): cirurgia maior < 14d; IAM < 3m; sangramento GI/URI < 21d;
    gestação ativa; punção arterial não compressível < 7d.
- **RF-25 · Gate de PA pré-trombólise:** campos PAS/PAD; se acima de **185/110** (`paAcima`), exibe
  AlertCard "PA acima do limite" (reduzir antes; Nitroprussiato ou Labetalol) e **bloqueia o avanço**.
- **RF-26 · Veredito** (`avaliarElegibilidade`):
  - **Inelegível** (`blocked`) se qualquer absoluta crítica (DOAC, sangramento, HSA, cirurgia-SNC,
    HGT baixa) ou patologia (neoplasia, aneurisma, MAV, ARIA) → AlertCard crítico com motivo + "avaliar
    trombectomia". Footer primário vira **"Avaliar Trombectomia"** → T6.
  - **Pendente** (`doacIncerto`, "DOAC desconhecido") → AlertCard warning: solicitar TTPa/TP/anti-Xa antes.
  - **Elegível** → AlertCard result: avançar para a dose; TNK preferencial AHA/ASA 2026.
- **RF-27 · Avanço:** "Calcular dose" desabilitado se PA acima do gate; registra "Elegibilidade confirmada"
  e vai para T4.

### 8.6 T4 · Terapia de reperfusão (dose)
- **RF-28 · Peso:** campo em kg; estimativa rápida por biotipo (Pequeno 60 · Médio 75 · Grande 95 kg) que
  marca `pesoEstimado` e registra evento. Peso digitado limpa a flag de estimado.
- **RF-29 · Trava de peso fisiológico:** dose só calcula com peso **10–250 kg** (`pesoValido`); fora da faixa
  mostra erro inline e não gera dose.
- **RF-30 · Escolha do trombolítico:** TNK (preferencial 2026) ou Alteplase (rt-PA clássico).
- **RF-31 · Cálculo de dose** (`calcularDose`):
  - **TNK:** `peso × 0,25 mg/kg`, **teto 25 mg** (≥ 100 kg). Bolus único IV em 5–10s.
  - **Alteplase:** `peso × 0,9 mg/kg`, **teto 90 mg** (≥ 100 kg). Split: **bolus 10%** em 1 min +
    **infusão 90%** em 60 min.
  - Dose capada exibe badge ("Dose máxima 25/90 mg ≥ 100 kg"); peso estimado exibe aviso "confirme assim
    que possível".
- **RF-32 · Bypass ativo:** se o caso veio do bypass, AlertCard warning "Atalho de dose ativo" com botão
  "Revisar contraindicações" (vai a T3).
- **RF-33 · Avanço:** "Iniciar monitoramento" desabilitado sem dose. Antes de avançar, dispara o gate de
  janela estendida (§8.7); se ok, registra "Dose {TNK/Alteplase}: {dose} mg" e vai para T5.

### 8.7 Confirmação de janela estendida
- **RF-34** Ao confirmar a dose, se `janelaMin > 270` (> 4,5h) e ainda não confirmada, abre `ConfirmSheet`
  "Janela estendida · confirmar mismatch": a trombólise só é indicada com perfusão TC/RM com mismatch
  core-penumbra (DAWN/DEFUSE 3) ou RM DWI-FLAIR (wake-up até 9h). O médico confirma que avaliou a neuroimagem.
- **RF-35** Ao confirmar, marca `janelaConfirmada`, registra "Janela estendida confirmada · perfusão/RM
  avaliada" + a dose, e segue para T5. Cancelar volta para revisão.

### 8.8 T5 · Monitoramento
- **RF-36 · Meta de PA dinâmica** (`metaPA`):
  - **Hemorrágico** → "PAS 130–140 mmHg" (redução agressiva).
  - **Pós-trombólise** (há dose) → "< 180/105 mmHg" (monitorar 15/15 min nas 2h).
  - **Sem reperfusão** → "≤ 220/120 mmHg" (tratar só acima).
- **RF-37 · Registrar PA agora:** PAS/PAD com validação de plausibilidade (`PA_MONITOR_RANGE`: PAS 60–260,
  PAD 30–160). Fora da faixa → erro "Valor incomum"; campos vazios → "Preencha PAS e PAD". Aferição válida
  entra no histórico (toast "PA registrada") e registra evento.
- **RF-38 · Histórico de PA:** últimas 5 aferições; cada uma colorida em crítico se acima do `limitePA` do
  cenário (hemorrágico 140/90 · pós-trombólise 180/105 · sem reperfusão 220/120).
- **RF-39 · Glicemia capilar** (`avaliarGlicemia`, meta 140–180): < 140 → "abaixo da meta" (reavaliar 30 min;
  < 50 corrigir já); > 180 → "acima da meta" (insulina regular).
- **RF-40 · Teste de deglutição** (50 mL): Aprovado · Falhou · Ainda não testado. Aprovado/Falhou registram
  evento. É **gate de finalização**.
- **RF-41 · Linha do tempo:** `Timeline` com todos os eventos registrados (hora + ação + status visual por tag).
- **RF-42 · Finalizar:** "Finalizar" desabilitado enquanto a deglutição não for testada (`disfagia` ≠ vazia/
  "não-feito"). Abre o `SavePatientSheet`.

### 8.9 Bypass "Pular pra dose" (4 gates)
- **RF-43** O bypass pula NIHSS e a checagem de contraindicações. `FormSheet` exige marcar **os 4 gates**
  (`BYPASS_GATES`): sem DOAC < 48h (ou exames normais/reversor); sem sangramento ativo/diátese grave; PA ≤
  185/110; glicemia > 50 (ou corrigida). Só libera com os 4 marcados.
- **RF-44** Ao confirmar: marca início, `bypassUsado = true`, registra o evento de bypass e salta direto
  para **T4 (dose)**. Os passos pulados ficam em estado `warning` no stepper.

### 8.10 T6 · Trombectomia mecânica (desvio)
- **RF-45** Alcançado por T3 inelegível ("Avaliar Trombectomia"). Avalia critérios AHA/ASA 2026 expandidos:
  - **Vaso** (`TROMBEC_VASO_OPCOES`): ACI/M1 · M2 dominante (até 6h) · Basilar (até 24h) · sem oclusão.
  - **ASPECTS** 0–10 (helper: ≥ 6 padrão · 0–5 expandido SELECT2/ANGEL-ASPECT).
  - **mRS prévio:** 0–1 (independente) · ≥ 2 (dependência prévia · risco/benefício).
- **RF-46 · Recomendação** (`avaliarTrombectomia`, requer vaso + ASPECTS + mRS), na ordem de precedência:
  1. **Sem oclusão** → sem indicação (manter clínico, considerar trombólise se elegível).
  2. **mRS ≥ 2** → avaliar risco-benefício (discutir com família/neurologia).
  3. **NIHSS < 6 fora de basilar** → benefício incerto · avaliar individualmente.
  4. **ASPECTS < 6** → recomendada mesmo assim (critério expandido SELECT2/ANGEL-ASPECT).
  5. **Basilar** → trombectomia de basilar até 24h.
  6. **M2** → indicada até 6h.
  7. **ACI/M1** (caso base) → recomendada · acionar hemodinâmica.
- **RF-47** Footer: "Registrar e ir ao monitoramento" → T5; secundário volta a T3.

### 8.11 Histórico, teoria & persistência
- **RF-48 · Arquivar caso:** ao salvar, monta o caso (iniciais, data, duração, NIHSS, janela, peso,
  trombolítico, dose, Cincinnati, disfagia, hemorrágico, glicemia, anotação, eventos), prepende ao
  histórico, reseta o protocolo e vai para a aba Histórico (toast "Caso arquivado").
- **RF-49 · Finalizar sem salvar:** reseta o protocolo ao estado padrão (toast "Protocolo reiniciado").
- **RF-50 · Filtro do histórico** (≥ 2 desfechos reais): Todos · Trombólise · Hemorrágico · Sem reperfusão;
  categoria derivada (`hemorragico` → hemorrágico; `doseTotal` → trombólise; senão sem-reperfusão).
- **RF-51 · Detalhe do caso:** `DetailSheet` com seções Caso/Conduta, linha do tempo com **offsets T+**
  relativos ao início (`T+{min}min` / `T+{h}h{mm}`), anotação e ressalva ("salvo apenas neste aparelho").
  Excluir é confirmado por `ConfirmSheet` destrutivo.
- **RF-52 · Teoria:** 8 itens → modais (NIHSS, Cincinnati, Janelas, Gates de PA, Trombectomia, ABCD²,
  ELAN 2023, AVC hemorrágico).
- **RF-53 · Modais info por card:** cada card com `onInfo` abre um `InfoSheet` do dicionário `AVC_MODAIS`;
  NIHSS gera um modal por domínio dinamicamente.
- **RF-54 · Persistência:** todo o estado persiste em `localStorage` por campo (`avc_*`). O caso retoma de
  onde parou ao reabrir.
- **RF-55 · Anotação:** `AnnotationSheet` salva texto livre, marca `anotacaoEditadaEm` e registra evento.

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Paridade clínica:** `avcData.js` é porte **1:1** do golden `avc.js`; nunca aproximar valores/
  cortes. As funções são puras e auditáveis.
- **RNF-02 · Design System:** 100% tokens/componentes existentes; **zero hardcode** de cor/fonte/espaçamento;
  ícones do `Icon` (sem emoji em chrome).
- **RNF-03 · Proximidade (Gestalt):** escala das telas — seções 24 / dentro 16 / grupos 12–8; título↔
  conteúdo com mais ar antes; pares lógicos juntos. Ver `CLAUDE.md` §1.
- **RNF-04 · App-shell:** header e footer fixos; só o conteúdo rola.
- **RNF-05 · Janela viva:** recomputo a cada 1s sem travar a UI (`useMemo` sobre `now`); cronômetro idem.
- **RNF-06 · Dark mode & a11y:** suporte via tokens; alvos de toque adequados; estados de erro claros.
- **RNF-07 · Copy:** tom clínico, direto, humano; não soar como IA genérica.
- **RNF-08 · Local-first:** persistência em `localStorage`; o histórico "não substitui prontuário oficial".

---

## 10. Mapa de fluxo, estados & transições

### 10.1 Grafo de telas
```
            ┌──────────── BYPASS (4 gates) ──────────────┐
            │                                            ▼
[T1 Triagem] ──Aplicar NIHSS──> [T2 NIHSS] ──Concluir──> [T3 Elegibilidade]
                                                              │
                                       ┌──────────────────────┤
                                  inelegível                elegível
                                       ▼                      ▼
                              [T6 Trombectomia]        [T4 Dose] ──(gate janela
                                       │                      │    estendida?)──┐
                                       └──Registrar──> [T5 Monitoramento] <──────┘
                                                              │
                                                          Finalizar
                                                              ▼
                                                    SavePatientSheet → Histórico
```
> O stepper permite navegação livre entre passos visitados (`irParaTela`). T6 é desvio, não 6º passo do stepper.

### 10.2 Estados-chave (useAVCState)
| Domínio | Estado | Default |
|---|---|---|
| Sessão | `iniciadoEm`, `telaAtual`, `telaMaxVisitada`, `abaAtual` | null · 1 · 1 · 'executar' |
| T1 | `sintomasPresenciado`, `horarioInicio`, `janelaMin`, `cincinnati{face,braco,fala}`, `bypassUsado`, `janelaConfirmada` | null · '' · null · nulls · false · false |
| T2 | `nihssScores{}`, `nihssDominio` | {} · 1 |
| T3 | `contras{absolutas,patologia,relativas}`, `pas`, `pad` | [] · '' · '' |
| T4 | `peso`, `pesoEstimado`, `trombolitico` | '' · null · 'tnk' |
| T5 | `paAfericoes[]`, `glicemia`, `disfagia`, `iniciais` | [] · '' · null · '' |
| T6 | `trombecVaso`, `trombecAspects`, `trombecMRS` | null · '' · null |
| Desvio | `hemorragico`, `eventos[]`, `anotacao`, `anotacaoEditadaEm` | false · [] · '' · null |

### 10.3 Completude por passo (stepper)
| Passo | `completed` quando |
|---|---|
| 1 Triagem | `cincinnatiRespondidos ≥ 3` **ou** bypass usado |
| 2 NIHSS | 15 itens pontuados **ou** bypass usado |
| 3 Elegib. | sempre (true) |
| 4 Dose | `doseTotal != null` |
| 5 Monitor | iniciais ≥ 2 chars **e** deglutição testada |

### 10.4 Eventos registrados (tags → status na Timeline)
`abertura` (info) · `t1`/`t3`/`t4` · `nihss` (success) · `bypass` · `janela` · `dose` (success) · `pa` ·
`disfagia` (success) · `hemorragico` · `anotacao`. Tags não mapeadas caem em `info`.

---

## 11. Cálculos (fórmulas & cortes)

| Cálculo | Função | Regra |
|---|---|---|
| Janela (min) | `janelaMinDe` | `agora − horário`; futuro ≤5min → 0; futuro grande → −24h |
| Faixa de janela | `janelaInfo` | <270 padrão · 270–539 estendida · 540–1439 só trombectomia · ≥1440 fora |
| NIHSS total | `nihssTotal` | Σ `opcoes[idx].v` dos 15 itens (0–42) |
| NIHSS gravidade | `nihssGravidade` | 0 / 1–4 / 5–15 / 16–20 / 21–42 |
| Gate PA pré | `paAcima` | bloqueia se PAS > 185 **ou** PAD > 110 |
| Elegibilidade | `avaliarElegibilidade` | bloqueia por absolutas críticas + patologias; `doacIncerto` separado |
| Dose TNK | `calcularDose` | `peso × 0,25`, teto **25 mg** (≥100 kg), bolus único |
| Dose Alteplase | `calcularDose` | `peso × 0,9`, teto **90 mg** (≥100 kg), bolus 10%/1min + infusão 90%/60min |
| Trava de peso | `pesoValido` | 10–250 kg, senão sem dose |
| Meta PA | `metaPA` | hemorrágico 130–140 · pós-trombólise <180/105 · sem reperfusão ≤220/120 |
| Limite PA (cor) | `limitePA` | hemorrágico 140/90 · pós-trombólise 180/105 · sem reperfusão 220/120 |
| Glicemia | `avaliarGlicemia` | meta 140–180; <140 baixa · >180 alta |
| Trombectomia | `avaliarTrombectomia` | precedência: sem vaso → mRS≥2 → NIHSS<6(não-basilar) → ASPECTS<6 → basilar → M2 → ACI/M1 |

---

## 12. UX writing & tom de voz

- **Tom:** clínico, direto, imperativo de plantão. Ex.: "Código AVC · Acione agora", "Reduza a PA abaixo de
  185/110 antes da trombólise", "Bolus único IV em 5 a 10 segundos".
- **Hints de footer** orientam o gate ativo: "Pontue este item para avançar", "Reduza a PA abaixo de
  185/110 antes de avançar", "Teste de deglutição é obrigatório antes de finalizar", "Peso estimado ·
  confirme assim que possível".
- **Confirmações** explicam o porquê clínico (janela estendida exige mismatch; voltar no NIHSS lembra que a
  escala registra a primeira impressão).
- **Ressalvas** sem alarmismo: "Histórico salvo apenas neste aparelho. Não substitui prontuário oficial."

---

## 13. Edge cases & tratamento

- **Horário no futuro:** ≤ 5 min tratado como agora (erro de digitação); futuro grande vira ontem (−24h).
- **Fora de janela (> 24h):** Triagem troca para alerta info "Fora de janela aguda" e some o alerta de
  Código AVC mesmo com Cincinnati positivo.
- **Peso fora de 10–250 kg:** erro inline, sem dose, avanço bloqueado.
- **Janela estendida > 4,5h:** dose só prossegue após confirmação de mismatch (não é automático).
- **PA acima de 185/110 em T3:** avanço bloqueado até reduzir.
- **PA implausível no monitoramento:** rejeitada com mensagem "Valor incomum" (não entra no histórico).
- **Bypass:** pula NIHSS e contraindicações; T4 mostra aviso persistente e atalho para revisar contras.
- **Deglutição não testada:** finalização bloqueada.
- **Sair com caso em andamento:** confirmação; o caso permanece salvo (retomável).
- **Branch hemorrágico sem gatilho de UI:** a lógica consome `hemorragico`, mas nenhum controle o ativa no
  fluxo atual — todo caso executável é tratado como isquêmico (ver §14).

---

## 14. Decisões de produto registradas

- **Janela viva, não snapshot (correção C1).** A janela é recomputada a cada segundo do horário vs. agora; o
  campo `avc_janela_min` persistido é mantido por compatibilidade, mas a UI usa o valor vivo.
- **Pontuação NIHSS por índice, não por valor.** Itens com "UN · não testável" (valor 0) precisam ser
  distinguíveis da opção 0 real; por isso a seleção grava o índice da opção.
- **Gates que bloqueiam o avanço** (PA pré-trombólise, peso fora de faixa, deglutição, janela estendida) — em
  vez de só avisar — para impedir conduta insegura.
- **Bypass com 4 gates obrigatórios** (P0 da Dra. Ana): pular NIHSS/contras exige atestar DOAC, sangramento,
  PA e glicemia; T4 mantém aviso de atalho e oferece revisão.
- **TNK como default e preferencial** (AHA/ASA 2026); Alteplase mantido com split bolus/infusão.
- **Trombectomia como desvio**, não 6º passo do stepper — só entra quando trombólise está contraindicada.
- **Filtro do histórico por categoria de reperfusão** (regra Rafael · ≥ 2 desfechos reais · Luis 2026-05-29),
  derivada dos campos salvos.
- **AVC hemorrágico — estado atual:** o branch existe em lógica (chip crítico, meta PA 130–140, `limitePA`
  140/90, filtro do histórico, teoria) e a ação `ativarHemorragico()` está pronta no hook (registra
  "TC: hemorragia intraparenquimatosa · desvio fluxo"), mas **não há gatilho de UI** que a invoque. Hoje o
  branch só é alcançável por dado persistido/legado; o fluxo executável trata todo caso como isquêmico.
  **Pendência conhecida:** expor um desvio "TC mostrou sangramento" que chame `ativarHemorragico()` para
  ativar a meta agressiva e abortar trombólise/trombectomia.
- **ABCD² e ELAN 2023** ficam como teoria (modais), sem fluxo de cálculo executável.

---

## 15. Telemetria a instrumentar (futuro)
Eventos sugeridos: `avc_open`, `avc_codigo_aberto`, `avc_janela{faixa}`, `avc_nihss_done{total}`,
`avc_elegibilidade{veredito}`, `avc_bypass`, `avc_dose{droga,mg,capada}`, `avc_janela_estendida_confirm`,
`avc_pa_registrada`, `avc_disfagia{resultado}`, `avc_trombectomia{recomendacao}`, `avc_caso_arquivado`,
`avc_caso_excluido`.

---

## 16. Glossário

- **Janela terapêutica:** tempo desde o último momento em que o paciente foi visto normal (last known well);
  determina elegibilidade à reperfusão. Aqui é **viva** (recomputada a cada segundo).
- **Cincinnati:** triagem pré-hospitalar de 3 sinais (face/braço/fala); 1 alterado abre Código AVC.
- **NIHSS:** National Institutes of Health Stroke Scale — 11 domínios / 15 itens / 0–42 pontos.
- **Trombólise IV:** reperfusão farmacológica (TNK ou Alteplase) por peso.
- **Trombectomia mecânica:** reperfusão endovascular para oclusão de grande vaso (ACI/M1/M2/basilar).
- **ASPECTS:** escore tomográfico de extensão isquêmica (0–10; ≥ 6 padrão, 0–5 expandido).
- **mRS:** Rankin modificado — funcionalidade prévia (0–1 independente · ≥ 2 dependência).
- **Mismatch:** discordância core-penumbra (perfusão TC/RM) ou DWI-FLAIR que estende a janela.
- **DOAC:** anticoagulante oral direto; < 48h contraindica trombólise.
- **Bypass:** atalho "Pular pra dose" com 4 gates de segurança, quando o NIHSS já foi avaliado à beira-leito.
- **Wake-up stroke:** paciente que acorda com déficit; janela referida ao ponto médio do sono.
- **UN (não testável):** opção do NIHSS (amputação/intubação) que pontua 0 mas é distinta da opção 0.
