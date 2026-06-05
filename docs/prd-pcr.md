# PRD — Central PCR / ACLS do CalcMed (Parada Cardiorrespiratória)

> **Status:** implementado em produção (port do golden `pcr.html/.js/.css` para React) · **Autor:** time de produto/design · **Data:** 2026-06-05
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Validação clínica:** paridade ACLS/AHA 2025 revisada por Gustavo (cálculos) e Luis (fluxo/UX)
> **Código-fonte (fonte de verdade):** `src/features/pcr/` — `PCRFlow.jsx`, `pcrData.js`, `pcrModais.jsx`, `pcrAudio.js`, `hooks/usePCRState.js`, `PCRFlow.module.css`
> **Docs irmãos:** PRD da IA (`docs/prd-ia-calcmed.md`) · plano Figma (`docs/figma-handoff-plan.md`)

---

## 1. Sumário executivo

A **Central PCR** é o assistente de **beira-leito durante uma parada cardiorrespiratória**. Não é uma
tela de consulta: é um **copiloto de ressuscitação** que roda em tempo real, conduz o ciclo ACLS,
cronometra os marcos críticos (2 min de RCP, janela de adrenalina), dá **alarmes por áudio** (metrônomo
de compressão + voz para os marcos), calcula **cargas e doses** adulto×pediátrico e **registra a linha
do tempo** do caso para documentação posterior.

O diferencial é o **loop temporal guiado**: o app não espera o médico lembrar do relógio — ele dirige a
cadência. Três cronômetros independentes (mestre do caso, ciclo de 2 min, intervalo de adrenalina)
trabalham juntos; cada um tem **marcos** que disparam banner visual + voz; e cada ação clínica (ritmo,
choque, adrenalina, droga) é **registrada com horário e offset** e é **reversível** (undo).

A central é organizada em **três abas**: **Executar** (o fluxo ao vivo, em telas T1→T3), **Histórico**
(casos encerrados, locais ao aparelho) e **ACLS | AHA** (referência rápida — fluxogramas, cargas/doses,
via aérea, adulto e pediátrico).

Neste documento: visão, escopo, requisitos, **arquitetura de estado**, o **mapa completo de estados,
timers e cálculos**, edge cases, copy e segurança clínica.

---

## 2. Problema & oportunidade

**Problema.** Na PCR, a falha não costuma ser de conhecimento — é de **tempo e carga cognitiva**. Em
meio ao caos da reanimação, o time precisa simultaneamente: comprimir na cadência certa (100–120/min),
checar pulso/ritmo a cada 2 minutos exatos, lembrar de adrenalina a cada 3–5 minutos, escalonar
choques, buscar causas reversíveis (5H/5T), calcular doses por peso (pediatria) e ainda **anotar tudo**
para o prontuário. Cronômetros de celular soltos, contas de cabeça e memória sob estresse são fonte de
erro e atraso.

**Oportunidade.** Um único app que **assume o relógio e a aritmética** libera o médico para a clínica.
O CalcMed já tem o conteúdo ACLS/AHA validado e o Design System. Plugar um **motor de tempo + áudio +
registro** entrega cadência confiável, alarmes proativos, doses corretas por peso e uma timeline pronta
para documentar — sem depender da memória de ninguém no pior momento possível.

---

## 3. Visão do produto

> "Coloque a PCR no app e siga as compressões; ele cuida do relógio, dos alarmes e da conta — você
> cuida do paciente, e no fim o caso já está documentado."

Princípios:
- **Dirige o tempo, não só mede.** O app puxa o próximo marco (banner + voz), não espera ser consultado.
- **Ação explícita, sem auto-mágica.** Timers só avançam por **ação manual** (checar pulso, aplicar
  adrenalina). Nada de auto-reset silencioso que o médico não comandou (B4/B7).
- **Reversível por padrão.** Toda ação registrável tem **Undo** (toast ~5s).
- **Adulto e pediátrico nascem do form.** Carga/dose derivam de idade + peso preenchidos; pediatria
  nunca "aparece" sem dado.
- **Mesma língua do DS.** Zero linguagem visual paralela; tudo em tokens/componentes existentes.
- **Apoio à memória, não prontuário.** Histórico local, LGPD-safe (só iniciais), nunca substitui o
  registro oficial.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Líder da PCR (emergência/UTI)** | Comanda a reanimação, uma mão no celular, sob pressão extrema | Marcos de 2 min e adrenalina cronometrados + alarme; nunca perder o tempo |
| **Plantonista solo (PS/enfermaria)** | Primeiro a chegar, poucos braços | Metrônomo de compressão + voz que conduz o ciclo enquanto ele atua |
| **Pediatra/emergencista pediátrico** | PCR em criança/lactente | Carga (2/4/10 J/kg) e doses (adrena, amio, lido) calculadas por peso, sem conta de cabeça |
| **Quem documenta depois** | Pós-evento, evolução/prontuário | Timeline com horário + offset de cada ação, resumo e desfecho |

**Contexto físico:** ambiente de emergência, ruído, pressa, uma mão. Implicações: alvos de toque
grandes, botões de ação primários óbvios, alarme **sonoro** (não só visual), persistência (não perder o
caso se a tela travar/recarregar), e tom de copy direto e imperativo.

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| Cadência correta de compressão | % do tempo de RCP dentro de 100–120/min (metrônomo ativo) | ≥ 90% |
| Marcos de 2 min cumpridos | nº de checagens de pulso ≤ 2min05s do marco | ≥ 95% |
| Adrenalina no intervalo | % de doses dentro da janela 3–5 min escolhida | ≥ 85% |
| Doses pediátricas corretas | erros de dose/carga relatados (peso preenchido) | 0 |
| Documentação completa | % de casos salvos com timeline + desfecho | ≥ 80% |
| Recuperação de sessão | % de casos retomados após reload sem perda | 100% (persistência) |

> Telemetria ainda **não instrumentada** (paridade com o golden). Ver §15.

---

## 6. Escopo

### 6.1 Implementado (este documento)
- **Aba Executar** — fluxo ACLS ao vivo em três telas (T1 idle → T2 PCR ativa → T3 pós-evento) +
  bottomsheet de salvar.
- **Três cronômetros**: mestre do caso, ciclo de compressões (2 min), intervalo de adrenalina (3/4/5 min)
  com **marcos, alarmes e janela exata**.
- **Áudio**: metrônomo (Web Audio) por BPM selecionável + TTS (SpeechSynthesis) dos marcos clínicos.
- **Seleção de ritmo** (FV, TV s.p., AESP, Assistolia, organizado, NA) com ramificação chocável ×
  não-chocável e contexto de abertura (inicial/recheck/manual).
- **Desfibrilação** com carga derivada de idade+peso (adulto 200 J · pediátrico 2 J/kg).
- **Adrenalina** com contagem, janela exata e anti-double-tap (<30s).
- **5H/5T** (causas reversíveis) auto-disparado em ritmo não-chocável.
- **RCE** (3 critérios de apoio cognitivo, não-gate) → cuidados pós-parada.
- **Encerramento sem RCE** (óbito / suspensa).
- **Recidiva** ("Nova PCR" no mesmo paciente, cronômetro mestre contínuo).
- **Adicionar evento** (drogas, procedimento, ritmos atípicos, custom) com contador e undo.
- **Histórico** local (filtros por desfecho, detalhe com timeline, excluir, compartilhar).
- **ACLS | AHA**: Fluxogramas, Cargas e Doses, Via Aérea — adulto e pediátrico — incluindo VCV/PCV,
  TET tamanho/profundidade, ventilação pediátrica por faixa etária.
- **Anotação** livre no header (cross-protocolo), **persistência** completa (localStorage), dark mode e
  tokens DS (zero hardcode).

### 6.2 Backlog conhecido (no código como TODO)
- **Ícones definitivos por ritmo** (B1 — hoje `RitmoIcon` placeholder).
- **Mapa completo de notificação antecipada adulto×pediatria** (F03 Guilherme — 2ª dose amio 150 mg,
  lidocaína, demais drogas por ritmo/tempo).
- **Fluxogramas reais** nos modais de algoritmo / cuidados-pós / qualidade-RCP (hoje
  `PanfletoPlaceholder`).

### 6.3 Fora de escopo (agora)
- Integração com prontuário/monitor/desfibrilador.
- Sincronização em nuvem / multiusuário (histórico é local ao aparelho).
- Captura de ETCO₂ em tempo real (citado como critério textual de RCE, não medido).

---

## 7. Arquitetura funcional

**Camadas (`src/features/pcr/`):**

| Arquivo | Responsabilidade |
|---|---|
| `hooks/usePCRState.js` | **Fonte única de verdade** do caso. Todo o estado clínico + ações (persistido em localStorage, exceto flags de anti-spam de áudio). |
| `pcrData.js` | **Constantes clínicas + fórmulas puras** (cargas, doses, janela de adrenalina, ritmos, formatadores). Sem React. Paridade exata com o golden. |
| `pcrAudio.js` | **Áudio imperativo** fora do React: metrônomo (Web Audio API) + TTS (SpeechSynthesis). Singleton de módulo. |
| `pcrModais.jsx` | **Modais de decisão clínica e info** (BottomSheets via patterns do DS). |
| `PCRFlow.jsx` | **Orquestrador**: deriva valores de tempo do `now`, monta as telas/footers, dispara áudio via effects, conecta modais e persiste histórico. |
| `PCRFlow.module.css` | Layout token-only (hero T1, cards de cuidado T3, form de salvar, toast ancorado, pulse do botão Iniciar). |

**Princípio central — derivação por tick:** o `PCRFlow` mantém um `now = Date.now()` atualizado a cada
**500 ms** (só enquanto `iniciadoEm` existe). Todos os tempos exibidos (mestre, ciclo, adrenalina) são
**derivados** de `now − timestampDeReferência`; o estado guarda apenas **timestamps**, nunca contadores
incrementais de segundos. Isso torna a contagem **imune a reload** (o timestamp persiste) e elimina
drift acumulado.

**Princípio de áudio — efeitos, não estado:** o áudio é colateral. Effects no `PCRFlow` observam o
estado (`audioOn`, `cicloIniciadoEm`, `bpm`, `rce`, `cicloElapsed`, `adrenState`) e chamam as funções
imperativas de `pcrAudio.js`. As flags **anti-spam** (`avisou30s`, `avisouAdrenJanela`, etc.) vivem no
state e garantem que cada alarme de voz dispare **uma vez por marco**.

---

## 8. Requisitos funcionais (RF)

### 8.1 Sessão & navegação
- **RF-01** A central tem **3 abas** (`executar`, `historico`, `teoria`/"ACLS | AHA") via `ProtocolShell`.
  A aba ativa persiste (`pcr_aba_atual`).
- **RF-02** A aba **Executar** renderiza uma das telas por `telaAtual` (1=idle, 2=PCR ativa, 3=pós-evento);
  salvar é um **bottomsheet** sobreposto, não uma tela.
- **RF-03** O **header** (`ProtocolShell`, domínio `pcr`) mostra título "Modo PCR", subtítulo "Aberto há
  {mm:ss}" (mestre) ou "Aguardando início", e ações: **toggle de áudio** e **anotação** (badge se
  preenchida). Voltar (←) chama o guard de saída.
- **RF-04** **Chips do header** só aparecem com PCR aberta: `Ciclo N`, `Adren ×N`, ritmo (com tom
  crítico/atenção) e `RCE`. A tela idle fica limpa (sem "Ciclo 1" solto).
- **RF-05** **Sair** (←): se houver caso em andamento (`iniciadoEm` ou ciclo > 1 ou adrenalina > 0), abre
  confirm "Sair do Modo PCR?" — o caso **continua aberto** no aparelho (retomável pelo hub). Sem caso,
  sai direto.

### 8.2 T1 — Iniciar
- **RF-06** A T1 é um **hero minimalista**: ícone batimento, "Pronto para iniciar" e instrução. Único
  botão é **"Iniciar PCR"** no footer, com **animação de pulso** (respeita `prefers-reduced-motion`).
- **RF-07** "Iniciar PCR" (`iniciarPCR`): grava `iniciadoEm = now`, vai para T2, **NÃO** inicia o ciclo
  de compressões (`cicloIniciadoEm = null`), registra evento "PCR iniciada", reseta flags de áudio e
  **já abre o Selecionar Ritmo** em contexto `inicial`.
- **RF-08** Ao iniciar com áudio ligado, o TTS fala **"PCR iniciada. Inicie as compressões."** (não
  inicia metrônomo ainda — só quando as compressões começam, F04).

### 8.3 T2 — PCR ativa · Compressões
- **RF-09** Enquanto as compressões não começam (`cicloIniciadoEm == null`), o card de Compressões
  mostra **"00:00 · Aguardando"** com o texto "Cronômetro do caso já está correndo" e o botão **"Iniciar
  compressões"**.
- **RF-10** "Iniciar compressões" (`iniciarCompressoes`): grava `cicloIniciadoEm = now`, `cicloAtual = 1`,
  registra "Compressões iniciadas" e **liga o metrônomo** no BPM atual (via effect).
- **RF-11** Com compressões ativas, o card mostra o **tempo do ciclo** (mm:ss), meta "Ciclo N", barra de
  **progresso** (`cicloElapsed / CICLO_MS`), seletor de **BPM** (100/110/120) inline e o botão **"Checar
  ritmo / pulso"**.
- **RF-12** O BPM é selecionável a quente; mudar o BPM **reinicia o metrônomo** no novo intervalo (effect
  reage a `s.bpm`).
- **RF-13** Aos **2:00** (`CICLO_MS`), o card entra em estado `cycle-end`: meta "MARCO N · CHECAR",
  botão "Checar ritmo/pulso" vira **vermelho** (danger), banner crítico pulsante.
- **RF-14** Aos **1:30** (30 s antes do marco), banner crítico "Ns · prepare desfibrilador".
- **RF-15** "Checar ritmo / pulso" (`onChecarPulsoRitmo`) abre o **CheckarPulsoRitmoSheet** ("Ritmo
  organizado com pulso?"):
  - **Sim** → `confirmarRCE([])` → T3 pós-RCE.
  - **Não** → reabre Selecionar Ritmo em contexto `recheck`.

### 8.4 T2 — Ritmo & desfibrilação
- **RF-16** **Selecionar ritmo** (`SelecionarRitmoSheet`) oferece 6 opções: FV (chocável), TV s.p.
  (chocável), AESP (não-chocável), Assistolia (não-chocável), **Ritmo organizado c/ pulso** (→ RCE) e
  **Não avaliado**.
- **RF-17** A seleção **ramifica pelo contexto de abertura**:
  - `inicial` (pós-Iniciar PCR): registra ritmo **sem** incrementar ciclo; chocável → abre Choque;
    não-chocável → abre 5H/5T (após 250 ms).
  - `recheck` (pós-checar sem pulso) / `manual` (tile): registra **com undo**; chocável → Choque;
    não-chocável → **retoma compressões** (novo ciclo) + 5H/5T.
  - **Organizado**: se PCR aberta → abre Confirmar RCE; sem PCR aberta → toast "ritmo organizado com
    pulso · sem indicação de PCR".
- **RF-18** O **tile "Desfibrilar"** mostra a **carga calculada** (label) e fica **desabilitado** se o
  ritmo não for chocável. Tocá-lo abre o Choque.
- **RF-19** **Aplicar choque** (`AplicarChoqueSheet`, "Desfibrilado / Não desfibrilado"): se confirmado,
  registra o choque com a carga (tag `choque`), **retoma compressões** (novo ciclo) e toast com undo
  "Choque {carga} · retome compressões".

### 8.5 T2 — Adrenalina
- **RF-20** O card de Adrenalina começa **zerado** ("Aguardando 1ª dose"); o timer só conta **após a 1ª
  dose** (`ultimaAdrenalinaEm`). Mostra o contador `×N` no rótulo.
- **RF-21** O **intervalo** (3/4/5 min) é selecionável inline (`Segmented`) e define a **janela exata**.
- **RF-22** "Apliquei agora" (`onAplicarAdrenalina`): se a última dose foi há **< 30 s**, abre confirm
  **anti-double-tap**; senão aplica direto. Registra "Adrenalina ×N · 1 mg IV/IO" (tag `droga`), com undo.
- **RF-23** Após a 1ª dose, o card mostra **barra de progresso + marcadores** da janela (início no
  intervalo escolhido, fim em +1 min) e estados: `window-pre` (próxima em N min) → `window-ok` ("JANELA
  ABERTA") → `window-overdue` ("ATRASADA", botão vermelho).
- **RF-24** O botão "info" do card mostra toast "Adrenalina · 1 mg IV/IO 3-5 min · diluir 1:10 em SF".

### 8.6 T2 — Notificação antecipada (medicação)
- **RF-25** Um **banner derivado** (auto-some pela própria janela de tempo, sem timer) prepara a próxima
  medicação dos casos ACLS óbvios:
  - **Amiodarona 300 mg** após o **3º choque** em ritmo chocável (visível por 30 s após o 3º choque).
  - **Adrenalina 1 mg** "chegando na janela" — 30 s antes da janela abrir (só após a 1ª dose).
- **RF-26** A **voz** (TTS) dessas notificações dispara **1× por marco** (flags `avisouAmiodarona`,
  `avisouAdrenPreparar`).

### 8.7 T2 — Eventos & timeline
- **RF-27** Toda ação registra um evento `{ hora, acao, tag }`; a **EventList** (aberta por padrão)
  mostra horário + offset (`T+Nmin`) + título + tag.
- **RF-28** O **FAB "+"** (só na T2) abre **Adicionar evento** com 4 grupos: **Drogas** (Amiodarona,
  Lidocaína, Bicarbonato), **Procedimento** (IOT), **Ritmos atípicos** (Idioventricular, Torsades),
  **Personalizados** (custom) e **Outro evento** (form livre).
- **RF-29** Aplicar um evento incrementa seu **contador** (mostra "Nª aplicação"), registra na timeline,
  fecha o sheet e mostra toast **com undo** (reverte contador + remove o evento).
- **RF-30** "Outro evento" (`OutroEventoSheet`): form Nome (obrigatório) + Dose (opcional); vira um **card
  reutilizável** (custom) até o fim do caso e é aplicado imediatamente.

### 8.8 T2 — Footer & 5H/5T
- **RF-31** O footer da T2 tem **3 ações** (Pausa · Stop · RCE) + **hint clínico dinâmico**:
  ritmo NA → "Selecionar ritmo"; fim de ciclo → "Checar pulso · 10s"; adrenalina overdue → "Adrenalina
  ATRASADA"; chocável → "próximo choque {carga}"; não-chocável → "revise 5H/5T".
- **RF-32** **Pausa** registra "PCR pausada" (cronômetro continua). **Stop** abre Encerrar sem RCE.
  **RCE** abre Confirmar RCE.
- **RF-33** O **5H/5T** (`HHTTSheet`) lista as 10 causas reversíveis (5H: Hipovolemia, Hipóxia, H+
  acidose, Hipo/hiperK+, Hipotermia · 5T: Tensão/pneumo, Tamponamento, Toxinas, TEP, Trombose
  coronária) e é auto-disparado em ritmo não-chocável.

### 8.9 T3 — Pós-evento
- **RF-34** A T3 ramifica pelo desfecho:
  - **RCE** (`s.rce`): banner sucesso + **lista de cuidados pós-PCR** (ECG 12 derivações/SCA, via aérea
    com capnografia, SpO₂ 90–98%, PAM ≥ 65 / Nora 0,01–1 mcg/kg/min, CDT 32–37,5 °C por 24h) + aviso de
    recidiva. Se RCE, o TTS fala "Retorno da circulação espontânea confirmado…".
  - **Encerrada** (óbito/suspensa): banner crítico + **resumo do caso** (ciclos · adrenalina · ritmo
    final).
- **RF-35** **RCE detectado** **para o metrônomo** (effect).
- **RF-36** Footer T3:
  - RCE → **"Nova PCR"** (recidiva) + **"Salvar paciente"**.
  - Encerrada → só **"Salvar paciente"** (recidiva não cabe pós-óbito/suspensa).
- **RF-37** **Nova PCR** (`novaPcrOpen`): pergunta "recidiva no mesmo paciente ou novo paciente?":
  - **Mesmo paciente** → `registrarRecidiva` (incrementa ciclo, retoma T2, mantém dados, registra
    "RECIDIVA"; o **mestre não zera**).
  - **Outro paciente** → `resetarEstado` (zera tudo, volta à T1).

### 8.10 Salvar paciente
- **RF-38** "Salvar paciente" abre o **FormSheet** com: Iniciais (obrigatório, máx 6, upper-case),
  Idade (anos + meses), Peso (kg), Sexo (opcional), **Desfecho** (Revertida/Não revertida/Óbito/Suspensa),
  Observações. **Sem campo altura** (A5 — altura só no VCV adulto).
- **RF-39** Salvar exige **iniciais ≥ 1 caractere** (gate). Gera o caso (`id`, `iniciadoEm`, `duracaoMs`,
  desfecho, idade/peso/sexo, ritmo final, adrenalina, ciclos, obs, eventos), prepende ao histórico,
  **reseta o estado** e leva à aba Histórico.
- **RF-40** "Finalizar sem salvar" **reseta** o estado (descarta o caso) sem persistir no histórico.

### 8.11 Histórico
- **RF-41** A aba **Histórico** (`HistoryScreen`) lista casos encerrados (iniciais, status do desfecho,
  "Início DD/MM HH:MM:SS", duração), com **filtros por desfecho** (Todas/Revertida/Não revertida/Óbito/
  Suspensa).
- **RF-42** Tocar um caso abre o **detalhe** (`DetailSheet`): seções Caso (início, duração, idade, peso),
  Desfecho (desfecho, ritmo final), Operação (adrenalinas, ciclos), **Timeline** dos eventos e Observações.
- **RF-43** No detalhe: **Excluir** (confirm destrutivo, irreversível) e **Compartilhar** (resumo via
  `navigator.share` ou clipboard).
- **RF-44** O histórico persiste em `localStorage` (`pcr_historico`) e é **local ao aparelho** (nota LGPD
  no detalhe: "não substitui prontuário oficial").

### 8.12 ACLS | AHA (teoria)
- **RF-45** A aba tem um **toggle Adulto/Pediátrico** (`teoriaAP`) e **3 sub-abas**: **Fluxogramas**,
  **Cargas e Doses**, **Via Aérea** (`teoriaSubAtiva`).
- **RF-46** **Fluxogramas**: Algoritmo PCR, Causas reversíveis (abre 5H/5T), Cuidados pós-PCR, Qualidade
  RCP — descrições mudam por adulto/pediátrico. (Algoritmo/cuidados/qualidade hoje abrem
  `PanfletoPlaceholder`.)
- **RF-47** **Cargas e Doses** (input de peso só no pediátrico): cards de Desfibrilação, Adrenalina,
  Amiodarona, Lidocaína (com input de peso embutido no adulto), Magnésio — valores **calculados por peso**
  no pediátrico (ver §10).
- **RF-48** **Via Aérea**: VCV, PCV (adulto e pediátrico) + **TET tamanho** e **TET profundidade** (só
  pediátrico).
- **RF-49** **VCV adulto** calcula **peso predito ARDSnet** (altura + sexo) → VC 6–8 mL/kg. **VCV/PCV
  pediátrico** seleciona faixa etária (`VENT_PEDIATRIA`).

### 8.13 Áudio
- **RF-50** O **toggle de áudio** no header liga/desliga metrônomo + TTS; ao ligar, fala "Áudio ligado";
  ao desligar, **para fala e metrônomo** imediatamente.
- **RF-51** O **metrônomo** só toca quando `audioOn && cicloIniciadoEm && !rce` (compressões ativas, sem
  RCE).
- **RF-52** Ao **desmontar** o componente (sair por qualquer caminho), fala e metrônomo são **silenciados**
  (cleanup).

### 8.14 Anotação
- **RF-53** A ação **"Anotar"** (header, badge se preenchida) abre o `AnnotationSheet` (cross-protocolo):
  texto livre persistido (`pcr_anotacao`) + timestamp de edição; pode salvar (toast) ou limpar.

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Design System:** 100% sobre tokens e componentes existentes (`ProtocolShell`, `TimerCard`,
  `BannerContextual`, `AlertCard`, `OptionCard`, BottomSheet patterns, etc.). **Zero hardcode** de
  cor/fonte/espaçamento (CSS usa `--esp-*`, `--ds-*`, `--ds-r-*`). Micro-valores sub-4px (ex.: bullet 8px)
  são a exceção tolerada do próprio DS.
- **RNF-02 · Proximidade (Gestalt):** par ação↔descrição junto, título↔conteúdo, grupos distintos
  respiram. Ver `CLAUDE.md` §1.
- **RNF-03 · App-shell:** header e footer fixos (`flex-shrink:0`); só a área de conteúdo rola. FAB e toast
  ancorados no viewport de 390px (não na janela do browser).
- **RNF-04 · Precisão temporal:** estado guarda **timestamps**, não contadores. Tick de **500 ms** para
  renderização suave; os marcos são avaliados contra `Date.now()` real (sem drift). Cleanup de todos os
  `setInterval` (master tick e metrônomo).
- **RNF-05 · Áudio robusto:** Web Audio com `resume()` se suspenso (autoplay policy); TTS em `try/catch`
  (bloqueio silencioso). Singletons de módulo evitam conflito com React 19 strict mode (impure calls).
- **RNF-06 · Persistência:** todo o estado clínico em `localStorage` via `usePersistedState` — caso
  **sobrevive a reload**. Flags de anti-spam de áudio são in-memory (reset no reload é aceitável).
- **RNF-07 · Acessibilidade:** banner de medicação com `role="alert"`; `prefers-reduced-motion` desativa o
  pulse do botão Iniciar; alvos de toque grandes (botões `lg`).
- **RNF-08 · Reversibilidade:** ações clínicas registráveis retornam função **undo** (toast ~5s);
  destrutivas (excluir caso, encerrar) usam confirm destrutivo.
- **RNF-09 · Copy:** tom clínico, imperativo, direto; sem jargão de IA. Auditar antes de entregar.

---

## 10. Mapa de cálculos clínicos (fonte de verdade · `pcrData.js`)

> ⚠️ **Paridade exata** com o golden ACLS/AHA 2025. Nunca aproximar arredondamento, dose ou energia.

### 10.1 Carga de desfibrilação — `getCargaInicial(idade, peso)`
Deriva a carga do **form** (`idadeEmAnos(paciente)` + `peso`):
- **Adulto** (idade ≥ 18, ou sem idade): **`200 J · bifásico`** (escalonar até 360 J).
- **Pediátrico** (idade < 18 **e** peso preenchido): **`{2×peso} J · 2 J/kg`** (1º choque).
- Pediátrico sem peso: fallback de texto `2-4 J/kg`.

`idadeEmAnos` lê `idadeAnos`; se vazio, usa `idadeMeses/12`. *(Correção C1: antes `s.idade` nunca era
preenchido, então a carga/dose pediátrica nunca disparava.)*

### 10.2 Cargas pediátricas — `calcCargasPediatricas(peso)`
- 1º choque: **`round(peso × 2)` J** (2 J/kg)
- 2º choque: **`round(peso × 4)` J** (4 J/kg)
- subsequentes (máximo): **`round(peso × 10)` J** (10 J/kg, **teto = dose adulto**)

### 10.3 Doses pediátricas — `calcDosesPediatricas(peso)`
- **Adrenalina:** `(peso × 0,01).toFixed(2)` mg (0,01 mg/kg IV/IO; string 2 decimais)
- **Amiodarona:** `round(peso × 5)` mg (5 mg/kg; repetir até 15 mg/kg total)
- **Lidocaína:** `peso` mg (1 mg/kg)

### 10.4 Lidocaína adulto — `calcLidocainaAdulto(peso)`
- 1ª dose: `round(peso × 1)`–`round(peso × 1,5)` mg (1–1,5 mg/kg)
- doses seguintes: 0,5–0,75 mg/kg
- **máximo total:** `round(peso × 3)` mg (3 mg/kg)

### 10.5 Doses adulto fixas (cards Cargas e Doses)
- **Adrenalina:** 1 mg IV/IO a cada 3–5 min (ampola 1 mg/mL sem diluir; FV/TV após 2º choque,
  AESP/Assistolia imediato).
- **Amiodarona:** 1ª dose **300 mg**, 2ª dose **150 mg** após o próximo choque (FV/TV refratária; diluir
  em SG 5% 20 mL).
- **Magnésio:** 1–2 g IV/IO (Torsades de Pointes; diluído em 10 mL SG 5%).

### 10.6 Peso predito ARDSnet (Devine) — `calcPesoPreditoARDSnet(altura, sexo)`
`round(base + 0,91 × (altura − 152,4))`, base = 45,5 (feminino) ou 50 (masculino). Usado no **VCV
adulto** → VC = 6–8 × peso predito mL.

### 10.7 TET profundidade pediátrica — `calcTETProfundidade({diametro, altura, peso})`
3 métodos: por **tubo** `diâmetro × 3`; por **altura** `altura/10 + 5`; por **peso** `6 + peso` (cm na
rima labial).

### 10.8 TET tamanho (tabela `TET_TAMANHO_ROWS`)
Diâmetro interno por faixa, sem/com cuff — de neonato pré-termo (2,5 mm) a > 2 anos (`idade/4 + 4` sem
cuff, `idade/4 + 3,5` com cuff).

### 10.9 Ventilação pediátrica (`VENT_PEDIATRIA`)
6 faixas (pré-termo, termo, lactente, pré-escolar, escolar, adolescente) com VC, FR, PEEP, pico e I:E.

---

## 11. Mapa de timers (precisão · marcos · cleanup)

| Timer | Referência | Início | Reset | Marcos / alarmes |
|---|---|---|---|---|
| **Mestre do caso** | `iniciadoEm` | "Iniciar PCR" | só `resetarEstado` (recidiva **não** zera) | exibido no header "Aberto há mm:ss"; salvo como `duracaoMs` |
| **Ciclo de compressões** | `cicloIniciadoEm` (`null` até iniciar) | "Iniciar compressões" | **só por ação manual**: checar pulso, choque, ritmo não-chocável recheck/manual, recidiva (B4/B7 — sem auto-reset) | **1:30** → banner "30s · prepare desfibrilador" + voz "Trinta segundos…"; **2:00** (`CICLO_MS`) → estado `cycle-end`, banner crítico pulsante "Marco N · CHECAR PULSO/RITMO" |
| **Adrenalina** | `ultimaAdrenalinaEm` (`null` até 1ª dose) | 1ª dose | cada nova dose | **janela exata** (B6): `window-pre` até `m`; `window-ok` em `[m, m+1)` + voz "Janela de adrenalina aberta"; `window-overdue` ≥ `m+1` + voz "Atenção. Adrenalina atrasada." (m = 3/4/5 min); **30s antes** de abrir → banner+voz "Prepare adrenalina" |

**Janela de adrenalina** (`getAdrenalinaJanela`): `inicioMs = m × 60s` (EXATO no tempo selecionado),
`fimMs = (m+1) × 60s` (tolerância overdue de 1 min). *(B6: antes era `[m−1, m+1]`; agora `[m, m+1]`.)*

**Anti-spam de voz:** cada alarme tem flag (`avisou30s`, `avisouAdrenJanela`, `avisouAdrenAtrasada`,
`avisouAmiodarona`, `avisouAdrenPreparar`) que dispara a voz **uma vez** e reseta no início de cada novo
ciclo/dose (ou no reset do caso). `avisouAmiodarona` **não** reseta por ciclo nem por recidiva (é marco do
caso; a timeline preserva `choqueCount ≥ 3`).

**Cleanup:** o master tick (`setInterval 500ms`) só roda com `iniciadoEm` e tem `clearInterval` no
return. O metrônomo tem `pararMetronomo()` no return do seu effect e no unmount global.

**Precisão:** os marcos comparam tempo derivado de `Date.now()` (não um contador acumulado), então um
reload no meio da PCR retoma a contagem correta a partir do timestamp persistido.

---

## 12. Mapa de estados, telas e transições

### 12.1 Telas (aba Executar)
| Tela | Condição | Conteúdo |
|---|---|---|
| **T1 · Idle** | `telaAtual=1` (estado inicial / pós-reset) | Hero "Pronto para iniciar" + botão Iniciar PCR pulsante |
| **T2 · PCR ativa** | `telaAtual=2` | Banner contextual + card Compressões + card Adrenalina + tiles (Ritmo, Desfibrilar) + EventList + FAB + footer (Pausa/Stop/RCE) |
| **T3 · Pós-evento** | `telaAtual=3` | RCE → cuidados pós-PCR · encerrada → resumo |

### 12.2 Estados do card Compressões
`aguardando` (sem `cicloIniciadoEm`) → `running` → `cycle-end` (≥ 2:00). 30s antes: aviso visual no banner.

### 12.3 Estados do card Adrenalina
`idle` (sem dose) → `window-pre` → `window-ok` (janela aberta) → `window-overdue` (atrasada).

### 12.4 Grafo de transições (ações principais)

```
T1 ──[Iniciar PCR]──▶ T2 (+ abre Selecionar Ritmo "inicial")
                       │
   ┌───────────────────┼─────────────────────────────────────┐
   │                   │                                       │
[Iniciar           [Selecionar ritmo]                     [Footer]
 compressões]          │                                       │
   │            ┌──────┼───────┬──────────────┐         ┌──────┼──────┐
 metrônomo ON  FV/TV  AESP/Ass  organizado    NA      Pausa  Stop    RCE
   │            │      │         │                       │     │      │
   │          [Choque] └▶5H/5T  [Confirmar RCE]──┐   evento  [Encerrar │
   │            │        +ciclo                  │   pausa    sem RCE]  │
   │       [Desfibrilado]                        │     │       │       │
   │            │ +ciclo, retoma RCP             ▼     ▼       ▼       ▼
   │            ▼                               T3 (RCE)      T3 (encerrada)
[Checar ritmo/pulso] ──[Sim: organizado+pulso]──▶ T3 (RCE)
   │            └──────[Não: sem pulso]──▶ Selecionar Ritmo "recheck" (+ciclo)
   │
[Apliquei adrenalina] ──[<30s?]──▶ confirm anti-double-tap
                        └─────────▶ dose ×N (+undo)

T3 (RCE) ──[Nova PCR]──┬─[Mesmo paciente]──▶ recidiva (+ciclo, mestre contínuo) ──▶ T2
                       └─[Outro paciente]──▶ resetarEstado ──▶ T1
T3 (qualquer) ──[Salvar paciente]──┬─[Salvar]──▶ histórico + reset ──▶ aba Histórico
                                   └─[Finalizar sem salvar]──▶ reset ──▶ T1
```

### 12.5 Catálogo de modais (`pcrModais.jsx` + inline no `PCRFlow`)
| Modal | Tipo | Abre quando | Resultado |
|---|---|---|---|
| **SelecionarRitmoSheet** | BottomSheet (6 OptionCards) | Iniciar PCR / tile Ritmo / recheck | ramifica por contexto (§RF-17) |
| **CheckarPulsoRitmoSheet** | BottomSheet (2 OptionCards) | "Checar ritmo/pulso" | Sim→RCE · Não→Selecionar Ritmo |
| **AplicarChoqueSheet** | ConfirmSheet | tile Desfibrilar / pós-ritmo chocável | Desfibrilado→registra+ciclo |
| **ConfirmarRCESheet** | BottomSheet (3 checkboxes) | RCE no footer / ritmo organizado | confirma RCE (critérios não-gate) |
| **EncerrarSemRCESheet** | BottomSheet (RadioGroup) | Stop | óbito / suspensa → T3 |
| **PausarSheet** | ConfirmSheet | Pausa | registra "PCR pausada" |
| **AdrenDoubleTapSheet** | ConfirmSheet destrutivo | adrenalina < 30s da última | aplica mesmo assim |
| **AdicionarEventoSheet** | BottomSheet (grupos) | FAB "+" | aplica evento (+contador, +undo) |
| **OutroEventoSheet** | BottomSheet (form) | "Outro evento" | cria card custom + aplica |
| **HHTTSheet** | InfoSheet | ritmo não-chocável / Causas reversíveis | revisar 5H/5T |
| **VCVSheet** | BottomSheet | ACLS Via Aérea | peso predito (adulto) / faixa (ped) |
| **PCVSheet** | BottomSheet | ACLS Via Aérea | pressão alvo (adulto) / faixa (ped) |
| **TETProfundidadeSheet** | BottomSheet (3 inputs) | ACLS Via Aérea (ped) | profundidade por tubo/altura/peso |
| **InfoSheet (algoritmo/cuidados/qualidade)** | InfoSheet | Fluxogramas / info dos cards | `PanfletoPlaceholder` |
| **InfoSheet (tet-tam)** | InfoSheet (TETTabela) | ACLS Via Aérea (ped) | tabela de tamanho do tubo |
| **Sair / Nova PCR / Salvar / Excluir / Detalhe / Anotação** | ConfirmSheet/BottomSheet/FormSheet/DetailSheet/AnnotationSheet | conforme fluxo | §8 |

---

## 13. Sistema de áudio (`pcrAudio.js`)

**Metrônomo (Web Audio API):**
- `iniciarMetronomo(bpm)`: cria um `setInterval` de `60000/bpm` ms; cada tick gera um oscilador **1000 Hz**,
  gain **0,05**, duração **30 ms**. Reinicia se já ativo (chamado de novo ao trocar BPM).
- `pararMetronomo()`: limpa o intervalo. `tick()` chama `ctx.resume()` se o contexto estiver `suspended`
  (política de autoplay).
- O `AudioContext` é **singleton de módulo** (criado on-demand), fora do React.

**TTS (SpeechSynthesis):**
- `falar(texto)`: `SpeechSynthesisUtterance` em **pt-BR**, rate 1, pitch 1; em `try/catch` (bloqueio
  silencioso se indisponível).
- `pararFala()`: `speechSynthesis.cancel()`.

**Marcos falados (gated por `audioOn`):**
- "PCR iniciada. Inicie as compressões." (ao iniciar)
- "Trinta segundos. Prepare o desfibrilador." (1:30)
- "Janela de adrenalina aberta." (janela ok)
- "Atenção. Adrenalina atrasada." (overdue)
- "Prepare amiodarona, trezentos miligramas." (3º choque)
- "Prepare adrenalina, um miligrama." (30s antes da janela)
- "Retorno da circulação espontânea confirmado. Inicie os cuidados pós-parada." (RCE)
- "Áudio ligado" (toggle on)

**Warm-up / permissão:** não há warm-up explícito; o `resume()` no primeiro tick destrava o contexto
após o gesto do usuário (ligar áudio / iniciar compressões). Ao **desligar áudio** ou **desmontar**, fala
e metrônomo param imediatamente.

---

## 14. Edge cases & tratamento

- **Reload no meio da PCR** → estado persistido (timestamps) retoma a contagem correta; flags de
  anti-spam resetam (re-anuncia marcos pendentes, aceitável).
- **Ciclo NÃO auto-reseta** (B4/B7) → se o médico não checar pulso, o ciclo passa de 2:00 e fica em
  `cycle-end` (banner pulsante) até a ação manual — sem avançar sozinho.
- **Janela de adrenalina antes da 1ª dose** → card fica `idle`/zerado; nenhum alarme de janela dispara.
- **Double-tap de adrenalina (<30s)** → confirm bloqueia aplicação acidental; "Aplicar" força.
- **Ritmo organizado sem PCR aberta** → toast informativo (não inicia parada).
- **Desfibrilar com ritmo não-chocável** → tile **desabilitado** (não há caminho de choque indevido).
- **Encerrar sem RCE** → `telaAtual=3` (não existe T4; bug evitado: o conteúdo ramifica por `rce`).
- **RCE para o metrônomo** mas o mestre continua (caso pode ter recidiva).
- **Recidiva** → mestre **não** zera; `avisouAmiodarona` **não** re-dispara (timeline preserva choques).
- **Sair durante a PCR** → confirm; caso continua aberto (retomável). Unmount silencia áudio.
- **Clipboard/share indisponível** (compartilhar caso) → fallback para clipboard; senão toast de erro.
- **Salvar sem iniciais** → botão Salvar bloqueado (gate).
- **Áudio bloqueado pelo browser** (autoplay/TTS) → falha silenciosa, sem quebrar o fluxo.

---

## 15. UX writing & tom de voz

- **Tom:** clínico, **imperativo**, direto — comandos de reanimação ("Retome compressões", "Prepare o
  desfibrilador", "Checar pulso · 10s"). Frases curtas, sem "calor" de assistente.
- **Hints dinâmicos** guiam a próxima ação por estado (§RF-31).
- **Voz** é telegráfica e clínica (números por extenso para clareza: "trezentos miligramas").
- **LGPD na copy:** "Apoio à memória. LGPD: nunca substitui prontuário."; "Histórico salvo apenas neste
  aparelho. Não substitui prontuário oficial."
- **Toasts** confirmam ação + oferecem **Desfazer** quando reversível.
- **Proibições:** jargão de IA, prometer integração inexistente, emoji em chrome (ícones do DS).

---

## 16. Segurança clínica

- **RCE não é gate:** os 3 critérios (pulso central, ETCO₂ > 40, onda PA invasiva) são **apoio
  cognitivo** — "mesmo critério parcial é evidência; decida clinicamente". O médico confirma RCE
  livremente.
- **Carga/dose pediátrica só com dado** → derivam de idade < 18 **e** peso; sem peso, mostram fórmula
  textual (não inventam número). Correção **C1** garantiu que a idade do form realmente alimenta o cálculo.
- **Janela de adrenalina exata (B6)** → evita sugerir dose antes da hora (antes `[m−1, m+1]`, agora
  `[m, m+1]`).
- **Anti-double-tap** → evita registro/dose duplicada acidental de adrenalina.
- **Sem auto-reset de ciclo (B4/B7)** → o app não "decide" que o ciclo acabou; a checagem de pulso é
  sempre ação humana.
- **5H/5T proativo** em ritmo não-chocável → força a busca por causa reversível.
- **Reversibilidade** (undo) em ações registráveis; **confirm destrutivo** em excluir/encerrar.
- **Limites de dose** explícitos (lidocaína máx 3 mg/kg; amio até 15 mg/kg ped; carga ped teto = adulto).
- **Histórico local + LGPD** → só iniciais; nunca substitui prontuário.

---

## 17. Persistência (chaves localStorage)

Estado clínico (via `usePersistedState`): `pcr_iniciado_em`, `pcr_tela_atual`, `pcr_aba_atual`,
`pcr_ciclo_atual`, `pcr_ciclo_iniciado_em`, `pcr_bpm`, `pcr_audio_on`, `pcr_ritmo`, `pcr_desfibrilado`,
`pcr_intervalo_adren_min`, `pcr_ultima_adren_em`, `pcr_adren_count`, `pcr_rce`, `pcr_recidiva`,
`pcr_rce_criterios`, `pcr_eventos`, `pcr_paciente`, `pcr_peso`, `pcr_altura`, `pcr_idade`, `pcr_sexo`,
`pcr_anotacao`, `pcr_anotacao_editada_em`, `pcr_teoria_sub`, `pcr_teoria_ap`. Histórico: `pcr_historico`.
Flags de anti-spam de voz são **in-memory** (não persistidas).

---

## 18. Decisões de produto registradas

- **T1 minimalista** (Luis 2026-05-28): tela inicial só com o botão Iniciar pulsando; ao tocar, já pede o
  ritmo inicial. Sem cards zerados.
- **Iniciar PCR ≠ Iniciar compressões** (F04 Gustavo): o mestre começa no Iniciar; o metrônomo e o ciclo
  só começam quando o médico sinaliza explicitamente que as compressões iniciaram.
- **1ª adrenalina zerada** (F07): o timer de adrenalina só conta após a 1ª dose.
- **Timers não auto-resetam** (B4/B7 Gustavo): só por ação manual.
- **Janela de adrenalina exata** (B6 Gustavo): `[m, m+1]`.
- **Checar pulso dentro do card de Compressões** (Luis): ação-chave do marco junto do timer, igual
  "Apliquei agora" no card de Adrenalina.
- **"Checar ritmo/pulso" desde a T2** com pergunta única "organizado + pulso?" (Luis): Sim=RCE, Não=ritmo.
- **Notificação antecipada de medicação** (F12 Gustavo) é **derivada** (sem timer próprio): a janela de
  tempo abre/fecha o banner; voz dispara 1× por marco.
- **T3 ramifica por desfecho** (RCE → cuidados · encerrada → resumo); recidiva só pós-RCE.
- **Salvar é bottomsheet**, não tela T4 (Luis): `telaAtual=4` foi eliminado (evita fallback bugado pra T1).
- **Sem campo altura no salvar** (A5): altura só no VCV adulto.
- **Cuidados pós-PCR revisados** (Luis A1–A4): STEMI→SCA, sem ETCO₂ no banner, "Nora" (não NE), "CDT
  32–37,5" (não TTM 32–36).
- **ACLS sub-tab "Fluxogramas"** (A7), antes "Panfletos".
- **Histórico com filtros via prop padrão** do `HistoryScreen` (#6), não wrap custom.
- **Campo "Início"** (A6 Luis) no histórico (timestamp `iniciadoEm`).

> **Pendências conhecidas (TODO no código):** ícones definitivos por ritmo (B1); mapa completo de
> notificação antecipada adulto×pediatria (F03 Guilherme); fluxogramas reais nos placeholders.

---

## 19. Glossário

- **ACLS:** Advanced Cardiovascular Life Support (AHA) — protocolo de suporte avançado de vida.
- **RCP:** Reanimação Cardiopulmonar (compressões + ventilação).
- **RCE:** Retorno da Circulação Espontânea (pulso + ritmo organizado).
- **Ritmo chocável:** FV (Fibrilação Ventricular) / TV sem pulso → desfibrilar.
- **Ritmo não-chocável:** AESP (Atividade Elétrica Sem Pulso) / Assistolia → RCP + 5H/5T (sem choque).
- **Marco (ciclo):** ponto de 2:00 em que se checa pulso/ritmo e se troca o compressor.
- **Janela de adrenalina:** intervalo `[m, m+1]` min em que a próxima dose é indicada.
- **5H/5T:** mnemônico das 10 causas reversíveis de parada.
- **CDT:** Controle Direcionado de Temperatura (manejo térmico pós-RCE).
- **VCV/PCV:** Ventilação Controlada a Volume / a Pressão.
- **TET:** Tubo Endotraqueal (tamanho/profundidade).
- **ARDSnet (Devine):** fórmula de peso predito para volume corrente protetor.
- **Recidiva:** nova parada no mesmo paciente após RCE (cronômetro mestre contínuo).
```
