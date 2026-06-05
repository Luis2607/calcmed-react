# PRD — Central SCA (Síndrome Coronariana Aguda / IAM) do CalcMed

> **Status:** implementado e em produção (Wave 4 · padronizado com AVC/Sepse/CAD/PCR) · **Autor:** time de produto/clínica · **Data:** 2026-06-05
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Fontes clínicas:** SBC 2025 (Diretriz SCA), Rao 2025 (ACC/AHA), Alencar 2025 (sinais OMI), ESC 2023 (algoritmo de troponina 0/1h)
> **Código-fonte (fonte de verdade):** `src/features/sca/SCAFlow.jsx` · `scaData.js` · `scaModais.jsx` · `hooks/useSCAState.js`

---

## 1. Sumário executivo

A **Central SCA** é um protocolo guiado (wizard) para o manejo de **síndrome coronariana aguda / IAM**
no plantão. Não é uma calculadora isolada de escore: é um **fluxo de decisão de 5 telas** que conduz o
médico da triagem ao destino do paciente, integrando classificação de ECG, detecção de oclusão
coronariana aguda (OMI), estratificação de risco (HEART/TIMI/HEAR), interpretação adaptativa de
troponina, árvore de reperfusão por tempo, doses por peso/idade e **travas de segurança clínica**
(locks) que bloqueiam condutas perigosas.

O diferencial é o **encadeamento de decisão**: cada tela alimenta a seguinte. A classe do ECG decide se
o caso entra na via de reperfusão; o escore + troponina decidem internar/observar/dar alta; o local de
reperfusão e o tempo até o cathlab decidem PPCI vs. fibrinólise; idade/peso/flags decidem as doses e
quais fármacos ficam bloqueados. Ao final, o caso vira um **passe estruturado** pronto para a passagem
de plantão e pode ser arquivado no histórico local.

Toda a lógica clínica é **pura** (em `scaData.js`), separada da UI, e versionada com paridade 1:1 ao
golden `calcmed/src/protocolos/sca/sca.js`. Estado 100% persistido (sobrevive a reload).

Neste documento: visão, escopo, requisitos, **arquitetura funcional**, e o **mapa completo de fluxo,
estados e cálculos** do protocolo atual.

---

## 2. Problema & oportunidade

**Problema.** No atendimento ao IAM, **tempo é músculo**. O médico precisa, em minutos, classificar o
ECG, decidir se reperfunde, estratificar risco, calcular doses corretas e escolher antitrombóticos —
tudo isso evitando erros que matam (dar AAS em dissecção, nitrato com PDE5 recente, prasugrel em quem
teve AVC, dose plena de fibrinolítico em idoso). As fontes hoje são fragmentadas (uma diretriz para o
ECG, outra para o escore, outra para a dose) e não conversam entre si.

**Oportunidade.** Encadear todas essas decisões num único fluxo guiado, com a lógica clínica embutida e
as travas de segurança automáticas, entrega **velocidade + consistência + segurança**. O CalcMed já tem
o Design System e o padrão de protocolo guiado (AVC, Sepse, CAD, PCR); a Central SCA é a aplicação desse
padrão ao cenário coronariano, que é o mais sensível a tempo e a erro de conduta.

---

## 3. Visão do produto

> "Do primeiro ECG ao destino do paciente: classifique, estratifique, reperfunda e passe o plantão —
> com as doses certas e as travas de segurança já ligadas."

Princípios:
- **Encadeado, não isolado.** Cada decisão usa o resultado da anterior; nada de escores soltos.
- **Detector de OMI, não só STEMI.** O fluxo trata oclusão aguda sem supra clássico como IAM relevante.
- **Travas por padrão.** SAA bloqueia AAS, PDE5 bloqueia nitrato, AVC/AIT bloqueia prasugrel — sem
  depender da memória do plantonista.
- **Dose certa por paciente.** Tenecteplase e antitrombóticos ajustados por peso e idade.
- **Apoio, não substituição.** Quem decide é o médico; o protocolo organiza e defende a decisão.
- **Mesma língua do DS.** Zero linguagem visual paralela; tudo em tokens/componentes existentes.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Plantonista da emergência** | Dor torácica na porta, relógio porta-ECG correndo, decisão de reperfundir | Classificar ECG e disparar a via certa em minutos |
| **Médico de UPA/serviço sem hemodinâmica** | Precisa decidir entre transferir para PCI ou fibrinolisar local | Árvore de reperfusão por tempo + dose de TNK + contraindicações |
| **Residente / médico em formação** | Plantão supervisionado, quer entender o "porquê" | Camada de teoria (sinais OMI, escores, algoritmo de troponina) |
| **Equipe que recebe o passe** | Cardiologista/CCU na ponta | Passe estruturado copiável com ECG, escore, troponina, conduta e locks |

**Contexto físico:** mobile, uma mão, ambiente de emergência com pressa. Implicações: alvos de toque
generosos, cronômetro porta-ECG visível, decisão sempre resolvida (nunca beco sem saída), estado
persistido (pode largar o celular e voltar).

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| Acelerar o porta-ECG | % de casos com ECG marcado < 10 min | crescente (meta SBC 2025) |
| Decisão de reperfusão correta | % de STEMI/OMI que entram na via de reperfusão | 100% (gate por ECG) |
| Segurança de conduta | % de casos com lock aplicado quando a flag está marcada | 100% (automático) |
| Dose correta | % de TNK com meia-dose quando idade ≥ 75a | 100% (automático) |
| Estratificação defensável | % de casos com ≥ 1 escore + troponina preenchidos | crescente |
| Continuidade do cuidado | % de casos finalizados com passe copiado | crescente |

> Telemetria ainda **não instrumentada**. Persistência e histórico já existem (base para auditoria local).

---

## 6. Escopo

### 6.1 Implementado (este documento)
- **Wizard de 5 telas** (T1 Triagem → T2 ECG → T3 Estratificar → T4 Conduzir → T5 Reavaliar), com
  navegação por `StepHeader`/stepper e regras de avanço por tela.
- **Setup "realidade do serviço"**: kit de troponina disponível e escore de risco adotado.
- **Triagem**: idade, peso, queixa principal (7 opções), anamnese (10 flags) e **alertas reativos**.
- **ECG**: cronômetro porta-ECG manual-start, classificação em 3 classes, localização de STEMI,
  **8 sinais OMI** + calculadora Sgarbossa-Smith, lock soft de "nenhum sinal".
- **Estratificação**: escores HEART/TIMI/HEAR + **troponina adaptativa por kit** (hs/conv/POCT) +
  decisão integrada de destino.
- **Conduta**: locks de segurança (SAA/PDE5/AVC), AAS, sugestão e escolha de P2Y12, anticoagulação,
  **árvore de reperfusão** (PPCI vs. fibrinólise por tempo), dose de TNK e checklist de contraindicações.
- **Reavaliação**: detecção do tipo de IAM, conduta de internação/observação, **passe estruturado
  copiável** e linha do tempo de eventos.
- **Histórico** local (arquivar/abrir/excluir) com filtros, **anotação** livre, **passe de plantão**.
- **Teoria** ("consulta rápida") com 5 sheets de referência.
- Dark mode, a11y e tokens DS (zero hardcode), seguindo o padrão dos demais protocolos.

### 6.2 Fora de escopo (agora)
- Integração com prontuário eletrônico (EHR) e com hemodinâmica.
- GRACE calculado dentro do app (citado nas condutas, não calculado).
- Cronômetros porta-balão / porta-agulha / ECG seriado ativos na UI (estado existe no hook, **ainda não
  exposto no fluxo** — ver §13).
- Checklist de alta (estado `alta` existe no hook, **não renderizado** — ver §13).
- Telemetria/analytics.

---

## 7. Arquitetura funcional

**Pipeline:** `estado persistido (useSCAState) → funções clínicas puras (scaData) → derivados na SCAFlow → UI (DS) + modais`.

Camadas:
- **`hooks/useSCAState.js`** — fonte única de verdade. Todo estado em `usePersistedState` (localStorage),
  abre **limpo** (sem paciente demo). Expõe setters, toggles, ações de cronômetro e `resetProtocol`.
- **`scaData.js`** — **lógica clínica pura** (sem React): constantes (opções, itens de escore, sinais
  OMI, contraindicações, condutas) + funções de cálculo (escore, troponina, decisão, reperfusão, doses,
  tipo de IAM, passe). É a fonte de verdade clínica e o que precisa ir para o Figma/spec.
- **`SCAFlow.jsx`** — orquestra: lê o estado, chama as funções puras, monta os **derivados clínicos** e
  renderiza as 5 telas + histórico + teoria + todos os modais via `ProtocolShell`.
- **`scaModais.jsx`** — sheets de decisão e info (Sgarbossa, sinal OMI, info genérica, queixa, onde
  reperfundir, P2Y12).

**Derivados clínicos** recalculados a cada render em `SCAFlow.jsx` (reativos ao estado):
`escore`, `trop`, `decisao`, `reperf`, `tipoIam`, `conduta`, `alertas`, `tnk`, `fibBloqueado`,
`p2y12Sug`, `passe`, além de `elapsed` (cronômetro master) e `portaEcgMs` (cronômetro porta-ECG).

**Componentes DS usados:** `ProtocolShell`, `StepHeader`, `ClinicalCard`, `ChecklistBlock`, `OptionCard`,
`RadioGroup`, `Segmented`, `Select`/`SelectSheet`, `InputField`, `ScoreCriterionGroup`, `ScoreResult`,
`AlertCard`, `TimerCard`, `Timeline`, `HistoryScreen`, `TheoryScreen`, e os patterns de overlay
(`ConfirmSheet`, `AnnotationSheet`, `DetailSheet`, `SavePatientSheet`, `InfoSheet`, `BottomSheet`).

---

## 8. Requisitos funcionais (RF)

### 8.1 Sessão, navegação e shell
- **RF-01** A central abre **limpa** (sem paciente demo). Todo o estado é persistido em localStorage e
  sobrevive a reload.
- **RF-02** Header é o **ProtocolShell** (domínio `sca`): voltar (←), título "Modo SCA", subtítulo
  ("Síndrome coronariana aguda" ou "Aberto há `H:MM`" quando iniciado), ação **Anotar**, **chips** de
  contexto e o **stepper** das 5 telas.
- **RF-03** O protocolo **inicia o cronômetro master** (`iniciadoEm`) ao avançar para a tela 2 (ou
  qualquer tela ≥ 2). Antes disso, não há sessão "aberta".
- **RF-04** Navegação por stepper: tocar num passo **anterior** ao atual volta para ele; passos à frente
  só pelo botão "Continuar" do rodapé (respeitando os gates de validação).
- **RF-05** O rodapé é contextual por tela: T1 só "Continuar"; T2–T4 "Voltar" + "Continuar"; T5 "Voltar"
  + "Finalizar". O hint do rodapé reflete o estado da decisão.
- **RF-06** Três abas no shell: **Executar** (o wizard), **Histórico**, **Teoria** (consulta rápida).
- **RF-07** Sair com sessão aberta exige confirmação (`ConfirmSheet` "Sair do Modo SCA?"); o caso
  continua salvo no aparelho. Sem sessão aberta, sai direto.

### 8.2 Chips de contexto (header)
- **RF-08** Com sessão aberta, o header mostra chips dinâmicos: **idade** (`{n}a`, mono), **classe do
  ECG** (STEMI/OMI/Preocupante, tom crítico/atenção) e **escore** (`HEART 5` etc., mono) quando preenchido.

### 8.3 T1 · Triagem
- **RF-09** **Realidade do serviço** (dois `RadioGroup`): kit de troponina (`hs` / `conv` / `poct` /
  `ambos`) e escore adotado (`heart` / `timi` / `ambos`).
- **RF-10** **Dados do paciente**: idade (numérico, máx. 3 díg.), peso (decimal, máx. 5), **queixa
  principal** (abre `SelectSheet` com 7 opções). Botão de info abre o sheet "Por que esses dados importam?".
- **RF-11** **Anamnese**: `ChecklistBlock` com 10 flags; mostra contador `{marcadas}/{total}`. Algumas
  flags **viram travas de segurança** adiante (texto: "alguns viram travas de segurança adiante").
- **RF-12** **Alertas reativos**: ao marcar flags / informar idade / escolher queixa, renderiza
  `AlertCard`s na ordem de prioridade (ver §10.3).
- **RF-13** Gate de avanço T1→T2: idade **e** peso numéricos **e** queixa selecionada (`dadosT1Ok`).

### 8.4 T2 · ECG
- **RF-14** **Cronômetro porta-ECG** (manual-start): estado `idle` com botão "Iniciar cronômetro"; após
  iniciar, conta em `MM:SS`, meta < 10 min, com faixa de cor (verde < 10 · amarelo 10–15 · vermelho > 15,
  SBC 2025); botão "Marcar ECG realizado" congela o tempo final e registra evento.
- **RF-15** **Classificação do ECG** em 3 `OptionCard`s: **STEMI clássico** (crítico), **ECG
  preocupante** (atenção), **Sem STEMI, checar OMI** (info / detector IAM).
- **RF-16** Se **STEMI**: pede **localização** (anterior/inferior/lateral/posterior). STEMI **inferior**
  dispara alerta para checar aVL recíproco e derivações direitas (V3R-V4R / VD).
- **RF-17** Se **OMI**: lista os **8 sinais OMI** como `OptionCard`s (tom crítico, multi-seleção).
  - **espelho posterior** marcado → alerta "Pedir V7-V9".
  - **Sgarbossa-Smith** marcado → botão abre a **calculadora Sgarbossa-Smith** (`SgarbossaSheet`).
  - **nenhum sinal** marcado → **lock soft**: checkbox "Confirmo que revisei os 8 sinais e nenhum está
    presente" (libera o avanço sem sinal).
- **RF-18** Se **preocupante**: alerta "Observação monitorizada" (repetir ECG em 10–20 min, segunda opinião).
- **RF-19** Gate de avanço T2→T3 (`tela2Valida`): STEMI exige localização; preocupante sempre libera;
  OMI exige ao menos 1 sinal **ou** o lock soft confirmado.

### 8.5 T3 · Estratificar
- **RF-20** **Seletor de escore** (`Segmented`): HEART / TIMI / HEAR.
- **RF-21** HEART e HEAR: critérios em `ScoreCriterionGroup` (acordeão, um aberto por vez via
  `scoreExpandido`), cada item com opções pontuadas. TIMI: 7 itens binários (+1 cada).
- **RF-22** Quando preenchido, mostra `ScoreResult` com total, categoria (baixo/intermediário/alto) e
  máximo de pontos do escore.
- **RF-23** **Troponina**: 1ª dosagem sempre; 2ª dosagem (seriada) salvo quando o kit é POCT; unidade
  segue o kit (`ng/mL` para convencional, `ng/L` para os demais). Botão **"Pular troponina (decisão
  preliminar)"** quando a 1ª está vazia.
- **RF-24** **Decisão integrada** (`AlertCard` com `decisao.titulo`/`corpo`): combina classe de ECG +
  escore + troponina para sugerir internar/observar/alta (ver §10.6). T3 **não tem gate** — avança sempre
  (decisão pode ficar "frágil"; o hint do rodapé avisa).

### 8.6 T4 · Conduzir
- **RF-25** **Locks de segurança** (alertas no topo, condicionais às flags):
  - `saa` → "AAS suspenso · suspeita de SAA" (não dar AAS empírico; aplicar ADD-RS).
  - `avcPrevio` → "Prasugrel bloqueado" (Classe 3 Harm, Rao 2025; usar ticagrelor/clopidogrel).
  - `pde5` → "Nitratos bloqueados" (PDE5 recente; sem nitrato por 24–48h).
- **RF-26** **Antiagregação e anticoagulação**:
  - **AAS** 200–300 mg mastigável — vira "AAS bloqueado" (crítico) se SAA marcada.
  - **Sugestão de P2Y12** automática por cenário (`p2y12Sugestao`), com filtros (AVC bloqueia prasugrel;
    idade ≥ 75 ou peso < 60 kg = dose reduzida).
  - **Escolha do P2Y12** (`SelectSheet`): prasugrel/ticagrelor/clopidogrel; prasugrel marcado como
    "bloqueado" e desabilitado quando há AVC/AIT prévio.
  - **Anticoagulação** (`doseAnticoag`): texto por peso/idade (enoxaparina/UFH, sem bolus IV se ≥ 75a).
- **RF-27** **Reperfusão** (só quando ECG é STEMI ou OMI — `isReperfusao`):
  - **Local de reperfusão** (`SelectSheet`): cathlab interno / transferência regional / fibrinólise local.
  - Se **transferência regional**: pede **tempo estimado até o cathlab** (min).
  - **Decisão de reperfusão** (`reperfusaoDecisao`): PPCI vs. fibrinólise por tempo (ver §10.8).
  - Quando a via é fibrinólise: mostra **dose de Tenecteplase** (`doseTNK`) + checklist de **8
    contraindicações** (absolutas/relativas). Contraindicação **absoluta** marcada → "Fibrinólise
    contraindicada" e prioriza transferência.
- **RF-28** T4→T5 avança sempre (sem gate).

### 8.7 T5 · Reavaliar
- **RF-29** **Conduta de internação/observação** (`ClinicalCard` com tag): renderizada a partir de
  `detectarTipoIam` → `CONDUTAS_INTERNACAO` (STEMI/OMI, NSTEMI/OMI, zona cinzenta). Sempre há conduta
  (nunca vazio).
- **RF-30** **Passe estruturado** (`montarPasse`): resumo de uma linha (iniciais, idade, peso, ECG +
  território, escore, troponina, conduta, **locks**), com botão **"Copiar passe"** (clipboard + toast).
- **RF-31** **Linha do tempo** (`Timeline`) com os eventos registrados (ex.: "ECG realizado").
- **RF-32** "Finalizar" abre o `SavePatientSheet`.

### 8.8 Finalizar, salvar e histórico
- **RF-33** Ao finalizar, o `SavePatientSheet` coleta iniciais, idade, peso, sexo, observações e mostra o
  desfecho. **Salvar** só funciona com **iniciais preenchidas**.
- **RF-34** Salvar arquiva o caso no histórico (status Internado/Observação, desfecho, duração, dados do
  diagnóstico e eventos), **reseta o protocolo** e leva à aba Histórico (toast "Caso arquivado").
- **RF-35** **"Finalizar sem salvar"** reseta o protocolo (toast "Protocolo reiniciado"), sem arquivar.
- **RF-36** Histórico (`HistoryScreen`): lista casos do aparelho, com **filtros** (Todos / Internado /
  Observação) quando há casos. Abrir um caso mostra `DetailSheet` (Caso / Diagnóstico / Observações +
  ressalva "não substitui prontuário"). **Excluir** exige confirmação (`ConfirmSheet` destrutivo).

### 8.9 Anotação e teoria
- **RF-37** **Anotar** (`AnnotationSheet`): texto livre persistido, com data de edição; ação no header
  fica "ativa" quando há anotação.
- **RF-38** **Teoria** (`TheoryScreen` "Consulta rápida"): 5 itens que abrem sheets de referência
  (Sinais OMI/IAM · HEART/TIMI/HEAR · Algoritmo de troponina · Reperfusão · Locks de segurança).

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Design System:** 100% sobre tokens e componentes existentes. **Zero hardcode** de
  cor/fonte/espaçamento (CSS só de layout; visual vem dos componentes DS). Ver `CLAUDE.md` §2.
- **RNF-02 · Proximidade (Gestalt):** seções com `--esp-6` (24px); sub-grupos com `--esp-3`; título↔
  conteúdo vinculados. Ver `CLAUDE.md` §1.
- **RNF-03 · App-shell:** header e rodapé fixos; só a área de conteúdo rola (`ProtocolShell`).
- **RNF-04 · Paridade clínica:** `scaData.js` é porte **1:1** do golden `sca.js`. "NUNCA aproximar —
  paridade clínica obrigatória." Lógica clínica fica **pura** e separada da UI.
- **RNF-05 · Persistência:** todo o estado em `usePersistedState`; sobrevive a reload; abre limpo;
  `resetProtocol` zera tudo (e respeita o escore configurado no setup).
- **RNF-06 · Decisão sempre resolvida:** nenhuma tela é beco sem saída; `detectarTipoIam` nunca retorna
  null (default seguro = zona cinzenta).
- **RNF-07 · Copy:** tom clínico, direto, com a referência citada (SBC 2025, Rao 2025, Alencar 2025,
  ESC 2023). Sem jargão de IA genérica.
- **RNF-08 · A11y/dark mode:** segue o padrão dos demais protocolos (alvos de toque, foco, escopo
  `.modo-escuro`).

---

## 10. Mapa de fluxo, estados e cálculos

### 10.1 Máquina de telas (wizard)

```
            dadosT1Ok            tela2Valida          (sem gate)        (sem gate)
T1 Triagem ───────────▶ T2 ECG ────────────▶ T3 Estratificar ──▶ T4 Conduzir ──▶ T5 Reavaliar
   (limpa)              (inicia              (escore +            (locks +         (tipo IAM +
                         master ao            troponina →          reperfusão +     conduta +
                         entrar em            decisão)             doses)           passe)
                         tela ≥ 2)
   ◀───────────────────────── stepper volta para qualquer passo anterior ──────────────────────
                                                                          Finalizar ▶ SavePatientSheet
                                                                                       ├─ Salvar → histórico + reset
                                                                                       └─ Sem salvar → reset
```

- **Gate T1→T2 (`dadosT1Ok`):** `!isNaN(idade) && !isNaN(peso) && !!queixa`.
- **Gate T2→T3 (`tela2Valida`):** STEMI → tem localização; preocupante → sempre; OMI → algum sinal **ou**
  `lockSoftOmiConfirmado`; nenhuma classe → `false`.
- **T3→T4, T4→T5:** sem gate (avança sempre; hint do rodapé sinaliza fragilidade).
- **`iniciadoEm`** é setado ao entrar em qualquer tela ≥ 2 (`iniciarProtocolo`).

### 10.2 Cronômetros

| Cronômetro | Onde | Cálculo | Faixas |
|---|---|---|---|
| **Master** (`elapsed`) | header ("Aberto há H:MM") | `now - iniciadoEm`, formato `formatarHoraMin` (`H:MM` ou `MM:SS`) | — |
| **Porta-ECG** (`portaEcgMs`) | T2, `TimerCard` | `finalMs` se marcado; senão `now - iniciadoEm + acumulado` | `faixaCrono(ms, 10, 15)`: verde < 10 · amarelo 10–15 · vermelho ≥ 15 |

> `faixaCrono(ms, metaMin, metaCriticaMin)`: `crítica = metaCriticaMin ?? metaMin*1.3`. Porta-ECG usa
> 10/15 fixos. Cronômetros porta-balão/porta-agulha/ECG-seriado existem no estado mas **não** são
> exibidos no fluxo atual.

### 10.3 Alertas reativos da triagem (`alertasTriagem`, em ordem de prioridade)

| # | Gatilho | Tipo | Título | Essência |
|---|---|---|---|---|
| 1 | `flags.saa` | warning | Suspeita de dissecção aórtica (SAA) | Não dar AAS empírico; aplicar ADD-RS; AAS bloqueado na conduta |
| 2 | `flags.pde5` | warning | PDE5 nas últimas 48h | Nitratos contraindicados 24h (sildenafil)/48h (tadalafil); bloqueio na conduta |
| 3 | `flags.gestante` | warning | Gestante | HEART/TIMI/GRACE não validados; doses modificadas; acionar cardiologista |
| 4 | `flags.avcPrevio` | info | AVC ou AIT prévio | Prasugrel bloqueado (Classe 3 Harm, Rao 2025); usar ticagrelor/clopidogrel |
| 5 | `flags.aco` | info | Em uso de anticoagulante | Tripla terapia; árvore adaptada na conduta |
| 6 | `idade ≥ 75` | info | Paciente idoso (≥ 75a) | ½ dose de TNK; enoxaparina sem bolus IV; prasugrel 5 mg/dia |
| 7 | `idade < 50` **sem** fatoresRisco/dacPrevia **e** queixa típica/atípica | info | Paciente jovem sem fatores de risco | Considerar SCAD, Takotsubo, miocardite, espasmo; cuidado com antitrombótico agressivo |

**Queixas (7):** Dor torácica anginosa · Dor torácica não anginosa · Dispneia (equivalente) · Síncope ·
Dor epigástrica · Sudorese e náusea isoladas · Outro.

**Flags de anamnese (10):** `dor10min`, `irradiacao`, `autonomicos`, `fatoresRisco`, `dacPrevia`,
`avcPrevio`, `pde5`, `saa`, `aco`, `gestante`.

### 10.4 Classificação do ECG e sinais OMI

**3 classes (`ECG_CLASSES`):** `stemi` (STEMI clássico, crítico) · `preocupante` (sem critério claro,
atenção) · `omi` (sem STEMI, checar OMI — detector IAM).

**Localizações de STEMI:** anterior (V1-V6) · inferior (DII, DIII, aVF) · lateral (DI, aVL, V5-V6) ·
posterior (V7-V9).

**8 sinais OMI (`SINAIS_OMI`):**

| id | Nome | Critério (resumo) |
|---|---|---|
| `tHiperaguda` | Onda T hiperaguda | T volumosa/larga/simétrica, desproporcional ao QRS; sinal mais precoce |
| `deWinter` | Sinal de De Winter | Infra ST ≥ 1 mm no ponto J V1-V6 + T altas/pontiagudas; oclusão proximal da DA |
| `wellens` | Síndrome de Wellens | Tipo A (T bifásica V2-V3) / Tipo B (T invertida simétrica); instabilidade da ADA |
| `aslanger` | Padrão de Aslanger | Supra DIII isolado + infra V4-V6; 6,3% dos "IAMSSST" reais |
| `espelhoPosterior` | Infra V1-V3 (espelho posterior) | Espelho de supra posterior; confirmar com V7-V8-V9 |
| `sgarbossaSmith` | BRE/BRD com sinais isquêmicos | Razão ST/S ou ST/R ≥ 0,25 = OMI; cronologia do BRE irrelevante |
| `distorcaoQrsTerminal` | Distorção terminal do QRS | Ausência de onda S e onda J em V2/V3; especificidade 100% IAM anterior (Smith) |
| `istAvlIsolado` | IST em aVL isolado | Infra ST transitório recíproco em aVL; até 97% dos IAMs inferiores (Alencar 2025) |

**Calculadora Sgarbossa-Smith** (`sgarbossaRatio`/`sgarbossaPositivo`):
`razão = |ST/S|` (mm). **Positivo se razão ≥ 0,25** → IAM (OMI) confirmado, conduzir como STEMI
equivalente. Retorna `null` se ST ou S inválidos ou S = 0.

### 10.5 Escores (itens + faixas)

**HEART** (`HEART_ITEMS`, máx. 10) — 5 itens, cada um 0/1/2:

| Item | 0 | 1 | 2 |
|---|---|---|---|
| História (anamnese) | Improvável | Moderada | Altamente suspeita |
| ECG | Normal | Repolarização inespecífica | Desvio significativo |
| Idade | < 45a | 45-64a | ≥ 65a |
| Fatores de risco | Nenhum | 1-2 fatores | ≥ 3 fatores ou DAC |
| Troponina | ≤ normal | 1-3x normal | > 3x normal |

> Faixas HEART: **< 4 baixo** · **4-6 intermediário** · **≥ 7 alto**.

**TIMI** (`TIMI_ITEMS`, máx. 7) — 7 critérios binários (+1 cada): idade ≥ 65 · ≥ 3 fatores de risco DAC ·
DAC conhecida (estenose ≥ 50%) · AAS nos últimos 7 dias · ≥ 2 episódios anginosos em 24h · desvio de ST
≥ 0,5 mm · troponina positiva.

> Faixas TIMI: **0-2 baixo** · **3-4 intermediário** · **≥ 5 alto**.

**HEAR** (`HEAR_ITEMS`, máx. 8) — HEART **sem** o item troponina (pré-laboratorial); 4 itens 0/1/2.

> Faixas HEAR: **< 3 baixo** · **3-5 intermediário** · **≥ 6 alto**.

`calcularEscore({tipo, heart, timi, hear})` → `{ total, max, categoria, preenchido }`, com
`categoria ∈ {baixo, medio, alto}`.

### 10.6 Troponina adaptativa por kit (`interpretarTroponina`)

Status possíveis: `pulada` · `pendente` · `rule-out` · `rule-in` · `observacao`.

**hs-cTn / "ambos" (algoritmo 0/1h ESC/Rao 2025, ng/L):**
- 1ª < 5 → **rule-out** (1 dosagem basta).
- sem 2ª: 1ª ≥ 52 → **rule-in** (valor já diagnóstico); senão **pendente** (aguardando 2ª em 1h).
- com 2ª: `delta = |2ª − 1ª|`.
  - delta < 3 **e** ambas < 14 → **rule-out**.
  - delta ≥ 5 **ou** 2ª ≥ 52 → **rule-in**.
  - caso contrário → **observacao** (zona cinzenta, repetir).

**Convencional (0/3/6h, ng/mL):**
- 1ª < 0,04: sem 2ª → **rule-out parcial** (confirmar 2ª em 3-6h); 2ª < 0,04 → **rule-out**.
- 1ª > 0,5 → **rule-in** (valor já diagnóstico).
- com 2ª: `deltaPct ≥ 20%` → **rule-in** (padrão dinâmico); 2ª > 0,5 → **rule-in**.
- senão → **observacao** (refazer em 3-6h, não em 1-2h).

**POCT (ng/L):** 1ª < 40 → **rule-out** (atenção em IRC) · ≥ 40 → **rule-in**.

### 10.7 Decisão integrada da estratificação (`decisaoEstratificacao`)

Prioridade (primeiro que casar vence) → `{ titulo, corpo, tipo: critico|atencao|info }`:

1. ECG STEMI **ou** OMI → **crítico** "Internação CCU · Reperfusão urgente" (estratificação é confirmatória).
2. troponina **rule-in** → **crítico** "Internação · SCA confirmado (NSTE-ACS)".
3. HEART < 4 **+** rule-out **+** preenchido → **info** "Alta segura · investigação ambulatorial" (critério SBC).
4. TIMI ≤ 2 **+** rule-out **+** preenchido → **info** "Baixo risco · investigação ambulatorial".
5. TIMI ≥ 5 → **crítico** "Alto risco · internação" (mortalidade 30d 19,9%).
6. HEART ≥ 7 → **crítico** "Alto risco · internação em CCU" (MACE 6 sem 50-65%).
7. troponina **observacao** → **atenção** "Observação · zona cinzenta".
8. troponina **pulada** → **atenção** "Decisão preliminar · troponina pendente" (HEAR cobre o pré-laboratorial).
9. nada preenchido (sem escore, sem trop, sem pulada) → **info** "Pendente · escore + troponina".
10. fallback → **info** "Em construção · complete o que falta".

### 10.8 Árvore de reperfusão (`reperfusaoDecisao`)

Só renderizada quando `isReperfusao` (ECG STEMI ou OMI). Opções de **onde reperfundir**: cathlab
interno · transferência regional · fibrinólise local.

```
onde vazio? ──▶ "Onde vai reperfundir?" (info, sem decisão)
cathlab-interno ──▶ ICP primária no hospital (sucesso · reperfusaoTipo=ppci)
transferencia-regional ─┬─ tempo vazio? ──▶ "Informe o tempo" (info)
                        ├─ tempo ≤ 120 ──▶ Transferência p/ ICP primária (sucesso · ppci)
                        └─ tempo > 120 ──▶ "Fibrinolisar localmente" (atenção · fibrinolise)
fibrinolise-local ──▶ Fibrinólise local + transferência (atenção · fibrinolise; sempre transferir)
```

`mostraFib = true` nas vias de fibrinólise → exibe dose de TNK + checklist de contraindicações.

### 10.9 Doses

**Tenecteplase (`doseTNK({peso, idade})`)** — por faixa de peso, meia-dose se ≥ 75a:

| Peso | Dose plena | ≥ 75a (½ dose) |
|---|---|---|
| < 60 kg | 30 mg | 15 mg |
| 60–69 kg | 35 mg | 17,5 mg |
| 70–79 kg | 40 mg | 20 mg |
| 80–89 kg | 45 mg | 22,5 mg |
| ≥ 90 kg | 50 mg | 25 mg |

> Retorna `null` se peso inválido. Detalhe inclui "½ DOSE (idade ≥ 75a)" ou "dose plena". Copy fixo:
> "Sempre transferir para centro com PCI após fibrinolisar."

**Anticoagulação (`doseAnticoag({peso, idade})`)** — texto:
- idade ≥ 75a → "Enoxaparina 0,75 mg/kg SC (≥ 75a: sem bolus IV) ou UFH 60 UI/kg."
- com peso → "Enoxaparina `{peso×1}` mg SC (1 mg/kg) ou UFH bolus 60-70 UI/kg (4000-5000 UI)."
- sem peso → fallback pedindo o peso.

**P2Y12 (`p2y12Sugestao`)** — filtros: `bloqPrasugrel = avcPrevio`; `doseRed = idade ≥ 75 || peso < 60`.
`ppci = reperfusaoTipo==='ppci' || (sem tipo e ECG STEMI/OMI)`.

| Cenário | Sugestão | Tipo |
|---|---|---|
| PPCI + prasugrel bloqueado | Ticagrelor 180 mg (ataque); manut. 90 mg 2x | info |
| PPCI + dose reduzida | Ticagrelor preferencial ou prasugrel 5 mg/dia | atenção |
| PPCI sem restrição | Prasugrel 60 mg ou ticagrelor 180 mg | sucesso |
| Fibrinólise | Clopidogrel 300 mg (ataque); sem ataque se ≥ 75a (75 mg/dia) | info |
| NSTE-ACS conservador | Ticagrelor 180 mg | info |

### 10.10 Contraindicações ao fibrinolítico (`CONTRA_FIBRINOLITICO`)

**Absolutas** (qualquer uma marcada → `fibrinoliticoBloqueado` = true): AVC hemorrágico prévio (qualquer
época) · AVC isquêmico < 3 meses · neoplasia/malformação vascular do SNC · sangramento ativo/diátese ·
suspeita de dissecção de aorta · TCE grave/cirurgia craniana < 3 meses.
**Relativas:** PA não controlada (> 180/110) · cirurgia maior < 3 semanas.

### 10.11 Tipo de IAM e conduta (`detectarTipoIam` + `CONDUTAS_INTERNACAO`)

`detectarTipoIam({ecgClasse, trop})` — **nunca retorna null**:
- ECG `stemi` → `stemi`.
- ECG `omi` → `stemi` (OMI classificado = STEMI-equivalente; os sinais OMI são evidência, não gate).
- trop rule-in → `nstemi-omi`.
- ECG `preocupante` **ou** trop observacao → `zona-cinzenta`.
- default → `zona-cinzenta` (seguro).

| Tipo | Tag / classe | Conduta (essência) |
|---|---|---|
| `stemi` | STEMI / OMI · critical | CCU/UTI pós-reperfusão; DAPT 12m (AAS 100 + ticagrelor/prasugrel); 3-5 dias; cateterismo feito/pós-fibrinólise; checklist de alta |
| `nstemi-omi` | NSTEMI / OMI · warning | Enfermaria (CCU se instável); DAPT 12m; 2-4 dias; cateterismo ≤ 24h (GRACE ≥ 140) ou ≤ 72h; ECG/trop seriados |
| `zona-cinzenta` | Zona cinzenta · info | Observação 24h; ECG seriado 10-20 min + trop por kit; eco à beira-leito; reclassificar com dado novo |

### 10.12 Passe estruturado (`montarPasse`)

Uma linha, campos vazios viram `-`, locks sempre presentes:
```
SCA/IAM — {iniciais}, {idade}a, {peso}kg. ECG: {STEMI|OMI|preocupante|—} ({território}).
{ESCORE total}. Troponina: {texto}. Conduta: {título}.
Locks: AAS {bloqueado por SAA|liberado}, nitrato {bloqueado por PDE5|considerar}.
```

### 10.13 Histórico (`statusCaso` + filtros)

`statusCaso(tipoIam)` → "Observação" se zona-cinzenta/null, senão "Internado". Filtros: Todos /
Internado / Observação. `statusTone`: zona-cinzenta/null = "atencao", senão "novo".

---

## 11. Mapa de modais (sheets)

| Modal | Componente | Disparo | Conteúdo / decisão |
|---|---|---|---|
| **Queixa principal** | `SelectSheet` | Select "Queixa" (T1) | 7 opções (`OPCOES_QUEIXA`) com título + sub |
| **Sgarbossa-Smith** | `SgarbossaSheet` (`BottomSheet`) | botão em T2 (sinal sgarbossaSmith) | inputs ST e S → razão ST/S; positivo ≥ 0,25 = OMI |
| **Onde reperfundir** | `SelectSheet` | Select "Local de reperfusão" (T4) | 3 opções (`ONDE_REPERFUNDIR_OPCOES`) |
| **Antiagregante P2Y12** | `SelectSheet` | Select "Antiagregante P2Y12" (T4) | 3 opções; prasugrel "bloqueado"/disabled se AVC; descrição = sugestão |
| **Info do sinal OMI** | `SinalOmiInfoSheet` (`InfoSheet`) | (teoria/info de sinal) | nome + critério do sinal |
| **Info genérica SCA** | `InfoSCASheet` (`InfoSheet`) | botões de info / teoria | título + descrição + parágrafos (`INFO_SHEETS`) |
| **Anotar** | `AnnotationSheet` | ação "Anotar" no header | texto livre persistido + data de edição |
| **Salvar paciente** | `SavePatientSheet` | "Finalizar" (T5) | iniciais (obrigatório), idade, peso, sexo, observações, desfecho; salvar / sem salvar |
| **Detalhe do caso** | `DetailSheet` | tocar caso no histórico | Caso / Diagnóstico / Observações + excluir |
| **Confirmar exclusão** | `ConfirmSheet` (destrutivo) | "Excluir" no detalhe | confirmação irreversível |
| **Confirmar saída** | `ConfirmSheet` | voltar com sessão aberta | "Sair do Modo SCA?" |

> `scaModais.jsx` também exporta `SelecionarQueixaSheet`, `OndeReperfundirSheet` e `P2Y12Sheet` (versões
> `BottomSheet`/`OptionCard`), mas o fluxo atual usa as variantes `SelectSheet` inline na `SCAFlow.jsx`.

**Sheets de teoria (`INFO_SHEETS`):** `paciente` · `ecg` · `omi-geral` (8 padrões OMI) · `escores`
(HEART/TIMI/HEAR) · `troponina` (0/1h, 0/3/6h, POCT) · `reperfusao` (PPCI ≤ 90-120 min) · `locks`.

---

## 12. UX writing & tom de voz

- **Tom:** clínico, direto, com a fonte citada quando relevante (SBC 2025, Rao 2025, Alencar 2025).
- **Títulos de decisão** carregam a ação: "Internação CCU · Reperfusão urgente", "Alta segura ·
  investigação ambulatorial", "Fibrinólise contraindicada".
- **Travas** são afirmativas e justificadas: "Prasugrel bloqueado · AVC/AIT prévio · Classe 3 Harm".
- **Cronômetro** com referência: "Verde < 10 · amarelo 10-15 · vermelho > 15 (SBC 2025)".
- **Ressalva de histórico:** "Histórico salvo apenas neste aparelho. Não substitui prontuário oficial."
- **Toasts:** "Caso arquivado no histórico", "Protocolo reiniciado", "Passe copiado", "Anotação salva".

---

## 13. Edge cases & tratamento

- **Decisão sempre resolvida:** `detectarTipoIam` nunca retorna null → T5 sempre tem conduta (default
  zona cinzenta). T3 sempre mostra uma decisão (mesmo "Pendente"/"Em construção").
- **OMI sem nenhum sinal:** lock soft (checkbox de confirmação) libera o avanço sem marcar sinal.
- **Troponina pulada:** decisão vira "preliminar"; HEAR é recomendado por cobrir o intervalo pré-laboratorial.
- **Fibrinólise com contraindicação absoluta:** dose ainda aparece, mas alerta crítico "Fibrinólise
  contraindicada" prioriza transferência para PCI.
- **STEMI/OMI → reperfusão obrigatória:** estratificação na T3 é confirmatória, não pode atrasar o cateterismo.
- **Peso/idade ausentes nas doses:** TNK retorna `null` (não mostra); anticoagulação cai no texto de fallback pedindo o peso.
- **Salvar sem iniciais:** `salvarCaso` retorna sem efeito (iniciais obrigatórias).
- **Sair com sessão aberta:** confirmação; o caso permanece salvo no aparelho.
- **Estado parcialmente implementado (conhecido):** o hook expõe cronômetros porta-balão/porta-agulha/
  ECG-seriado, `gateAvlChecado`/`gateV7v9Checado`, `aasAdministrado`/`cathLabAtivado`/`tnkAdministrado`
  e o checklist de alta (`alta`/`toggleAlta`), mas **ainda não estão expostos na UI do fluxo atual** —
  backlog de exposição/cronometragem da reperfusão e do checklist de alta.

---

## 14. Segurança clínica

- **Locks automáticos** (não dependem da memória do médico):
  - **SAA → bloqueia AAS** (suspeita de dissecção; aplicar ADD-RS antes).
  - **PDE5 → bloqueia nitratos** por 24-48h.
  - **AVC/AIT prévio → bloqueia prasugrel** (Classe 3 Harm, Rao 2025; prasugrel fica disabled no seletor).
- **Ajuste de dose por idade ≥ 75a:** ½ dose de TNK; enoxaparina sem bolus IV; prasugrel reduzido a 5 mg/dia.
- **Ajuste por peso < 60 kg:** P2Y12 em dose reduzida.
- **Contraindicações absolutas ao fibrinolítico** bloqueiam a fibrinólise e redirecionam para PCI.
- **Detector de OMI:** trata oclusão aguda sem supra clássico como STEMI-equivalente (não subnotifica IAM
  por ausência de supra).
- **Gestante / jovem sem fatores:** alertas de validação dos escores e de diferenciais (SCAD/Takotsubo/
  miocardite/espasmo).
- **Ressalva permanente:** histórico local não substitui prontuário oficial.

---

## 15. Decisões de produto registradas

- **5 telas guiadas** (Triagem → ECG → Estratificar → Conduzir → Reavaliar), padronizadas com os demais
  protocolos (AVC/Sepse/CAD/PCR) — Wave 4.
- **Cronômetros manual-start** (decisão "feedback_cronometros_manual_start"): o porta-ECG só conta após o
  médico iniciar, evitando contagem falsa.
- **Estado 100% persistido** (corrige o bug do mock React de `useState` volátil); abre **limpo** sem
  paciente demo.
- **OMI = STEMI-equivalente:** `detectarTipoIam` consolida `omi` como `stemi` (reperfunde), consistente
  com a decisão da T3. Os sinais OMI são evidência, não o gate.
- **Lógica clínica pura e versionada 1:1** com o golden (`scaData.js`); "NUNCA aproximar".
- **Sheets via patterns do DS** (não modais ad-hoc); seletores usam `SelectSheet` inline em vez de
  sheet-on-sheet.
- **Decisão nunca vazia:** todas as ramificações resolvem; default seguro = zona cinzenta.
- **Setup "realidade do serviço"** (kit de troponina + escore) adapta o algoritmo ao que o serviço
  realmente tem na ponta.

---

## 16. Glossário

- **SCA / IAM:** síndrome coronariana aguda / infarto agudo do miocárdio.
- **STEMI:** IAM com supradesnivelamento de ST persistente.
- **OMI (Occlusion MI):** oclusão coronariana aguda; pode ocorrer **sem** supra clássico (STEMI-equivalente).
- **NSTE-ACS / NSTEMI:** SCA sem supra de ST / IAM sem supra (rule-in de troponina).
- **Zona cinzenta:** caso sem fechamento diagnóstico → observação e reavaliação.
- **Porta-ECG:** tempo entre a chegada do paciente e o registro do ECG (meta < 10 min, SBC 2025).
- **PPCI / ICP primária:** angioplastia primária (reperfusão mecânica no cathlab).
- **Fibrinólise:** reperfusão farmacológica (ex.: tenecteplase/TNK).
- **HEART / TIMI / HEAR:** escores de estratificação de risco; HEAR = HEART sem troponina (pré-laboratorial).
- **hs-cTn / POCT / convencional:** kits de troponina (ultrassensível 0/1h · beira-leito · 0/3/6h).
- **DAPT:** dupla antiagregação plaquetária (AAS + P2Y12).
- **P2Y12:** antiagregante (prasugrel / ticagrelor / clopidogrel).
- **Lock:** trava de segurança que bloqueia uma conduta perigosa (SAA→AAS, PDE5→nitrato, AVC→prasugrel).
- **SAA:** síndrome aórtica aguda (dissecção); **PDE5:** inibidor de fosfodiesterase-5 (sildenafil/tadalafil).
- **Sgarbossa-Smith:** critério de OMI em BRE/BRD (razão ST/S ≥ 0,25).
- **GRACE:** escore de risco citado nas condutas (não calculado no app).
- **Passe estruturado:** resumo de uma linha pronto para a passagem de plantão.
```
